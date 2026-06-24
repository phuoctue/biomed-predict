package com.mediai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mediai.entity.VitalSign;

@Repository
public interface VitalSignRepository extends JpaRepository<VitalSign, Long> {
}
