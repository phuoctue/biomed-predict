package com.mediai.ai.dto;

import java.time.Instant;
import java.util.List;

public record AIEvaluationResponse(
        Long id,
        Long patientId,
        String patientName,
        Long drugId,
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
