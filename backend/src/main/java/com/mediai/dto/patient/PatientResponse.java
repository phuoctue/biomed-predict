package com.mediai.dto.patient;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import com.mediai.entity.Patient;

public record PatientResponse(
        UUID id,
        String mrn,
        String fullName,
        LocalDate dateOfBirth,
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
        String allergies,
        Instant createdAt,
        Instant updatedAt) {

    public static PatientResponse from(Patient patient) {
        return new PatientResponse(
                patient.getId(),
                patient.getMrn(),
                patient.getFullName(),
                patient.getDateOfBirth(),
                patient.getSex(),
                patient.getCitizenId(),
                patient.getPhone(),
                patient.getAddress(),
                patient.getHeightCm(),
                patient.getWeightKg(),
                patient.getBloodType(),
                patient.getInsuranceNumber(),
                patient.getEmergencyContactName(),
                patient.getEmergencyContactPhone(),
                patient.getEmergencyContactRelation(),
                patient.getDiagnosis(),
                patient.getAllergies(),
                patient.getCreatedAt(),
                patient.getUpdatedAt());
    }
}
