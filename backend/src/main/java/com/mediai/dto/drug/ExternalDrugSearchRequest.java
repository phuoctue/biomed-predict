package com.mediai.dto.drug;

import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public record ExternalDrugSearchRequest(
        @JsonProperty("keyword") String keyword,
        @JsonProperty("manufacturer") String manufacturer,
        @JsonProperty("limit") Integer limit) {

    @JsonCreator
    public ExternalDrugSearchRequest {
        // Normalize inputs
        keyword = Optional.ofNullable(keyword).map(String::trim).orElse(null);
        manufacturer = Optional.ofNullable(manufacturer).map(String::trim).orElse(null);
    }

    public static ExternalDrugSearchRequest of(String keyword) {
        return new ExternalDrugSearchRequest(keyword, null, 10);
    }

    public static ExternalDrugSearchRequest of(String keyword, String manufacturer) {
        return new ExternalDrugSearchRequest(keyword, manufacturer, 10);
    }

    public static ExternalDrugSearchRequest of(String keyword, String manufacturer, Integer limit) {
        return new ExternalDrugSearchRequest(keyword, manufacturer, limit);
    }
}