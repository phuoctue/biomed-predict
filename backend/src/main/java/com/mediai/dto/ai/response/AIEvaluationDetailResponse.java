package com.mediai.dto.ai.response;

import java.util.List;

import lombok.Data;

@Data
public class AIEvaluationDetailResponse {
    private Long id;
    private Long prescriptionId;
    private Double overallScore;
    private String overallRisk;
    private Double confidenceScore;
    private String summary;
    private List<AIWarningDto> warnings;
    private List<DrugEvaluationDto> drugEvaluations;

    @Data
    public static class AIWarningDto {
        private String warningType;
        private String severity;
        private String title;
        private String description;
    }

    @Data
    public static class DrugEvaluationDto {
        private String drugName;
        private Double suitabilityScore;
        private String riskLevel;
        private String recommendation;
    }
}
