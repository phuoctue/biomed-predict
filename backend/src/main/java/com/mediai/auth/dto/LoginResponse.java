package com.mediai.auth.dto;

import java.time.Instant;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        Instant expiredAt,
        AuthUserResponse user) {
}
