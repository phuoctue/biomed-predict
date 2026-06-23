package com.mediai.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.mediai.entity.User;
import com.mediai.entity.UserRole;

public record UserPrincipal(
        Long id,
        String email,
        String password,
        String fullName,
        String department,
        String role) implements UserDetails {

    public static UserPrincipal from(User user) {
        // The `role` field on the User entity is now a JPA association to
        // the `roles` table.  We materialise the role name lazily here and
        // gracefully fall back to MEDICAL_STAFF if the association is not
        // loaded (which can happen in unit tests or in some Hibernate
        // edge cases).
        String roleName = resolveRoleName(user);
        return new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getFullName(),
                user.getDepartment(),
                roleName);
    }

    private static String resolveRoleName(User user) {
        if (user == null) {
            return UserRole.MEDICAL_STAFF.name();
        }
        var association = user.getRole();
        if (association == null || association.getName() == null || association.getName().isBlank()) {
            return UserRole.MEDICAL_STAFF.name();
        }
        return UserRole.fromDbName(association.getName()).name();
    }

    public String role() {
        return role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
