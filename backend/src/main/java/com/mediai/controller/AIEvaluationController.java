package com.mediai.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mediai.dto.common.ApiResponse;
import com.mediai.entity.AIEvaluation;
import com.mediai.service.AIEvaluationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ai/evaluations")
@RequiredArgsConstructor
public class AIEvaluationController {

    private static final String DEFAULT_STATUS = "PENDING";

    private final AIEvaluationService aiEvaluationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ResponseEntity<ApiResponse<AIEvaluation>> createEvaluation(
            @Valid @RequestBody AIEvaluation evaluation) {
        if (evaluation.getStatus() == null || evaluation.getStatus().isBlank()) {
            evaluation.setStatus(DEFAULT_STATUS);
        }
        AIEvaluation saved = aiEvaluationService.createEvaluation(evaluation);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("AI evaluation created successfully", saved));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN','PHARMACIST')")
    public ResponseEntity<ApiResponse<AIEvaluation>> getEvaluation(@PathVariable Long id) {
        AIEvaluation evaluation = aiEvaluationService.getEvaluationById(id);
        return ResponseEntity.ok(ApiResponse.ok("AI evaluation retrieved successfully", evaluation));
    }
}
