package com.mediai.controller;

import java.util.List;

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

import com.mediai.dto.allergy.AllergyRequest;
import com.mediai.dto.allergy.AllergyResponse;
import com.mediai.dto.common.ApiResponse;
import com.mediai.service.AllergyService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/allergies")
public class AllergyController {

    private final AllergyService allergyService;

    public AllergyController(AllergyService allergyService) {
        this.allergyService = allergyService;
    }

    @GetMapping
    public ApiResponse<List<AllergyResponse>> listAllergies(
            @RequestParam(required = false) Long patientId) {
        return ApiResponse.ok("Allergies retrieved successfully.",
                allergyService.listAllergies(patientId));
    }

    @GetMapping("/{id}")
    public ApiResponse<AllergyResponse> getAllergy(@PathVariable Long id) {
        return ApiResponse.ok("Allergy retrieved successfully.", allergyService.getAllergy(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AllergyResponse>> createAllergy(
            @Valid @RequestBody AllergyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Allergy created successfully.",
                        allergyService.createAllergy(request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<AllergyResponse> updateAllergy(
            @PathVariable Long id,
            @Valid @RequestBody AllergyRequest request) {
        return ApiResponse.ok("Allergy updated successfully.",
                allergyService.updateAllergy(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteAllergy(@PathVariable Long id) {
        allergyService.deleteAllergy(id);
        return ApiResponse.ok("Allergy deleted successfully.", "deleted");
    }
}
