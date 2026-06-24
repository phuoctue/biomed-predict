package com.mediai.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank
        @Size(min = 8, max = 255, message = "New password must be between 8 and 255 characters")
        String newPassword) {
}
