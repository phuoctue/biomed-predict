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
@Table(name = "contraindications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contraindication extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drug_id", nullable = false)
    private Drug drug;

    @Column(name = "contraindication_type", length = 50)
    private String contraindicationType;

    @Column(name = "reference_value", length = 100)
    private String referenceValue;

    @Column(columnDefinition = "text")
    private String description;

    @Column(length = 20)
    private String severity;
}
