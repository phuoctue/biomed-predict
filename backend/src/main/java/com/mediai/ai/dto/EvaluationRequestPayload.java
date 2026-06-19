package com.mediai.ai.dto;

import java.util.List;
import java.util.Map;

public record EvaluationRequestPayload(
        String patientId,
        Integer patientAge,
        String diagnosis,
        String drugName,
        String dosage,
        List<String> allergies,
        Map<String, String> labs) {
}
