package com.mediai.dto.password;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @JsonProperty("token") @NotBlank(message = "Token is required") String token,
        @JsonProperty("newPassword") @NotBlank(message = "New password is required") @Size(min = 8, message = "Password must be at least 8 characters") String newPassword) {
}
