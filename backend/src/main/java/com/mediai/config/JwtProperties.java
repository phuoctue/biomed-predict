package com.mediai.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "security.jwt")
public record JwtProperties(
        String issuer,
        String accessSecret,
        String refreshSecret,
        String accessExpiresIn,
        String refreshExpiresIn) {
}

