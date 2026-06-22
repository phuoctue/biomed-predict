package com.mediai.dto.password;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ValidateResetTokenResponse(
        @JsonProperty("valid") boolean valid,
        @JsonProperty("message") String message) {
}
