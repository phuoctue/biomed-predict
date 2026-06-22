package com.mediai.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mediai.auth.dto.AuthUserResponse;
import com.mediai.auth.dto.ChangePasswordRequest;
import com.mediai.auth.dto.LoginRequest;
import com.mediai.auth.dto.LoginResponse;
import com.mediai.auth.dto.MessageResponse;
import com.mediai.auth.service.AuthService;
import com.mediai.dto.password.ForgotPasswordRequest;
import com.mediai.dto.password.ForgotPasswordResponse;
import com.mediai.dto.password.ResetPasswordRequest;
import com.mediai.dto.password.ResetPasswordResponse;
import com.mediai.dto.password.ValidateResetTokenRequest;
import com.mediai.dto.password.ValidateResetTokenResponse;
import com.mediai.security.UserPrincipal;
import com.mediai.service.PasswordResetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthService authService, PasswordResetService passwordResetService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout() {
        return ResponseEntity.ok(authService.logout());
    }

    @PostMapping("/change-password")
    public MessageResponse changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        return authService.changePassword(principal, request);
    }

    @GetMapping("/me")
    public AuthUserResponse currentUser(@AuthenticationPrincipal UserPrincipal principal) {
        return authService.currentUser(principal);
    }

    @PostMapping("/forgot-password")
    public ForgotPasswordResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return passwordResetService.forgotPassword(request.email());
    }

    @PostMapping("/validate-reset-token")
    public ValidateResetTokenResponse validateResetToken(@Valid @RequestBody ValidateResetTokenRequest request) {
        return passwordResetService.validateResetToken(request.token());
    }

    @PostMapping("/reset-password")
    public ResetPasswordResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return passwordResetService.resetPassword(request.token(), request.newPassword());
    }
}
