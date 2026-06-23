package com.mediai.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mediai.dto.common.ApiResponse;
import com.mediai.dto.common.PageResponse;
import com.mediai.dto.user.ChangePasswordRequest;
import com.mediai.dto.user.CreateUserRequest;
import com.mediai.dto.user.UpdateUserRequest;
import com.mediai.dto.user.UpdateProfileRequest;
import com.mediai.dto.user.UserResponse;
import com.mediai.entity.UserRole;
import com.mediai.security.UserPrincipal;
import com.mediai.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<UserResponse> listUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UserRole role,
            @PageableDefault(size = 20) Pageable pageable) {
        return userService.listUsers(keyword, role, pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ApiResponse<UserResponse> getUser(@PathVariable Long id) {
        return ApiResponse.ok("User retrieved successfully.", userService.getUser(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("User created successfully.", userService.createUser(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        return ApiResponse.ok("User updated successfully.", userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        userService.deleteUser(id, currentUser.id());
        return ApiResponse.ok("User deleted successfully.", "deleted");
    }

    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> changePassword(
            @PathVariable Long id,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(id, request);
        return ApiResponse.ok("Password changed successfully.", "updated");
    }

    @GetMapping("/profile/me")
    public ApiResponse<UserResponse> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("Profile retrieved successfully.", userService.getUser(principal.id()));
    }

    @PutMapping("/profile/me")
    public ApiResponse<UserResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ApiResponse.ok("Profile updated successfully.",
                userService.updateProfile(principal.id(), request));
    }
}
