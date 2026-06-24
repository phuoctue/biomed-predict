package com.mediai.dto.patient.request;

import lombok.Data;

@Data
public class CreatePatientRequest {
    private String fullName;
    private String gender;
    private String dateOfBirth;
    private String citizenId;
    private String phone;
    private String email;
    private String address;
    private String bloodType;
    private String insuranceNumber;
}
