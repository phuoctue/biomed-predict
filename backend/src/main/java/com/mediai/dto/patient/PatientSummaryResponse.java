package com.mediai.dto.patient;

import java.util.List;

public record PatientSummaryResponse(
        PatientResponse patient,
        PatientEvaluationSummaryResponse latestEvaluation,
        List<PatientEvaluationSummaryResponse> aiHistory) {
}
