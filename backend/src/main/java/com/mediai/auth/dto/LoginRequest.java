package com.mediai.auth.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @JsonAlias({ "username" })
        @NotBlank
        String email,
        @NotBlank
        @Size(min = 8, max = 255)
        String password) {
}
