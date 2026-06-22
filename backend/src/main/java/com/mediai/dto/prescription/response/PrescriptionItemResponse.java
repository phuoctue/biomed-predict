package com.mediai.dto.prescription.response;

import lombok.Data;

@Data
public class PrescriptionItemResponse {
    private Long id;
    private Long prescriptionId;
    private Long drugId;
    private String dosage;
    private String frequency;
    private String duration;
    private Integer quantity;
    private String route;
    private String instruction;
}
