package com.mediai.ai.dto;

public record InteractionDTO(
        Long id,
        String drugPair,
        String severity,
        String description,
        String riskAlert,
        String recommendation
) {}
