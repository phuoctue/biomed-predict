package com.mediai.specification;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.mediai.entity.User;
import com.mediai.entity.UserRole;

public final class UserSpecifications {

    private UserSpecifications() {
    }

    public static Specification<User> keywordContains(String keyword) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(keyword)) {
                return cb.conjunction();
            }
            var pattern = "%" + keyword.trim().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("fullName")), pattern),
                    cb.like(cb.lower(root.get("email")), pattern),
                    cb.like(cb.lower(root.get("department")), pattern));
        };
    }

    public static Specification<User> hasRole(UserRole role) {
        return (root, query, cb) -> {
            if (role == null) {
                return cb.conjunction();
            }
            // The User entity now stores the role as a ManyToOne association
            // to the `roles` table, so we filter by the role name on the
            // associated entity rather than the previous enum-typed field.
            return cb.equal(root.get("role").get("name"), role.name());
        };
    }
}
