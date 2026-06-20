package com.mediai.ai.dto;

public record PrescribedDrugDTO(
        Long id,
        String name,
        String activeIngredient,
        String dosage,
        String frequency,
        String indication,
        String status,
        String statusText
) {}
