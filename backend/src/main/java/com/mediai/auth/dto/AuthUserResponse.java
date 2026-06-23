package com.mediai.auth.dto;

import com.mediai.entity.User;
import com.mediai.entity.UserRole;

public record AuthUserResponse(
        Long id,
        String email,
        String fullName,
        UserRole role,
        String department) {

    public static AuthUserResponse from(User user) {
        // The `role` field on User is now a JPA association. We resolve the
        // strongly typed enum here so the rest of the application keeps
        // the same DTO contract.
        var role = user.getRole() == null
                ? UserRole.MEDICAL_STAFF
                : UserRole.fromDbName(user.getRole().getName());
        return new AuthUserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                role,
                user.getDepartment());
    }
}
