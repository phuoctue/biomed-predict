package com.mediai.dto.password;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ResetPasswordResponse(
        @JsonProperty("message") String message) {
}
