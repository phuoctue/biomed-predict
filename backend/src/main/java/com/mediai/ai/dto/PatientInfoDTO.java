package com.mediai.ai.dto;

import java.util.UUID;

public record PatientInfoDTO(
        String name,
        Integer age,
        String gender,
        String patientId,
        String allergy,
        String diagnosis,
        String evaluatedAt
) {}
