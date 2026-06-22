package com.mediai.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.mediai.entity.UserRole;

public record CreateUserRequest(
        @NotBlank
        @Email
        @Size(max = 255)
        String email,

        @NotBlank
        @Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters")
        String password,

        @NotBlank
        @Size(max = 255)
        String fullName,

        @NotNull
        UserRole role,

        @Size(max = 255)
        String department) {
}
