package com.mediai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "evaluations")
public class AIEvaluation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drug_id")
    private Drug drug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluator_id")
    private User evaluator;

    @Column(name = "model_name", length = 100)
    private String modelName;

    @Column(name = "model_version", length = 50)
    private String modelVersion;

    @Column(columnDefinition = "text")
    private String prompt;

    @Column(columnDefinition = "text")
    private String response;

    @Column(name = "processing_time_ms")
    private Long processingTimeMs;

    @Column(length = 255)
    private String dosage;

    @Column(name = "labs_json", columnDefinition = "text")
    private String labsJson;

    @Column(name = "suitability_score", nullable = false)
    private Integer suitabilityScore;

    @Column(name = "confidence_score")
    private Integer confidenceScore;

    @Column(name = "risk_level", nullable = false, length = 50)
    private String riskLevel;

    @Column(columnDefinition = "text")
    private String summary;

    @Column(name = "raw_explanation", columnDefinition = "text")
    private String rawExplanation;

    @Column(name = "warnings_json", columnDefinition = "text")
    private String warningsJson;

    @Column(name = "alternatives_json", columnDefinition = "text")
    private String alternativesJson;

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Drug getDrug() {
        return drug;
    }

    public void setDrug(Drug drug) {
        this.drug = drug;
    }

    public User getEvaluator() {
        return evaluator;
    }

    public void setEvaluator(User evaluator) {
        this.evaluator = evaluator;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getModelVersion() {
        return modelVersion;
    }

    public void setModelVersion(String modelVersion) {
        this.modelVersion = modelVersion;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public Long getProcessingTimeMs() {
        return processingTimeMs;
    }

    public void setProcessingTimeMs(Long processingTimeMs) {
        this.processingTimeMs = processingTimeMs;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getLabsJson() {
        return labsJson;
    }

    public void setLabsJson(String labsJson) {
        this.labsJson = labsJson;
    }

    public Integer getSuitabilityScore() {
        return suitabilityScore;
    }

    public void setSuitabilityScore(Integer suitabilityScore) {
        this.suitabilityScore = suitabilityScore;
    }

    public Integer getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Integer confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getRawExplanation() {
        return rawExplanation;
    }

    public void setRawExplanation(String rawExplanation) {
        this.rawExplanation = rawExplanation;
    }

    public String getWarningsJson() {
        return warningsJson;
    }

    public void setWarningsJson(String warningsJson) {
        this.warningsJson = warningsJson;
    }

    public String getAlternativesJson() {
        return alternativesJson;
    }

    public void setAlternativesJson(String alternativesJson) {
        this.alternativesJson = alternativesJson;
    }
}
