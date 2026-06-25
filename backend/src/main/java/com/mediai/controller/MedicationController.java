package com.mediai.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mediai.dto.common.ApiResponse;
import com.mediai.dto.medication.MedicationRequest;
import com.mediai.dto.medication.MedicationResponse;
import com.mediai.service.MedicationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/medications")
public class MedicationController {

    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @GetMapping
    public ApiResponse<List<MedicationResponse>> listMedications(
            @RequestParam(required = false) UUID patientId) {
        return ApiResponse.ok("Medications retrieved successfully.",
                medicationService.listMedications(patientId));
    }

    @GetMapping("/{id}")
    public ApiResponse<MedicationResponse> getMedication(@PathVariable UUID id) {
        return ApiResponse.ok("Medication retrieved successfully.",
                medicationService.getMedication(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MedicationResponse>> createMedication(
            @Valid @RequestBody MedicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Medication created successfully.",
                        medicationService.createMedication(request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<MedicationResponse> updateMedication(
            @PathVariable UUID id,
            @Valid @RequestBody MedicationRequest request) {
        return ApiResponse.ok("Medication updated successfully.",
                medicationService.updateMedication(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteMedication(@PathVariable UUID id) {
        medicationService.deleteMedication(id);
        return ApiResponse.ok("Medication deleted successfully.", "deleted");
    }
}
