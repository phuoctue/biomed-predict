package com.mediai.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mediai.entity.LabResult;

@Repository
public interface LabResultRepository extends JpaRepository<LabResult, UUID> {
}
