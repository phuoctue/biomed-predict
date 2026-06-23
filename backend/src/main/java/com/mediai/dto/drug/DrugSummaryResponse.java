package com.mediai.dto.drug;

import com.mediai.entity.Drug;

public record DrugSummaryResponse(
        Long id,
        String code,
        String name,
        String genericName,
        String drugGroup,
        String strength,
        String unit,
        String status) {

    public static DrugSummaryResponse from(Drug drug) {
        return new DrugSummaryResponse(
                drug.getId(),
                drug.getCode(),
                drug.getName(),
                drug.getGenericName(),
                drug.getDrugGroup(),
                drug.getStrength(),
                drug.getUnit(),
                drug.getStatus());
    }
}
