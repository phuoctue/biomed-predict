package com.mediai.dto.user;

import java.time.Instant;

import com.mediai.entity.User;
import com.mediai.entity.UserRole;

public record UserResponse(
        Long id,
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
                resolveRoleName(user),
                user.getDepartment(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }

    private static String resolveRoleName(User user) {
        if (user == null || user.getRole() == null || user.getRole().getName() == null) {
            return UserRole.MEDICAL_STAFF.name();
        }
        return UserRole.fromDbName(user.getRole().getName()).name();
    }
}
}
