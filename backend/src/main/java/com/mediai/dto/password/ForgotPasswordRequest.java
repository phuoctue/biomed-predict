package com.mediai.dto.password;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
        @JsonProperty("email") @Email(message = "Email must be valid") @NotBlank(message = "Email is required") String email) {
}
