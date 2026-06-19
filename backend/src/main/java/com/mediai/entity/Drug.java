package com.mediai.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "drugs")
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGenericName() {
        return genericName;
    }

    public void setGenericName(String genericName) {
        this.genericName = genericName;
    }

    public String getDrugGroup() {
        return drugGroup;
    }

    public void setDrugGroup(String drugGroup) {
        this.drugGroup = drugGroup;
    }

    public String getDosageForm() {
        return dosageForm;
    }

    public void setDosageForm(String dosageForm) {
        this.dosageForm = dosageForm;
    }

    public String getStrength() {
        return strength;
    }

    public void setStrength(String strength) {
        this.strength = strength;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getUsageInstructions() {
        return usageInstructions;
    }

    public void setUsageInstructions(String usageInstructions) {
        this.usageInstructions = usageInstructions;
    }

    public String getRecommendedDose() {
        return recommendedDose;
    }

    public void setRecommendedDose(String recommendedDose) {
        this.recommendedDose = recommendedDose;
    }

    public String getSideEffects() {
        return sideEffects;
    }

    public void setSideEffects(String sideEffects) {
        this.sideEffects = sideEffects;
    }

    public String getStorageCondition() {
        return storageCondition;
    }

    public void setStorageCondition(String storageCondition) {
        this.storageCondition = storageCondition;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<DrugIngredient> getDrugIngredients() {
        return drugIngredients;
    }

    public void setDrugIngredients(List<DrugIngredient> drugIngredients) {
        this.drugIngredients = drugIngredients;
    }
}
