package com.mediai.dto.prescription.request;

import lombok.Data;

@Data
public class CreatePrescriptionRequest {
    private Long medicalRecordId;
    private String note;
}
