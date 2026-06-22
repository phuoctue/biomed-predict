package com.mediai.dto.drug;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ExternalDrugSearchResponse(
        @JsonProperty("splId") String splId,
        @JsonProperty("brandName") String brandName,
        @JsonProperty("genericName") String genericName,
        @JsonProperty("manufacturerName") String manufacturerName,
        @JsonProperty("dosageForm") String dosageForm,
        @JsonProperty("activeIngredients") String activeIngredients) {
}