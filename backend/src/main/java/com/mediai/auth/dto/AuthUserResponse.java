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
        return new AuthUserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getDepartment());
    }
}
