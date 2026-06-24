package com.mediai.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mediai.dto.common.ApiResponse;
import com.mediai.dto.prescription.request.CreatePrescriptionRequest;
import com.mediai.dto.prescription.response.PrescriptionResponse;
import com.mediai.entity.Prescription;
import com.mediai.service.PrescriptionService;
import com.mediai.util.CodeGenerator;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @PostMapping
    public ResponseEntity<ApiResponse<PrescriptionResponse>> createPrescription(
            @RequestBody CreatePrescriptionRequest request) {
        Prescription prescription = Prescription.builder()
                .prescriptionCode(CodeGenerator.generatePrescriptionCode())
                .status("DRAFT")
                .note(request.getNote())
                .build();

        Prescription saved = prescriptionService.createPrescription(prescription);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Prescription created successfully.", toResponse(saved)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PrescriptionResponse>> getPrescription(@PathVariable UUID id) {
        Prescription prescription = prescriptionService.getPrescriptionById(id);
        return ResponseEntity.ok(
                ApiResponse.ok("Prescription retrieved successfully.", toResponse(prescription)));
    }

    private PrescriptionResponse toResponse(Prescription prescription) {
        PrescriptionResponse response = new PrescriptionResponse();
        response.setId(prescription.getId());
        response.setPrescriptionCode(prescription.getPrescriptionCode());
        // medicalRecord and doctor may be null if not set (e.g. draft)
        if (prescription.getMedicalRecord() != null) {
            response.setMedicalRecordId(prescription.getMedicalRecord().getId());
        }
        if (prescription.getDoctor() != null) {
            response.setDoctorId(prescription.getDoctor().getId());
        }
        response.setStatus(prescription.getStatus());
        response.setNote(prescription.getNote());
        return response;
    }
}
