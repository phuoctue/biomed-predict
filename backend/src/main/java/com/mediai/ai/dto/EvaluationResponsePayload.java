package com.mediai.ai.dto;

import java.util.List;

public record EvaluationResponsePayload(
        Integer suitability_score,
        String risk_level,
        String summary,
        List<String> warnings,
        List<String> alternatives,
        String raw_explanation) {
}
