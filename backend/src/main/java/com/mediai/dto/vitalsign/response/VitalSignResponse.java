package com.mediai.dto.vitalsign.response;

import java.util.UUID;

import lombok.Data;

@Data
public class VitalSignResponse {
    private UUID id;
    private UUID medicalRecordId;
    private Double height;
    private Double weight;
    private Double temperature;
    private Integer systolicBP;
    private Integer diastolicBP;
    private Integer heartRate;
    private Integer respiratoryRate;
    private Double spo2;
}
