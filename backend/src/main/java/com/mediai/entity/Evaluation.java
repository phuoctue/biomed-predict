package com.mediai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "evaluations")
public class Evaluation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @Column(name = "suitability_score", nullable = false)
    private Integer suitabilityScore;

    @Column(name = "risk_level", nullable = false, length = 50)
    private String riskLevel;

    @Column(columnDefinition = "text")
    private String summary;

    @Column(name = "raw_explanation", columnDefinition = "text")
    private String rawExplanation;

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Integer getSuitabilityScore() {
        return suitabilityScore;
    }

    public void setSuitabilityScore(Integer suitabilityScore) {
        this.suitabilityScore = suitabilityScore;
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
}
