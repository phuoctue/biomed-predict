package com.mediai.dto.password;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ForgotPasswordResponse(
        @JsonProperty("message") String message) {
}
