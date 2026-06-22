package com.mediai.dto.password;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;

public record ValidateResetTokenRequest(
        @JsonProperty("token") @NotBlank(message = "Token is required") String token) {
}
