package com.mediai.ai.dto;

import java.util.Map;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AIEvaluationRequest(
        @NotNull
        Long patientId,
        @NotNull
        Long drugId,
        @Size(max = 255)
        String dosage,
        Map<String, String> labs) {
}
