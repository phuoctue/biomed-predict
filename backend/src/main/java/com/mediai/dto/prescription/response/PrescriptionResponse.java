package com.mediai.dto.prescription.response;

import java.util.List;

import lombok.Data;

@Data
public class PrescriptionResponse {
    private Long id;
    private String prescriptionCode;
    private Long medicalRecordId;
    private Long doctorId;
    private String status;
    private String note;
    private List<PrescriptionItemResponse> items;
}
