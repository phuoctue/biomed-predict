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
@Table(name = "ai_warnings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIWarning extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluation_id", nullable = false)
    private AIEvaluation evaluation;

    @Column(name = "warning_type", length = 50)
    private String warningType;

    @Column(length = 20)
    private String severity;

    @Column(length = 200)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "affected_drug", length = 100)
    private String affectedDrug;

    @Column(columnDefinition = "text")
    private String recommendation;
}
