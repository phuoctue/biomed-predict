package com.mediai.dto.allergy;

import java.util.UUID;
import jakarta.validation.constraints.NotBlank;

public record AllergyRequest(
    UUID patientId,
    UUID drugId,
    UUID ingredientId,
    @NotBlank String severity,
    String reaction,
    String notes
) {}
