package com.mediai.dto.medication;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import com.mediai.entity.PatientDrug;

// PatientDrug.id is UUID (its own @Id), Patient.id and Drug.id are Long (from BaseEntity)
public record MedicationResponse(
        UUID id,
        Long patientId,
        String patientName,
        Long drugId,
        String drugName,
        String dosage,
        String frequency,
        String indication,
        String status,
        String statusText,
        LocalDate startDate,
        LocalDate endDate,
        Instant createdAt) {

    public static MedicationResponse from(PatientDrug pd) {
        return new MedicationResponse(
                pd.getId(),
                pd.getPatient() != null ? pd.getPatient().getId() : null,
                pd.getPatient() != null ? pd.getPatient().getFullName() : null,
                pd.getDrug() != null ? pd.getDrug().getId() : null,
                pd.getDrug() != null ? pd.getDrug().getName() : null,
                pd.getDosage(),
                pd.getFrequency(),
                pd.getIndication(),
                pd.getStatus(),
                pd.getStatusText(),
                pd.getStartDate(),
                pd.getEndDate(),
                pd.getCreatedAt());
    }
}
