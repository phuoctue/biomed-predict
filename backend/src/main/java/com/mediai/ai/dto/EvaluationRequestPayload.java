package com.mediai.ai.dto;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

public record EvaluationRequestPayload(
        @JsonProperty("patient_id") String patientId,
        @JsonProperty("patient_age") Integer patientAge,
        String diagnosis,
        @JsonProperty("drug_name") String drugName,
        String dosage,
        List<String> allergies,
        Map<String, String> labs) {
}
