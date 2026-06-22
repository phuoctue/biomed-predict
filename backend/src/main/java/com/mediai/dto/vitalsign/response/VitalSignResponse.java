package com.mediai.dto.vitalsign.response;

import lombok.Data;

@Data
public class VitalSignResponse {
    private Long id;
    private Long medicalRecordId;
    private Double height;
    private Double weight;
    private Double temperature;
    private Integer systolicBP;
    private Integer diastolicBP;
    private Integer heartRate;
    private Integer respiratoryRate;
    private Double spo2;
}
