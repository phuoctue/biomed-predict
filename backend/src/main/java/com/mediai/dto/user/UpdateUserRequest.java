package com.mediai.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.mediai.entity.UserRole;

public record UpdateUserRequest(
        @NotBlank
        @Size(max = 255)
        String fullName,

        @NotNull
        UserRole role,

        @Size(max = 255)
        String department) {
}
