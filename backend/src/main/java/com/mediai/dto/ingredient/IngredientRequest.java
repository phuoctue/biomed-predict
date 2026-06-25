package com.mediai.dto.ingredient;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record IngredientRequest(
        @NotBlank
        @Size(max = 64)
        String code,
        @NotBlank
        @Size(max = 255)
        String name,
        String description) {
}
