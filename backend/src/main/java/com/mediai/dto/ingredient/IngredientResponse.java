package com.mediai.dto.ingredient;

import java.time.Instant;

import com.mediai.entity.Ingredient;

public record IngredientResponse(
        Long id,
        String code,
        String name,
        String description,
        Instant createdAt,
        Instant updatedAt) {

    public static IngredientResponse from(Ingredient ingredient) {
        return new IngredientResponse(
                ingredient.getId(),
                ingredient.getCode(),
                ingredient.getName(),
                ingredient.getDescription(),
                ingredient.getCreatedAt(),
                ingredient.getUpdatedAt());
    }
}
