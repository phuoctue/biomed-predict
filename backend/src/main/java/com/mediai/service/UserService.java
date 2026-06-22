package com.mediai.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.dto.common.PageResponse;
import com.mediai.dto.user.ChangePasswordRequest;
import com.mediai.dto.user.CreateUserRequest;
import com.mediai.dto.user.UpdateUserRequest;
import com.mediai.dto.user.UpdateProfileRequest;
import com.mediai.dto.user.UserResponse;
import com.mediai.entity.User;
import com.mediai.entity.UserRole;
import com.mediai.exception.ResourceNotFoundException;
import com.mediai.repository.UserRepository;
import com.mediai.specification.UserSpecifications;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> listUsers(String keyword, UserRole role, Pageable pageable) {
        Specification<User> spec = Specification
                .where(UserSpecifications.keywordContains(keyword))
                .and(UserSpecifications.hasRole(role));

        Page<UserResponse> page = userRepository.findAll(spec, pageable).map(UserResponse::from);

        return PageResponse.ok(
                "Users retrieved successfully.",
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast());
    }

    @Transactional(readOnly = true)
    public UserResponse getUser(UUID id) {
        return UserResponse.from(findUser(id));
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new IllegalArgumentException("Email already exists.");
        }

        var user = new User();
        user.setEmail(request.email().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName());
        user.setRole(request.role());
        user.setDepartment(request.department());

        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateUser(UUID id, UpdateUserRequest request) {
        var user = findUser(id);

        user.setFullName(request.fullName());
        user.setRole(request.role());
        user.setDepartment(request.department());

        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(UUID id, UUID currentUserId) {
        if (id.equals(currentUserId)) {
            throw new IllegalArgumentException("Cannot delete your own account.");
        }
        var user = findUser(id);
        userRepository.delete(user);
    }

    @Transactional
    public void changePassword(UUID id, ChangePasswordRequest request) {
        var user = findUser(id);
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Transactional
    public UserResponse updateProfile(UUID id, UpdateProfileRequest request) {
        var user = findUser(id);
        if (request.fullName() != null && !request.fullName().isBlank()) {
            user.setFullName(request.fullName());
        }
        if (request.department() != null && !request.department().isBlank()) {
            user.setDepartment(request.department());
        }
        return UserResponse.from(userRepository.save(user));
    }

    private User findUser(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }
}
