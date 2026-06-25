package com.mediai.ai.dto;

import java.util.UUID;

public record InteractionDTO(
        UUID id,
        String drugPair,
        String severity,
        String description,
        String riskAlert,
        String recommendation
) {}
