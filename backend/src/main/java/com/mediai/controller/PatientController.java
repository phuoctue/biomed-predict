package com.mediai.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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
import com.mediai.dto.common.PageResponse;
import com.mediai.dto.patient.CreatePatientRequest;
import com.mediai.dto.patient.PatientEvaluationSummaryResponse;
import com.mediai.dto.patient.PatientResponse;
import com.mediai.dto.patient.PatientSummaryResponse;
import com.mediai.dto.patient.UpdatePatientRequest;
import com.mediai.service.PatientService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public PageResponse<PatientResponse> listPatients(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20) Pageable pageable) {
        return patientService.listPatients(keyword, pageable);
    }

    @GetMapping("/{id}")
    public ApiResponse<PatientResponse> getPatient(@PathVariable UUID id) {
        return ApiResponse.ok("Patient retrieved successfully.", patientService.getPatient(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PatientResponse>> createPatient(
            @Valid @RequestBody CreatePatientRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Patient created successfully.", patientService.createPatient(request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<PatientResponse> updatePatient(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePatientRequest request) {
        return ApiResponse.ok("Patient updated successfully.", patientService.updatePatient(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deletePatient(@PathVariable UUID id) {
        patientService.deletePatient(id);
        return ApiResponse.ok("Patient deleted successfully.", "deleted");
    }

    @GetMapping("/{id}/summary")
    public ApiResponse<PatientSummaryResponse> getSummary(@PathVariable UUID id) {
        return ApiResponse.ok("Patient summary retrieved successfully.", patientService.getSummary(id));
    }

    @GetMapping("/clinical-summary/{mrn}")
    public ApiResponse<com.mediai.dto.patient.ClinicalSummaryResponse> getClinicalSummary(
            @PathVariable String mrn) {
        return ApiResponse.ok("Patient clinical summary retrieved successfully.",
                patientService.getClinicalSummary(mrn));
    }

    @GetMapping("/{id}/ai-history")
    public ApiResponse<List<PatientEvaluationSummaryResponse>> getAiHistory(@PathVariable UUID id) {
        return ApiResponse.ok("Patient AI history retrieved successfully.", patientService.getAiHistory(id));
    }
}
