package com.mediai.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ApiResponse<List<AllergyResponse>> listAllergies(@RequestParam(required = false) UUID patientId) {
        return ApiResponse.ok("Allergies retrieved successfully.", allergyService.listAllergies(patientId));
    }

    @GetMapping("/{id}")
    public ApiResponse<AllergyResponse> getAllergy(@PathVariable UUID id) {
        return ApiResponse.ok("Allergy retrieved successfully.", allergyService.getAllergy(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AllergyResponse>> createAllergy(@Valid @RequestBody AllergyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Allergy created successfully.", allergyService.createAllergy(request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<AllergyResponse> updateAllergy(@PathVariable UUID id, @Valid @RequestBody AllergyRequest request) {
        return ApiResponse.ok("Allergy updated successfully.", allergyService.updateAllergy(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteAllergy(@PathVariable UUID id) {
        allergyService.deleteAllergy(id);
        return ApiResponse.ok("Allergy deleted successfully.", "deleted");
    }
}
