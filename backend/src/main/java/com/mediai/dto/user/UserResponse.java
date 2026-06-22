package com.mediai.dto.user;

import java.time.Instant;
import java.util.UUID;

import com.mediai.entity.User;

public record UserResponse(
        UUID id,
        String email,
        String fullName,
        String role,
        String department,
        Instant createdAt,
        Instant updatedAt) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                user.getDepartment(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }
}
