package com.mediai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    // Schema V1 stores the BCrypt hash in the `password` column. We keep the
    // Java field name `passwordHash` to stay close to the rest of the codebase
    // (UserPrincipal / AuthService), but map it to the legacy column name.
    @Column(name = "password", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(length = 100)
    private String department;

    @Column(length = 20)
    private String phone;

    // The database models the role as a foreign key to the `roles` table.
    // We keep using the UserRole enum on the Java side to stay simple and
    // avoid loading the Role aggregate for every authentication.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(nullable = false, length = 20)
    @lombok.Builder.Default
    private String status = "ACTIVE";

    /**
     * Convenience helper used by services / seed code that only know the
     * role name. We resolve the actual {@link Role} entity on demand so the
     * call sites do not have to deal with lazy-loading the role aggregate.
     */
    public UserRole getRoleName() {
        return role == null ? null : UserRole.fromDbName(role.getName());
    }
}
