package com.mediai.dto.patient;

import java.util.List;

public record ClinicalSummaryResponse(
        String id,
        String name,
        List<String> conditions,
        int egfr,
        String bloodPressure
) {}
