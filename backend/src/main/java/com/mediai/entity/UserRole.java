package com.mediai.entity;

public enum UserRole {
    ADMIN,
    DOCTOR,
    PHARMACIST,
    MEDICAL_STAFF;

    /**
     * Convert a database role name (matches the seed values inserted by
     * V6__seed_initial_data.sql) into the strongly typed enum.
     * Unknown values map to MEDICAL_STAFF as a safe default so the rest of
     * the system can still authenticate the user.
     */
    public static UserRole fromDbName(String name) {
        if (name == null || name.isBlank()) {
            return MEDICAL_STAFF;
        }
        try {
            return UserRole.valueOf(name.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return MEDICAL_STAFF;
        }
    }
}
