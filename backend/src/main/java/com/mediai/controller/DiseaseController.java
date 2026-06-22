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
import com.mediai.entity.Disease;
import com.mediai.service.DiseaseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/diseases")
@RequiredArgsConstructor
public class DiseaseController {

    private final DiseaseService diseaseService;

    @PostMapping
    public ResponseEntity<ApiResponse<Disease>> createDisease(@RequestBody Disease disease) {
        Disease saved = diseaseService.createDisease(disease);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.<Disease>builder()
                .success(true)
                .message("Disease created successfully")
                .data(saved)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Disease>> getDisease(@PathVariable Long id) {
        Disease disease = diseaseService.getDiseaseById(id);
        return ResponseEntity.ok(ApiResponse.<Disease>builder()
            .success(true)
            .message("Disease retrieved successfully")
            .data(disease)
            .build());
    }
}
