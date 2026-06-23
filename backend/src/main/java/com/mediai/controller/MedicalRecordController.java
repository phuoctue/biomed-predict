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
import com.mediai.entity.MedicalRecord;
import com.mediai.service.MedicalRecordService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @PostMapping
    public ResponseEntity<ApiResponse<MedicalRecord>> createMedicalRecord(
            @RequestBody MedicalRecord medicalRecord) {
        MedicalRecord saved = medicalRecordService.createMedicalRecord(medicalRecord);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Medical record created successfully.", saved));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalRecord>> getMedicalRecord(@PathVariable UUID id) {
        MedicalRecord record = medicalRecordService.getMedicalRecordById(id);
        return ResponseEntity.ok(ApiResponse.ok("Medical record retrieved successfully.", record));
    }
}
