package com.mediai.ai.dto;

import java.util.UUID;

public record PrescribedDrugDTO(
        UUID id,
        String name,
        String activeIngredient,
        String dosage,
        String frequency,
        String indication,
        String status,
        String statusText
) {}
