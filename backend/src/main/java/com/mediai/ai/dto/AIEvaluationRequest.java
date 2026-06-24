package com.mediai.ai.dto;

import java.util.Map;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AIEvaluationRequest(
        @NotNull UUID patientId,
        @NotNull UUID drugId,
        @Size(max = 255) String dosage,
        Map<String, String> labs) {
}
