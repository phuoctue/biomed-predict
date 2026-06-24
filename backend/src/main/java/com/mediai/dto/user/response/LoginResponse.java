package com.mediai.dto.user.response;

import java.util.UUID;

import lombok.Data;

@Data
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private Long expiresIn;
    private UserDto user;

    @Data
    public static class UserDto {
        private UUID id;
        private String username;
        private String fullName;
        private String email;
    }
}
