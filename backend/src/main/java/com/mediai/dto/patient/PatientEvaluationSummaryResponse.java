package com.mediai.dto.patient;

import java.time.Instant;

import com.mediai.entity.AIEvaluation;

public record PatientEvaluationSummaryResponse(
        Long id,
        Long drugId,
        String drugName,
        Integer suitabilityScore,
        Integer confidenceScore,
        String riskLevel,
        String summary,
        String rawExplanation,
        String modelName,
        String modelVersion,
        String warningsJson,
        String alternativesJson,
        Long processingTimeMs,
        Instant createdAt) {

    public static PatientEvaluationSummaryResponse from(AIEvaluation evaluation) {
        return new PatientEvaluationSummaryResponse(
                evaluation.getId(),
                evaluation.getDrug() != null ? evaluation.getDrug().getId() : null,
                evaluation.getDrug() != null ? evaluation.getDrug().getName() : null,
                evaluation.getSuitabilityScore(),
                evaluation.getConfidenceScore(),
                evaluation.getRiskLevel(),
                evaluation.getSummary(),
                evaluation.getRawExplanation(),
                evaluation.getModelName(),
                evaluation.getModelVersion(),
                evaluation.getWarningsJson(),
                evaluation.getAlternativesJson(),
                evaluation.getProcessingTimeMs(),
                evaluation.getCreatedAt());
    }
}
