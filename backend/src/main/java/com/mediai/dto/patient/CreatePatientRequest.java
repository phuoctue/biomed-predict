package com.mediai.dto.patient;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePatientRequest(
        @NotBlank
        @Size(max = 64)
        String mrn,
        @NotBlank
        @Size(max = 255)
        String fullName,
        LocalDate dateOfBirth,
        @Size(max = 20)
        String sex,
        @Size(max = 64)
        String citizenId,
        @Size(max = 32)
        String phone,
        String address,
        Integer heightCm,
        Integer weightKg,
        @Size(max = 10)
        String bloodType,
        @Size(max = 64)
        String insuranceNumber,
        @Size(max = 255)
        String emergencyContactName,
        @Size(max = 32)
        String emergencyContactPhone,
        @Size(max = 100)
        String emergencyContactRelation,
        String diagnosis,
        String allergies) {
}
