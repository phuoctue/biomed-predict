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
import com.mediai.dto.drug.DrugSummaryResponse;
import com.mediai.dto.ingredient.IngredientRequest;
import com.mediai.dto.ingredient.IngredientResponse;
import com.mediai.service.IngredientService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ingredients")
public class IngredientController {

    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping
    public PageResponse<IngredientResponse> listIngredients(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20) Pageable pageable) {
        return ingredientService.listIngredients(keyword, pageable);
    }

    @GetMapping("/{id}")
    public ApiResponse<IngredientResponse> getIngredient(@PathVariable UUID id) {
        return ApiResponse.ok("Ingredient retrieved successfully.", ingredientService.getIngredient(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<IngredientResponse>> createIngredient(
            @Valid @RequestBody IngredientRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Ingredient created successfully.",
                        ingredientService.createIngredient(request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<IngredientResponse> updateIngredient(
            @PathVariable UUID id,
            @Valid @RequestBody IngredientRequest request) {
        return ApiResponse.ok("Ingredient updated successfully.",
                ingredientService.updateIngredient(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteIngredient(@PathVariable UUID id) {
        ingredientService.deleteIngredient(id);
        return ApiResponse.ok("Ingredient deleted successfully.", "deleted");
    }

    @GetMapping("/{id}/drugs")
    public ApiResponse<List<DrugSummaryResponse>> getDrugsByIngredient(@PathVariable UUID id) {
        return ApiResponse.ok("Drugs retrieved successfully.",
                ingredientService.getDrugsByIngredient(id));
    }
}
