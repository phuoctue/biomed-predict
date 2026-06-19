package com.mediai.dto.drug;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DrugRequest(
        @NotBlank
        @Size(max = 64)
        String code,
        @NotBlank
        @Size(max = 255)
        String name,
        @Size(max = 255)
        String genericName,
        @Size(max = 255)
        String drugGroup,
        @Size(max = 255)
        String dosageForm,
        @Size(max = 255)
        String strength,
        @Size(max = 50)
        String unit,
        @Size(max = 255)
        String manufacturer,
        String usageInstructions,
        String recommendedDose,
        String sideEffects,
        String storageCondition,
        @Size(max = 50)
        String status) {
}
