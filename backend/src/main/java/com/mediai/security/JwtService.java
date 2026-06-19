package com.mediai.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import com.mediai.config.JwtProperties;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final String ACCESS_TOKEN_TYPE = "access";
    private static final String REFRESH_TOKEN_TYPE = "refresh";

    private final JwtProperties jwtProperties;

    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    public TokenPair generateTokenPair(UserPrincipal userPrincipal) {
        var now = Instant.now();
        var accessExpiration = now.plus(parseDuration(jwtProperties.accessExpiresIn()));
        var refreshExpiration = now.plus(parseDuration(jwtProperties.refreshExpiresIn()));

        var accessToken = buildToken(userPrincipal, accessExpiration, ACCESS_TOKEN_TYPE, jwtProperties.accessSecret());
        var refreshToken = buildToken(userPrincipal, refreshExpiration, REFRESH_TOKEN_TYPE, jwtProperties.refreshSecret());

        return new TokenPair(accessToken, refreshToken, accessExpiration);
    }

    public String extractUsername(String token) {
        return parseClaims(token, jwtProperties.accessSecret()).getSubject();
    }

    public boolean isTokenValid(String token, UserPrincipal userPrincipal) {
        var claims = parseClaims(token, jwtProperties.accessSecret());
        return userPrincipal.getUsername().equalsIgnoreCase(claims.getSubject())
                && ACCESS_TOKEN_TYPE.equals(claims.get("token_type", String.class))
                && claims.getExpiration().toInstant().isAfter(Instant.now());
    }

    private String buildToken(UserPrincipal userPrincipal, Instant expiresAt, String tokenType, String secret) {
        var now = Instant.now();
        return Jwts.builder()
                .issuer(jwtProperties.issuer())
                .subject(userPrincipal.getUsername())
                .id(UUID.randomUUID().toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .claim("uid", userPrincipal.id().toString())
                .claim("full_name", userPrincipal.fullName())
                .claim("department", userPrincipal.department())
                .claim("role", userPrincipal.role())
                .claim("token_type", tokenType)
                .signWith(signingKey(secret))
                .compact();
    }

    private Claims parseClaims(String token, String secret) {
        return Jwts.parser()
                .verifyWith(signingKey(secret))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey signingKey(String secret) {
        return Keys.hmacShaKeyFor(normalizeSecret(secret));
    }

    private byte[] normalizeSecret(String secret) {
        var raw = secret.getBytes(StandardCharsets.UTF_8);
        if (raw.length >= 32) {
            return raw;
        }

        try {
            var digest = MessageDigest.getInstance("SHA-256");
            return digest.digest(raw);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Unable to initialize JWT signing key", exception);
        }
    }

    private Duration parseDuration(String value) {
        var trimmed = value.trim().toLowerCase();
        if (trimmed.endsWith("ms")) {
            return Duration.ofMillis(Long.parseLong(trimmed.substring(0, trimmed.length() - 2)));
        }
        if (trimmed.endsWith("s")) {
            return Duration.ofSeconds(Long.parseLong(trimmed.substring(0, trimmed.length() - 1)));
        }
        if (trimmed.endsWith("m")) {
            return Duration.ofMinutes(Long.parseLong(trimmed.substring(0, trimmed.length() - 1)));
        }
        if (trimmed.endsWith("h")) {
            return Duration.ofHours(Long.parseLong(trimmed.substring(0, trimmed.length() - 1)));
        }
        if (trimmed.endsWith("d")) {
            return Duration.ofDays(Long.parseLong(trimmed.substring(0, trimmed.length() - 1)));
        }
        return Duration.ofMinutes(Long.parseLong(trimmed));
    }

    public record TokenPair(String accessToken, String refreshToken, Instant expiredAt) {
    }
}
