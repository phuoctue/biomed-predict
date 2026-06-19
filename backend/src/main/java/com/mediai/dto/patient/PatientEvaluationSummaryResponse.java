package com.mediai.dto.patient;

import java.time.Instant;
import java.util.UUID;

import com.mediai.entity.Evaluation;

public record PatientEvaluationSummaryResponse(
        UUID id,
        Integer suitabilityScore,
        String riskLevel,
        String summary,
        String rawExplanation,
        Instant createdAt) {

    public static PatientEvaluationSummaryResponse from(Evaluation evaluation) {
        return new PatientEvaluationSummaryResponse(
                evaluation.getId(),
                evaluation.getSuitabilityScore(),
                evaluation.getRiskLevel(),
                evaluation.getSummary(),
                evaluation.getRawExplanation(),
                evaluation.getCreatedAt());
    }
}
