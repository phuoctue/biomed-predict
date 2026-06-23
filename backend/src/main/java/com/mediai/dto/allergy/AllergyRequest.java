package com.mediai.dto.allergy;

import jakarta.validation.constraints.NotBlank;

public record AllergyRequest(
        Long patientId,
        Long drugId,
        Long ingredientId,
        @NotBlank String severity,
        String reaction,
        String notes) {
}
