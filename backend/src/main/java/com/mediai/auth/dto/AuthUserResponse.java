package com.mediai.auth.dto;

import java.util.UUID;

import com.mediai.entity.User;
import com.mediai.entity.UserRole;

public record AuthUserResponse(
        UUID id,
        String email,
        String fullName,
        UserRole role,
        String department) {

    public static AuthUserResponse from(User user) {
        var role = user.getRole() == null
                ? UserRole.MEDICAL_STAFF
                : UserRole.fromDbName(user.getRole());
        return new AuthUserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                role,
                user.getDepartment());
    }
}
