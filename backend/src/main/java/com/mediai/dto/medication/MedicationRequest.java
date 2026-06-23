package com.mediai.dto.medication;

import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;

public record MedicationRequest(
        Long patientId,
        Long drugId,
        String dosage,
        String frequency,
        String indication,
        @NotBlank String status,
        String statusText,
        LocalDate startDate,
        LocalDate endDate) {
}
