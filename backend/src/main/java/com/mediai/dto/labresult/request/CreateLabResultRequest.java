package com.mediai.dto.labresult.request;

import lombok.Data;

@Data
public class CreateLabResultRequest {
    private Long medicalRecordId;
    private String testCode;
    private String testName;
    private String resultValue;
    private String unit;
    private String referenceRange;
}
