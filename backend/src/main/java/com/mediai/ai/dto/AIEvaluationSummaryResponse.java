package com.mediai.ai.dto;

import java.time.Instant;

public record AIEvaluationSummaryResponse(
        Long id,
        Long patientId,
        String patientName,
        Long drugId,
        String drugName,
        Integer suitabilityScore,
        Integer confidenceScore,
        String riskLevel,
        String summary,
        Instant createdAt) {
}
