package com.mediai.specification;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.mediai.entity.Patient;

public final class PatientSpecifications {

    private PatientSpecifications() {
    }

    public static Specification<Patient> keywordContains(String keyword) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(keyword)) {
                return cb.conjunction();
            }

            var pattern = "%" + keyword.trim().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("mrn")), pattern),
                    cb.like(cb.lower(root.get("fullName")), pattern),
                    cb.like(cb.lower(root.get("citizenId")), pattern),
                    cb.like(cb.lower(root.get("phone")), pattern),
                    cb.like(cb.lower(root.get("bloodType")), pattern),
                    cb.like(cb.lower(root.get("diagnosis")), pattern),
                    cb.like(cb.lower(root.get("allergies")), pattern));
        };
    }
}
