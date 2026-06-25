package com.mediai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mediai.entity.PharmacyVerification;

@Repository
public interface PharmacyVerificationRepository extends JpaRepository<PharmacyVerification, Long> {
}
