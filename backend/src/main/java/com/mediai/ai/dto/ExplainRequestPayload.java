package com.mediai.ai.dto;

public record ExplainRequestPayload(
        String result,
        String target_language) {
}
