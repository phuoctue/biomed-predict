package com.mediai.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mediai.dto.common.ApiResponse;
import com.mediai.dto.labresult.request.CreateLabResultRequest;
import com.mediai.entity.LabResult;
import com.mediai.service.LabResultService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/lab-results")
@RequiredArgsConstructor
public class LabResultController {

    private final LabResultService labResultService;

    @PostMapping
    public ResponseEntity<ApiResponse<LabResult>> createLabResult(
            @RequestBody CreateLabResultRequest request) {
        LabResult labResult = LabResult.builder()
            .testCode(request.getTestCode())
            .testName(request.getTestName())
            .resultValue(request.getResultValue())
            .unit(request.getUnit())
            .referenceRange(request.getReferenceRange())
            .build();

        LabResult saved = labResultService.createLabResult(labResult);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.<LabResult>builder()
                .success(true)
                .message("Lab result recorded successfully")
                .data(saved)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LabResult>> getLabResult(@PathVariable Long id) {
        LabResult labResult = labResultService.getLabResultById(id);
        return ResponseEntity.ok(ApiResponse.<LabResult>builder()
            .success(true)
            .message("Lab result retrieved successfully")
            .data(labResult)
            .build());
    }
}
