package com.mediai.dto.prescription.response;

import java.util.List;
import java.util.UUID;

import lombok.Data;

@Data
public class PrescriptionResponse {
    private UUID id;
    private String prescriptionCode;
    private UUID medicalRecordId;
    private UUID doctorId;
    private String status;
    private String note;
    private List<PrescriptionItemResponse> items;
}
