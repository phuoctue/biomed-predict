package com.mediai.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.auth.dto.AuthUserResponse;
import com.mediai.auth.dto.ChangePasswordRequest;
import com.mediai.auth.dto.LoginRequest;
import com.mediai.auth.dto.LoginResponse;
import com.mediai.auth.dto.MessageResponse;
import com.mediai.entity.User;
import com.mediai.repository.UserRepository;
import com.mediai.security.JwtService;
import com.mediai.security.UserPrincipal;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        var email = normalizeEmail(request.email());
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));

        var user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));
        var principal = UserPrincipal.from(user);
        var tokenPair = jwtService.generateTokenPair(principal);

        return new LoginResponse(
                tokenPair.accessToken(),
                tokenPair.refreshToken(),
                tokenPair.expiredAt(),
                AuthUserResponse.from(user));
    }

    @Transactional(readOnly = true)
    public AuthUserResponse currentUser(UserPrincipal principal) {
        var user = userRepository.findByEmailIgnoreCase(principal.getUsername())
                .orElseThrow(() -> new BadCredentialsException("User session is no longer valid."));
        return AuthUserResponse.from(user);
    }

    @Transactional
    public MessageResponse changePassword(UserPrincipal principal, ChangePasswordRequest request) {
        var user = userRepository.findByEmailIgnoreCase(principal.getUsername())
                .orElseThrow(() -> new BadCredentialsException("User session is no longer valid."));

        if (!passwordEncoder.matches(request.oldPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Current password is incorrect.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        return new MessageResponse("Password updated successfully.");
    }

    public MessageResponse logout() {
        return new MessageResponse("Logout successful.");
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
