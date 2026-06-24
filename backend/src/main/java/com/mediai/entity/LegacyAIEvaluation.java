package com.mediai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Maps to the {@code ai_evaluations} table created in V3 migration.
 * This is the older prescription-based evaluation model.
 *
 * The newer patient+drug-based evaluation model is represented by
 * {@link AIEvaluation} which maps to the {@code evaluations} table (V7).
 */
@Entity
@Table(name = "ai_evaluations")
@Getter
@Setter
@NoArgsConstructor
public class LegacyAIEvaluation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @Column(name = "evaluation_no")
    private Integer evaluationNo;

    @Column(name = "model_provider", length = 50)
    private String modelProvider;

    @Column(name = "model_name", length = 100)
    private String modelName;

    @Column(name = "model_version", length = 50)
    private String modelVersion;

    @Column(columnDefinition = "text")
    private String prompt;

    @Column(name = "raw_response", columnDefinition = "text")
    private String rawResponse;

    @Column(name = "overall_score")
    private Double overallScore;

    @Column(name = "overall_risk", length = 20)
    private String overallRisk;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @Column(columnDefinition = "text")
    private String summary;

    @Column(name = "processing_time_ms")
    private Long processingTimeMs;

    @Column(name = "token_usage")
    private Integer tokenUsage;

    @Column(nullable = false)
    private Boolean latest = false;

    @Column(nullable = false, length = 30)
    private String status = "PENDING";
}
