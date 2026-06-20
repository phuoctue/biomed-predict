package com.mediai.ai.controller;

import java.util.List;
import java.util.UUID;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mediai.ai.dto.InteractionDTO;
import com.mediai.ai.dto.PatientEvaluationSummaryDTO;
import com.mediai.ai.dto.PatientInfoDTO;
import com.mediai.ai.dto.PrescribedDrugDTO;
import com.mediai.dto.common.ApiResponse;

@RestController
@RequestMapping("/api/ai-evaluations")
public class PatientEvaluationController {

    private final JdbcTemplate jdbcTemplate;

    public PatientEvaluationController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/latest")
    public ApiResponse<PatientEvaluationSummaryDTO> getLatestEvaluation(@RequestParam String patientId) {
        // Query Patient by MRN
        String patientSql = "SELECT id, full_name, EXTRACT(YEAR FROM age(date_of_birth)) as age, sex, allergies, diagnosis, updated_at " +
                            "FROM patients WHERE mrn = ?";
        List<PatientInfoDTO> patients = jdbcTemplate.query(patientSql, this::mapPatient, patientId);
        
        if (patients.isEmpty()) {
            return ApiResponse.ok("No patient found", new PatientEvaluationSummaryDTO(null, List.of(), List.of()));
        }
        
        PatientInfoDTO patientInfo = patients.get(0);
        UUID dbPatientId = UUID.fromString(patientInfo.patientId()); // We mapped db id into patientId field temporarily or need to rethink?
        // Actually, the field `patientId` in PatientInfoDTO is supposed to be the MRN from frontend perspective. Let's map it.

        String drugSql = "SELECT pd.id, d.name, d.generic_name, pd.dosage, pd.frequency, pd.indication, pd.status, pd.status_text " +
                         "FROM patient_drugs pd " +
                         "JOIN drugs d ON pd.drug_id = d.id " +
                         "WHERE pd.patient_id = ?";
        List<PrescribedDrugDTO> drugs = jdbcTemplate.query(drugSql, this::mapDrug, dbPatientId);

        String interactionSql = "SELECT di.id, " +
                                "d1.name || ' + ' || d2.name as drug_pair, " +
                                "di.severity, di.description, 'Risk alert' as risk_alert, di.recommendation " +
                                "FROM drug_interactions di " +
                                "JOIN drugs d1 ON di.source_drug_id = d1.id " +
                                "JOIN drugs d2 ON di.target_drug_id = d2.id " +
                                "WHERE di.source_drug_id IN (SELECT drug_id FROM patient_drugs WHERE patient_id = ?) " +
                                "AND di.target_drug_id IN (SELECT drug_id FROM patient_drugs WHERE patient_id = ?)";
        List<InteractionDTO> interactions = jdbcTemplate.query(interactionSql, this::mapInteraction, dbPatientId, dbPatientId);

        PatientInfoDTO finalPatient = new PatientInfoDTO(
            patientInfo.name(),
            patientInfo.age(),
            patientInfo.gender(),
            patientId, // the MRN
            patientInfo.allergy(),
            patientInfo.diagnosis(),
            patientInfo.evaluatedAt()
        );

        PatientEvaluationSummaryDTO summary = new PatientEvaluationSummaryDTO(finalPatient, interactions, drugs);
        return ApiResponse.ok("Retrieved evaluation summary successfully", summary);
    }

    private PatientInfoDTO mapPatient(ResultSet rs, int rowNum) throws SQLException {
        return new PatientInfoDTO(
            rs.getString("full_name"),
            rs.getInt("age"),
            rs.getString("sex"),
            rs.getString("id"), // temporary pass DB UUID here
            rs.getString("allergies"),
            rs.getString("diagnosis"),
            rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toInstant().atZone(ZoneId.systemDefault()).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : null
        );
    }

    private PrescribedDrugDTO mapDrug(ResultSet rs, int rowNum) throws SQLException {
        // Mock ID for frontend DTO from UUID string hash
        long fakeId = Math.abs((long) rs.getString("id").hashCode());
        return new PrescribedDrugDTO(
            fakeId,
            rs.getString("name"),
            rs.getString("generic_name"),
            rs.getString("dosage"),
            rs.getString("frequency"),
            rs.getString("indication"),
            rs.getString("status"),
            rs.getString("status_text")
        );
    }

    private InteractionDTO mapInteraction(ResultSet rs, int rowNum) throws SQLException {
        long fakeId = Math.abs((long) rs.getString("id").hashCode());
        return new InteractionDTO(
            fakeId,
            rs.getString("drug_pair"),
            rs.getString("severity"),
            rs.getString("description"),
            rs.getString("risk_alert"),
            rs.getString("recommendation")
        );
    }
}
