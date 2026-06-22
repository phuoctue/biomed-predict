package com.mediai.ai.dto;

import java.util.UUID;

public record EvaluationExportRequest(
    UUID patientId,
    UUID drugId,
    String riskLevel,
    String format
) {}
