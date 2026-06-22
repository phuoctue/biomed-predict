package com.mediai.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.dto.password.ForgotPasswordResponse;
import com.mediai.dto.password.ResetPasswordResponse;
import com.mediai.dto.password.ValidateResetTokenResponse;
import com.mediai.entity.PasswordResetToken;
import com.mediai.entity.User;
import com.mediai.exception.ResourceNotFoundException;
import com.mediai.repository.PasswordResetTokenRepository;
import com.mediai.repository.UserRepository;

@Service
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PasswordResetService(PasswordResetTokenRepository tokenRepository, UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public ForgotPasswordResponse forgotPassword(String email) {
        var user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User with email not found."));

        var token = generateResetToken();
        var expiresAt = LocalDateTime.now().plusHours(24);

        var resetToken = new PasswordResetToken(user, token, expiresAt);
        tokenRepository.save(resetToken);

        return new ForgotPasswordResponse("Password reset email sent. Token: " + token);
    }

    @Transactional(readOnly = true)
    public ValidateResetTokenResponse validateResetToken(String token) {
        var resetToken = tokenRepository.findByToken(token)
                .orElse(null);

        if (resetToken == null) {
            return new ValidateResetTokenResponse(false, "Token not found.");
        }

        if (resetToken.isExpired()) {
            return new ValidateResetTokenResponse(false, "Token has expired.");
        }

        if (resetToken.isUsed()) {
            return new ValidateResetTokenResponse(false, "Token has already been used.");
        }

        return new ValidateResetTokenResponse(true, "Token is valid.");
    }

    @Transactional
    public ResetPasswordResponse resetPassword(String token, String newPassword) {
        var resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Token not found."));

        if (resetToken.isExpired()) {
            throw new IllegalStateException("Token has expired.");
        }

        if (resetToken.isUsed()) {
            throw new IllegalStateException("Token has already been used.");
        }

        var user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));

        resetToken.setUsedAt(LocalDateTime.now());

        userRepository.save(user);
        tokenRepository.save(resetToken);

        return new ResetPasswordResponse("Password reset successfully.");
    }

    private String generateResetToken() {
        return UUID.randomUUID().toString() + System.currentTimeMillis();
    }
}
