package com.mediai.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.dto.common.PageResponse;
import com.mediai.dto.patient.CreatePatientRequest;
import com.mediai.dto.patient.PatientEvaluationSummaryResponse;
import com.mediai.dto.patient.PatientResponse;
import com.mediai.dto.patient.PatientSummaryResponse;
import com.mediai.dto.patient.UpdatePatientRequest;
import com.mediai.entity.AIEvaluation;
import com.mediai.entity.Patient;
import com.mediai.exception.ResourceNotFoundException;
import com.mediai.repository.AIEvaluationRepository;
import com.mediai.repository.PatientRepository;
import com.mediai.specification.PatientSpecifications;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final AIEvaluationRepository aiEvaluationRepository;

    public PatientService(PatientRepository patientRepository, AIEvaluationRepository aiEvaluationRepository) {
        this.patientRepository = patientRepository;
        this.aiEvaluationRepository = aiEvaluationRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<PatientResponse> listPatients(String keyword, Pageable pageable) {
        Specification<Patient> specification = PatientSpecifications.keywordContains(keyword);
        Page<PatientResponse> page = patientRepository.findAll(specification, pageable).map(PatientResponse::from);
        return PageResponse.ok(
                "Patients retrieved successfully.",
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast());
    }

    @Transactional(readOnly = true)
    public PatientResponse getPatient(UUID id) {
        return PatientResponse.from(findPatient(id));
    }

    @Transactional
    public PatientResponse createPatient(CreatePatientRequest request) {
        validateUniqueIdentifiers(request.mrn(), request.citizenId(), null);

        var patient = new Patient();
        applyRequest(patient, request.mrn(), request.fullName(), request.dateOfBirth(), request.sex(),
                request.citizenId(),
                request.phone(), request.address(), request.heightCm(), request.weightKg(), request.bloodType(),
                request.insuranceNumber(), request.emergencyContactName(), request.emergencyContactPhone(),
                request.emergencyContactRelation(), request.diagnosis(), request.allergies());

        return PatientResponse.from(patientRepository.save(patient));
    }

    @Transactional
    public PatientResponse updatePatient(UUID id, UpdatePatientRequest request) {
        var patient = findPatient(id);
        validateUniqueIdentifiers(request.mrn(), request.citizenId(), id);

        applyRequest(patient, request.mrn(), request.fullName(), request.dateOfBirth(), request.sex(),
                request.citizenId(),
                request.phone(), request.address(), request.heightCm(), request.weightKg(), request.bloodType(),
                request.insuranceNumber(), request.emergencyContactName(), request.emergencyContactPhone(),
                request.emergencyContactRelation(), request.diagnosis(), request.allergies());

        return PatientResponse.from(patientRepository.save(patient));
    }

    @Transactional
    public void deletePatient(UUID id) {
        var patient = findPatient(id);
        patientRepository.delete(patient);
    }

    @Transactional(readOnly = true)
    public PatientSummaryResponse getSummary(UUID id) {
        var patient = findPatient(id);
        var history = aiEvaluationRepository.findByPatient_IdOrderByCreatedAtDesc(id).stream()
                .map(PatientEvaluationSummaryResponse::from)
                .toList();
        var latest = history.isEmpty() ? null : history.get(0);
        return new PatientSummaryResponse(PatientResponse.from(patient), latest, history);
    }

    @Transactional(readOnly = true)
    public List<PatientEvaluationSummaryResponse> getAiHistory(UUID id) {
        return aiEvaluationRepository.findByPatient_IdOrderByCreatedAtDesc(id).stream()
                .map(PatientEvaluationSummaryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public com.mediai.dto.patient.ClinicalSummaryResponse getClinicalSummary(String mrn) {
        var patient = patientRepository.findByMrnIgnoreCase(mrn)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with MRN: " + mrn));
        
        List<String> conditions = List.of();
        if (patient.getDiagnosis() != null && !patient.getDiagnosis().isBlank()) {
            conditions = List.of(patient.getDiagnosis().split("[,;\\n]+")).stream()
                    .map(String::trim)
                    .filter(c -> !c.isBlank())
                    .toList();
        }

        int egfr = 90;
        String bp = "120/80";

        String diagLower = patient.getDiagnosis() != null ? patient.getDiagnosis().toLowerCase() : "";
        if (diagLower.contains("egfr")) {
            try {
                var pattern = java.util.regex.Pattern.compile("egfr.*?(\\d+)");
                var matcher = pattern.matcher(diagLower);
                if (matcher.find()) {
                    egfr = Integer.parseInt(matcher.group(1));
                }
            } catch (Exception e) {
                // ignore
            }
        }
        if (diagLower.contains("/") || diagLower.contains("huyết áp") || diagLower.contains("blood pressure")) {
            try {
                var pattern = java.util.regex.Pattern.compile("(\\d{2,3}/\\d{2,3})");
                var matcher = pattern.matcher(diagLower);
                if (matcher.find()) {
                    bp = matcher.group(1);
                }
            } catch (Exception e) {
                // ignore
            }
        }

        return new com.mediai.dto.patient.ClinicalSummaryResponse(
                patient.getMrn(),
                patient.getFullName(),
                conditions,
                egfr,
                bp
        );
    }

    private Patient findPatient(UUID id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found."));
    }

    private void validateUniqueIdentifiers(String mrn, String citizenId, UUID currentId) {
        var existingByMrn = patientRepository.findByMrnIgnoreCase(mrn);
        if (existingByMrn.isPresent() && (currentId == null || !existingByMrn.get().getId().equals(currentId))) {
            throw new IllegalArgumentException("MRN already exists.");
        }

        if (citizenId != null && !citizenId.isBlank()) {
            var existingByCitizenId = patientRepository.findByCitizenIdIgnoreCase(citizenId);
            if (existingByCitizenId.isPresent()
                    && (currentId == null || !existingByCitizenId.get().getId().equals(currentId))) {
                throw new IllegalArgumentException("Citizen ID already exists.");
            }
        }
    }

    private void applyRequest(Patient patient,
            String mrn,
            String fullName,
            java.time.LocalDate dateOfBirth,
            String sex,
            String citizenId,
            String phone,
            String address,
            Integer heightCm,
            Integer weightKg,
            String bloodType,
            String insuranceNumber,
            String emergencyContactName,
            String emergencyContactPhone,
            String emergencyContactRelation,
            String diagnosis,
            String allergies) {
        patient.setMrn(mrn);
        patient.setFullName(fullName);
        patient.setDateOfBirth(dateOfBirth);
        patient.setSex(sex);
        patient.setCitizenId(citizenId);
        patient.setPhone(phone);
        patient.setAddress(address);
        patient.setHeightCm(heightCm);
        patient.setWeightKg(weightKg);
        patient.setBloodType(bloodType);
        patient.setInsuranceNumber(insuranceNumber);
        patient.setEmergencyContactName(emergencyContactName);
        patient.setEmergencyContactPhone(emergencyContactPhone);
        patient.setEmergencyContactRelation(emergencyContactRelation);
        patient.setDiagnosis(diagnosis);
        patient.setAllergies(allergies);
    }
}
