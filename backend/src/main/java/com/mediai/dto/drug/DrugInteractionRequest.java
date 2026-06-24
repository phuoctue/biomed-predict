package com.mediai.dto.drug;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DrugInteractionRequest(
        @NotNull UUID sourceDrugId,
        @NotNull UUID targetDrugId,
        @NotNull @Size(max = 50) String severity,
        String description,
        String recommendation) {
}
