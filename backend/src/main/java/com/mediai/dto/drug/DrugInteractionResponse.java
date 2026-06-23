package com.mediai.dto.drug;

import java.time.Instant;
import java.util.UUID;

import com.mediai.entity.DrugInteraction;

public record DrugInteractionResponse(
        UUID id,
        UUID sourceDrugId,
        String sourceDrugName,
        UUID targetDrugId,
        String targetDrugName,
        String severity,
        String description,
        String recommendation,
        Instant createdAt,
        Instant updatedAt) {

    public static DrugInteractionResponse from(DrugInteraction interaction) {
        return new DrugInteractionResponse(
                interaction.getId(),
                interaction.getSourceDrug().getId(),
                interaction.getSourceDrug().getName(),
                interaction.getTargetDrug().getId(),
                interaction.getTargetDrug().getName(),
                interaction.getSeverity(),
                interaction.getDescription(),
                interaction.getRecommendation(),
                interaction.getCreatedAt(),
                interaction.getUpdatedAt());
    }
}
