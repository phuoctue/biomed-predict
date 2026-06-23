package com.mediai.dto.drug;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DrugInteractionRequest(
        @NotNull Long sourceDrugId,
        @NotNull Long targetDrugId,
        @NotNull @Size(max = 50) String severity,
        String description,
        String recommendation) {
}
