package com.mediai.ai.dto;

import java.util.List;

public record PatientEvaluationSummaryDTO(
        PatientInfoDTO patient,
        List<InteractionDTO> interactions,
        List<PrescribedDrugDTO> drugs
) {}
