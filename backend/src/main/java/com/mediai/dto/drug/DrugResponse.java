package com.mediai.dto.drug;

import java.time.Instant;
import java.util.UUID;

import com.mediai.entity.Drug;

public record DrugResponse(
        UUID id,
        String code,
        String name,
        String genericName,
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
                drug.getGenericName(),
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
