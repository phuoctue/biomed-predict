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
import com.mediai.dto.drug.DrugInteractionRequest;
import com.mediai.dto.drug.DrugInteractionResponse;
import com.mediai.dto.drug.DrugRequest;
import com.mediai.dto.drug.DrugResponse;
import com.mediai.dto.drug.DrugSummaryResponse;
import com.mediai.dto.drug.ExternalDrugSearchRequest;
import com.mediai.dto.drug.ExternalDrugSearchResponse;
import com.mediai.service.DrugInteractionService;
import com.mediai.service.DrugService;
import com.mediai.service.ExternalDrugService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/drugs")
public class DrugController {

    private final DrugService drugService;
    private final DrugInteractionService drugInteractionService;
    private final ExternalDrugService externalDrugService;

    public DrugController(DrugService drugService, DrugInteractionService drugInteractionService,
            ExternalDrugService externalDrugService) {
        this.drugService = drugService;
        this.drugInteractionService = drugInteractionService;
        this.externalDrugService = externalDrugService;
    }

    @GetMapping
    public PageResponse<DrugSummaryResponse> listDrugs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String drugGroup,
            @RequestParam(required = false) String ingredient,
            @PageableDefault(size = 20) Pageable pageable) {
        return drugService.listDrugs(keyword, drugGroup, ingredient, pageable);
    }

    @GetMapping("/search")
    public PageResponse<DrugSummaryResponse> searchDrugs(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20) Pageable pageable) {
        return drugService.listDrugs(keyword, null, null, pageable);
    }

    @GetMapping("/search/advanced")
    public PageResponse<DrugSummaryResponse> searchDrugsAdvanced(
            @RequestParam(required = false) String ingredient,
            @RequestParam(required = false) String drugGroup,
            @PageableDefault(size = 20) Pageable pageable) {
        return drugService.listDrugs(null, drugGroup, ingredient, pageable);
    }

    @GetMapping("/{id}")
    public ApiResponse<DrugResponse> getDrug(@PathVariable UUID id) {
        return ApiResponse.ok("Drug retrieved successfully.", drugService.getDrug(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DrugResponse>> createDrug(@Valid @RequestBody DrugRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Drug created successfully.", drugService.createDrug(request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<DrugResponse> updateDrug(@PathVariable UUID id, @Valid @RequestBody DrugRequest request) {
        return ApiResponse.ok("Drug updated successfully.", drugService.updateDrug(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteDrug(@PathVariable UUID id) {
        drugService.deleteDrug(id);
        return ApiResponse.ok("Drug deleted successfully.", "deleted");
    }

    @GetMapping("/{id}/interactions")
    public ApiResponse<List<DrugInteractionResponse>> getInteractions(@PathVariable UUID id) {
        return ApiResponse.ok("Drug interactions retrieved successfully.", drugService.getInteractions(id));
    }

    @PostMapping("/{id}/interactions")
    public ResponseEntity<ApiResponse<DrugInteractionResponse>> createInteraction(
            @PathVariable UUID id,
            @Valid @RequestBody DrugInteractionRequest request) {
        var payload = new DrugInteractionRequest(id, request.targetDrugId(), request.severity(), request.description(),
                request.recommendation());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Drug interaction created successfully.", drugInteractionService.createInteraction(payload)));
    }

    @PutMapping("/interactions/{interactionId}")
    public ApiResponse<DrugInteractionResponse> updateInteraction(
            @PathVariable UUID interactionId,
            @Valid @RequestBody DrugInteractionRequest request) {
        return ApiResponse.ok(
                "Drug interaction updated successfully.",
                drugInteractionService.updateInteraction(interactionId, request));
    }

    @DeleteMapping("/interactions/{interactionId}")
    public ApiResponse<String> deleteInteraction(@PathVariable UUID interactionId) {
        drugInteractionService.deleteInteraction(interactionId);
        return ApiResponse.ok("Drug interaction deleted successfully.", "deleted");
    }

    @PostMapping("/search/external")
    public ApiResponse<List<ExternalDrugSearchResponse>> searchExternalDrugs(
            @Valid @RequestBody ExternalDrugSearchRequest request) {
        return ApiResponse.ok("External drugs searched successfully.",
                externalDrugService.searchDrugs(request));
    }

    @GetMapping("/{id}/alternatives")
    public PageResponse<DrugSummaryResponse> getAlternativeDrugs(
            @PathVariable UUID id,
            @PageableDefault(size = 20) Pageable pageable) {
        var drug = drugService.getDrug(id);
        return drugService.listDrugs(drug.drugGroup(), drug.drugGroup(), null, pageable);
    }

    @GetMapping("/search/by-symptoms")
    public PageResponse<DrugSummaryResponse> searchBySymptoms(
            @RequestParam(required = false) String symptom,
            @PageableDefault(size = 20) Pageable pageable) {
        return drugService.listDrugs(symptom, null, null, pageable);
    }
}
