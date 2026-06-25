package com.mediai.dto.patient;

import java.util.List;

public record ClinicalSummaryResponse(
        String id,
        String name,
        List<String> conditions,
        int egfr,
        String bloodPressure,
        String sex,
        Integer age,
        Integer heightCm,
        Integer weightKg,
        String latestTest
) {}
