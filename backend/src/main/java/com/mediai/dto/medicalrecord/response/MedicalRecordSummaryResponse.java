package com.mediai.dto.medicalrecord.response;

import java.util.UUID;

import lombok.Data;

@Data
public class MedicalRecordSummaryResponse {
    private UUID id;
    private String patientName;
    private String doctorName;
    private String visitDate;
    private String diagnosis;
    private String status;
}
