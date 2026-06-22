package com.mediai.dto.medicalrecord.response;

import lombok.Data;

@Data
public class MedicalRecordSummaryResponse {
    private Long id;
    private String patientName;
    private String doctorName;
    private String visitDate;
    private String diagnosis;
    private String status;
}
