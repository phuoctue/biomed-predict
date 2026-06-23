package com.mediai.dto.drug;

import java.time.Instant;

import com.mediai.entity.Drug;

public record DrugResponse(
        Long id,
        String code,
        String name,
        String brandName,
        String drugGroup,
        String dosageForm,
        String strength,
        String unit,
        String manufacturer,
        String usageInstructions,
        String recommendedDose,
        String sideEffects,
        String storageCondition,
        String status,
        Instant createdAt,
        Instant updatedAt) {

    public static DrugResponse from(Drug drug) {
        return new DrugResponse(
                drug.getId(),
                drug.getCode(),
                drug.getName(),
                drug.getBrandName(),
                drug.getDrugGroup(),
                drug.getDosageForm(),
                drug.getStrength(),
                drug.getUnit(),
                drug.getManufacturer(),
                drug.getUsageInstructions(),
                drug.getRecommendedDose(),
                drug.getSideEffects(),
                drug.getStorageCondition(),
                drug.getStatus(),
                drug.getCreatedAt(),
                drug.getUpdatedAt());
    }
}
