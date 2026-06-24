package com.mediai.dto.drug.response;

import java.util.UUID;

import lombok.Data;

@Data
public class DrugResponse {
    private UUID id;
    private String drugCode;
    private String genericName;
    private String brandName;
    private String dosageForm;
    private String strength;
    private String unit;
    private String recommendedDose;
    private String status;
}
