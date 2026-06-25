package com.mediai.dto.prescription.response;

import java.util.UUID;

import lombok.Data;

@Data
public class PrescriptionItemResponse {
    private UUID id;
    private UUID prescriptionId;
    private UUID drugId;
    private String dosage;
    private String frequency;
    private String duration;
    private Integer quantity;
    private String route;
    private String instruction;
}
