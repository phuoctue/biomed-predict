package com.mediai.ai.dto;

import java.time.Instant;
import java.util.UUID;

public record AIEvaluationSummaryResponse(
        UUID id,
        UUID patientId,
        String patientName,
        UUID drugId,
        String drugName,
        Integer suitabilityScore,
        Integer confidenceScore,
        String riskLevel,
        String summary,
        Instant createdAt) {
}
