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

    // Maps to `drug_code` column in V2 migration
    @Column(name = "drug_code", nullable = false, unique = true, length = 30)
    private String code;

    // V2 migration uses `generic_name` as the primary drug name column
    @Column(name = "generic_name", nullable = false, length = 200)
    private String name;

    // V2 migration also has a separate `brand_name` column
    @Column(name = "brand_name", length = 200)
    private String brandName;

    @Column(name = "drug_group", length = 100)
    private String drugGroup;

    @Column(name = "dosage_form", length = 50)
    private String dosageForm;

    @Column(length = 50)
    private String strength;

    @Column(length = 30)
    private String unit;

    @Column(length = 200)
    private String manufacturer;

    // V2 migration uses `instruction` (not `usage_instructions`)
    @Column(name = "instruction", columnDefinition = "text")
    private String usageInstructions;

    @Column(name = "recommended_dose", columnDefinition = "text")
    private String recommendedDose;

    @Column(name = "side_effects", columnDefinition = "text")
    private String sideEffects;

    @Column(name = "storage_condition", columnDefinition = "text")
    private String storageCondition;

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE";

    @OneToMany(mappedBy = "drug")
    private List<DrugIngredient> drugIngredients = new ArrayList<>();
}
