package com.mediai.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "drugs")
@Getter
@Setter
public class Drug extends BaseEntity {

    @Column(nullable = false, unique = true, length = 64)
    private String code;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "generic_name", length = 255)
    private String genericName;

    @Column(name = "drug_group", length = 255)
    private String drugGroup;

    @Column(name = "dosage_form", length = 255)
    private String dosageForm;

    @Column(length = 255)
    private String strength;

    @Column(length = 50)
    private String unit;

    @Column(length = 255)
    private String manufacturer;

    @Column(name = "usage_instructions", columnDefinition = "text")
    private String usageInstructions;

    @Column(name = "recommended_dose", columnDefinition = "text")
    private String recommendedDose;

    @Column(name = "side_effects", columnDefinition = "text")
    private String sideEffects;

    @Column(name = "storage_condition", columnDefinition = "text")
    private String storageCondition;

    @Column(nullable = false, length = 50)
    private String status = "ACTIVE";

    @OneToMany(mappedBy = "drug")
    private List<DrugIngredient> drugIngredients = new ArrayList<>();
}
