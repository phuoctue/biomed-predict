package com.mediai.ai.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mediai.ai.dto.AIEvaluationRequest;
import com.mediai.ai.dto.AIEvaluationResponse;
import com.mediai.ai.dto.AIEvaluationSummaryResponse;
import com.mediai.ai.dto.ExplainRequestPayload;
import com.mediai.ai.dto.ExplainResponsePayload;
import com.mediai.ai.service.AIEvaluationService;
import com.mediai.dto.common.ApiResponse;
import com.mediai.dto.common.PageResponse;
import com.mediai.security.UserPrincipal;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ai")
public class AIEvaluationController {

    private final AIEvaluationService aiEvaluationService;

    public AIEvaluationController(AIEvaluationService aiEvaluationService) {
        this.aiEvaluationService = aiEvaluationService;
    }

    @PostMapping("/evaluate")
    public ResponseEntity<ApiResponse<AIEvaluationResponse>> evaluate(
            @Valid @RequestBody AIEvaluationRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("AI evaluation completed successfully.", aiEvaluationService.evaluate(request, principal)));
    }

    @PostMapping("/explain")
    public ApiResponse<ExplainResponsePayload> explain(@Valid @RequestBody ExplainRequestPayload request) {
        return ApiResponse.ok("AI explanation generated successfully.", aiEvaluationService.explain(request.result(), request.target_language()));
    }

    @GetMapping("/evaluations")
    public PageResponse<AIEvaluationSummaryResponse> listEvaluations(
            @RequestParam(required = false) UUID patientId,
            @RequestParam(required = false) UUID drugId,
            @PageableDefault(size = 20) Pageable pageable) {
        var page = aiEvaluationService.listEvaluations(patientId, drugId, pageable);
        return PageResponse.ok(
                "AI evaluations retrieved successfully.",
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast());
    }

    @GetMapping("/evaluations/{id}")
    public ApiResponse<AIEvaluationResponse> getEvaluation(@PathVariable UUID id) {
        return ApiResponse.ok("AI evaluation retrieved successfully.", aiEvaluationService.getEvaluation(id));
    }

    @GetMapping("/evaluations/{id}/summary")
    public ApiResponse<AIEvaluationSummaryResponse> getSummary(@PathVariable UUID id) {
        return ApiResponse.ok("AI evaluation summary retrieved successfully.", aiEvaluationService.getSummary(id));
    }

    @GetMapping("/evaluations/{id}/warnings")
    public ApiResponse<List<String>> getWarnings(@PathVariable UUID id) {
        return ApiResponse.ok("AI warnings retrieved successfully.", aiEvaluationService.getWarnings(id));
    }

    @GetMapping("/evaluations/{id}/recommendations")
    public ApiResponse<List<String>> getRecommendations(@PathVariable UUID id) {
        return ApiResponse.ok("AI recommendations retrieved successfully.", aiEvaluationService.getRecommendations(id));
    }

    @PostMapping("/evaluations/{id}/reanalyze")
    public ApiResponse<AIEvaluationResponse> reanalyze(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("AI re-evaluation completed successfully.", aiEvaluationService.reanalyze(id, principal));
    }

    @GetMapping("/evaluations/history")
    public PageResponse<AIEvaluationSummaryResponse> getEvaluationHistory(
            @RequestParam(required = false) UUID patientId,
            @RequestParam(required = false) UUID drugId,
            @RequestParam(required = false) String riskLevel,
            @PageableDefault(size = 20, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {
        var page = aiEvaluationService.getEvaluationHistory(patientId, drugId, riskLevel, pageable);
        return PageResponse.ok(
                "Evaluation history retrieved successfully.",
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast());
    }
}
