package com.mediai.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.mediai.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, UUID>, JpaSpecificationExecutor<Patient> {

    boolean existsByMrnIgnoreCase(String mrn);

    boolean existsByCitizenIdIgnoreCase(String citizenId);

    Optional<Patient> findByMrnIgnoreCase(String mrn);

    Optional<Patient> findByCitizenIdIgnoreCase(String citizenId);
}
