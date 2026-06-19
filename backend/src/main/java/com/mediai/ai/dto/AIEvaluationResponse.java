package com.mediai.ai.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record AIEvaluationResponse(
        UUID id,
        UUID patientId,
        String patientName,
        UUID drugId,
        String drugName,
        String dosage,
        String modelName,
        String modelVersion,
        Integer suitabilityScore,
        Integer confidenceScore,
        String riskLevel,
        String summary,
        List<String> warnings,
        List<String> alternatives,
        String rawExplanation,
        Long processingTimeMs,
        Instant createdAt) {
}
