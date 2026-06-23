package com.mediai.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.entity.User;
import com.mediai.entity.UserRole;
import com.mediai.repository.UserRepository;

@Component
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedUser(
                "doctor@mediai.local",
                "doctor",
                "password123",
                "Dr. Nguyen Minh",
                UserRole.DOCTOR,
                "Internal Medicine");

        seedUser(
                "admin@mediai.local",
                "admin",
                "admin12345",
                "System Admin",
                UserRole.ADMIN,
                "Administration");
    }

    private void seedUser(String email, String username, String rawPassword,
            String fullName, UserRole role, String department) {
        if (userRepository.existsByEmailIgnoreCase(email)) {
            return;
        }

        var user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setFullName(fullName);
        user.setRole(role);
        user.setDepartment(department);
        user.setStatus("ACTIVE");
        userRepository.save(user);
    }
}
