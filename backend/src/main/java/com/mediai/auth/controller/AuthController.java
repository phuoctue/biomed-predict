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
import com.mediai.auth.dto.RefreshTokenRequest;
import com.mediai.auth.service.AuthService;
import com.mediai.security.UserPrincipal;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public LoginResponse refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return authService.refresh(request);
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
}
