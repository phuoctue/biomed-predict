package com.mediai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mediai.entity.DoctorDecision;

@Repository
public interface DoctorDecisionRepository extends JpaRepository<DoctorDecision, Long> {
}
