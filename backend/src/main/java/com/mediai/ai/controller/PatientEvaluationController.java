package com.mediai.ai.controller;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

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

    /**
     * Get latest evaluation summary for a patient, identified by MRN.
     * patientId parameter is actually the MRN (medical record number).
     */
    @GetMapping("/latest")
    public ApiResponse<PatientEvaluationSummaryDTO> getLatestEvaluation(@RequestParam String patientId) {
        // Query Patient by MRN (patientId param = MRN)
        String patientSql =
            "SELECT id, full_name, EXTRACT(YEAR FROM age(date_of_birth))::int AS age, " +
            "sex, allergies, diagnosis, updated_at " +
            "FROM patients WHERE mrn = ? AND deleted = false";

        List<PatientInfoDTO> patients = jdbcTemplate.query(patientSql, this::mapPatient, patientId);

        if (patients.isEmpty()) {
            return ApiResponse.ok("No patient found",
                    new PatientEvaluationSummaryDTO(null, List.of(), List.of()));
        }

        // mapPatient stores the DB id (Long as string) in patientDbId field via a
        // temporary holder — we re-query using id from the first row
        String rawDbId = jdbcTemplate.queryForObject(
                "SELECT id::text FROM patients WHERE mrn = ? AND deleted = false",
                String.class, patientId);

        if (rawDbId == null) {
            return ApiResponse.ok("No patient found",
                    new PatientEvaluationSummaryDTO(null, List.of(), List.of()));
        }

        Long dbPatientId = Long.parseLong(rawDbId);

        String drugSql =
            "SELECT pd.id::text AS id, d.name, d.generic_name, pd.dosage, pd.frequency, " +
            "pd.indication, pd.status, pd.status_text " +
            "FROM patient_drugs pd " +
            "JOIN drugs d ON pd.drug_id = d.id " +
            "WHERE pd.patient_id = ?";
        List<PrescribedDrugDTO> drugs = jdbcTemplate.query(drugSql, this::mapDrug, dbPatientId);

        String interactionSql =
            "SELECT di.id::text AS id, " +
            "d1.name || ' + ' || d2.name AS drug_pair, " +
            "di.severity, di.description, 'Risk alert' AS risk_alert, di.recommendation " +
            "FROM drug_interactions di " +
            "JOIN drugs d1 ON di.source_drug_id = d1.id " +
            "JOIN drugs d2 ON di.target_drug_id = d2.id " +
            "WHERE di.source_drug_id IN " +
            "  (SELECT drug_id FROM patient_drugs WHERE patient_id = ?) " +
            "AND di.target_drug_id IN " +
            "  (SELECT drug_id FROM patient_drugs WHERE patient_id = ?)";
        List<InteractionDTO> interactions = jdbcTemplate.query(
                interactionSql, this::mapInteraction, dbPatientId, dbPatientId);

        PatientInfoDTO patientInfo = patients.get(0);
        // Replace the temporary DB id stored in patientId field with the actual MRN
        PatientInfoDTO finalPatient = new PatientInfoDTO(
                patientInfo.name(),
                patientInfo.age(),
                patientInfo.gender(),
                patientId,          // MRN — what the frontend expects
                patientInfo.allergy(),
                patientInfo.diagnosis(),
                patientInfo.evaluatedAt());

        return ApiResponse.ok("Retrieved evaluation summary successfully",
                new PatientEvaluationSummaryDTO(finalPatient, interactions, drugs));
    }

    private PatientInfoDTO mapPatient(ResultSet rs, int rowNum) throws SQLException {
        String evaluatedAt = null;
        var ts = rs.getTimestamp("updated_at");
        if (ts != null) {
            evaluatedAt = ts.toInstant()
                    .atZone(ZoneId.systemDefault())
                    .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        }
        return new PatientInfoDTO(
                rs.getString("full_name"),
                rs.getInt("age"),
                rs.getString("sex"),
                rs.getString("id"),   // temporary: DB Long id as string
                rs.getString("allergies"),
                rs.getString("diagnosis"),
                evaluatedAt);
    }

    private PrescribedDrugDTO mapDrug(ResultSet rs, int rowNum) throws SQLException {
        String idStr = rs.getString("id");
        long fakeId = idStr != null ? Math.abs(idStr.hashCode()) : 0L;
        return new PrescribedDrugDTO(
                fakeId,
                rs.getString("name"),
                rs.getString("generic_name"),
                rs.getString("dosage"),
                rs.getString("frequency"),
                rs.getString("indication"),
                rs.getString("status"),
                rs.getString("status_text"));
    }

    private InteractionDTO mapInteraction(ResultSet rs, int rowNum) throws SQLException {
        String idStr = rs.getString("id");
        long fakeId = idStr != null ? Math.abs(idStr.hashCode()) : 0L;
        return new InteractionDTO(
                fakeId,
                rs.getString("drug_pair"),
                rs.getString("severity"),
                rs.getString("description"),
                rs.getString("risk_alert"),
                rs.getString("recommendation"));
    }
}
