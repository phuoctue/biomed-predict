package com.mediai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "drug_interactions")
public class DrugInteraction extends BaseEntity {

    // V5 migration uses `drug_a_id` / `drug_b_id`
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drug_a_id", nullable = false)
    private Drug sourceDrug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drug_b_id", nullable = false)
    private Drug targetDrug;

    @Column(nullable = false, length = 50)
    private String severity;

    @Column(columnDefinition = "text")
    private String description;

    @Column(columnDefinition = "text")
    private String recommendation;

    public Drug getSourceDrug() {
        return sourceDrug;
    }

    public void setSourceDrug(Drug sourceDrug) {
        this.sourceDrug = sourceDrug;
    }

    public Drug getTargetDrug() {
        return targetDrug;
    }

    public void setTargetDrug(Drug targetDrug) {
        this.targetDrug = targetDrug;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
}
