package com.mediai.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mediai.entity.Prescription;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, UUID> {
}
