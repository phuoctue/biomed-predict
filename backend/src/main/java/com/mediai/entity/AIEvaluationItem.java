package com.mediai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ai_evaluation_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIEvaluationItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluation_id", nullable = false)
    private AIEvaluation evaluation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_item_id", nullable = false)
    private PrescriptionItem prescriptionItem;

    @Column(name = "suitability_score")
    private Double suitabilityScore;

    @Column(name = "risk_level", length = 20)
    private String riskLevel;

    @Column(name = "confidence")
    private Double confidence;

    @Column(columnDefinition = "text")
    private String recommendation;

    @Column(columnDefinition = "text")
    private String explanation;

    @Column(name = "suggested_dose", length = 100)
    private String suggestedDose;

    @Column(name = "suggested_drug", length = 100)
    private String suggestedDrug;
}
