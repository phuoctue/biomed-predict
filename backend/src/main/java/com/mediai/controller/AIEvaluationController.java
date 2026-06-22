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
import com.mediai.entity.AIEvaluation;
import com.mediai.service.AIEvaluationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ai/evaluations")
@RequiredArgsConstructor
public class AIEvaluationController {

    private final AIEvaluationService aiEvaluationService;

    @PostMapping
    public ResponseEntity<ApiResponse<AIEvaluation>> createEvaluation(
            @RequestBody AIEvaluation evaluation) {
        evaluation.setStatus("PENDING");
        AIEvaluation saved = aiEvaluationService.createEvaluation(evaluation);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.<AIEvaluation>builder()
                .success(true)
                .message("AI evaluation created successfully")
                .data(saved)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AIEvaluation>> getEvaluation(@PathVariable Long id) {
        AIEvaluation evaluation = aiEvaluationService.getEvaluationById(id);
        return ResponseEntity.ok(ApiResponse.<AIEvaluation>builder()
            .success(true)
            .message("AI evaluation retrieved successfully")
            .data(evaluation)
            .build());
    }
}
