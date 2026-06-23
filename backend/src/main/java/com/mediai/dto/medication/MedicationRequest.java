package com.mediai.dto.medication;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;

public record MedicationRequest(
        UUID patientId,
        UUID drugId,
        String dosage,
        String frequency,
        String indication,
        @NotBlank String status,
        String statusText,
        LocalDate startDate,
        LocalDate endDate) {
}
