package com.mediai.dto.patient.response;

import java.util.UUID;

import lombok.Data;

@Data
public class PatientResponse {
    private UUID id;
    private String patientCode;
    private String fullName;
    private String gender;
    private String dateOfBirth;
    private String citizenId;
    private String phone;
    private String email;
    private String address;
    private String bloodType;
    private String insuranceNumber;
    private String status;
}
