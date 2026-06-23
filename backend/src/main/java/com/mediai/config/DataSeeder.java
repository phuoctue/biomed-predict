package com.mediai.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.entity.Role;
import com.mediai.entity.User;
import com.mediai.entity.UserRole;
import com.mediai.repository.RoleRepository;
import com.mediai.repository.UserRepository;

@Component
@Profile({ "dev", "local", "default" })
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
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
        user.setRole(resolveRole(role));
        user.setDepartment(department);
        user.setStatus("ACTIVE");
        userRepository.save(user);
    }

    private Role resolveRole(UserRole role) {
        var name = role.name();
        return roleRepository.findAll().stream()
                .filter(r -> name.equalsIgnoreCase(r.getName()))
                .findFirst()
                .orElseGet(() -> {
                    var newRole = new Role();
                    newRole.setName(name);
                    newRole.setDescription("Seeded role");
                    return roleRepository.save(newRole);
                });
    }
}
