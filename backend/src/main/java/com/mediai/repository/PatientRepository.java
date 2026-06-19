package com.mediai.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.mediai.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, UUID>, JpaSpecificationExecutor<Patient> {

    boolean existsByMrnIgnoreCase(String mrn);

    boolean existsByCitizenIdIgnoreCase(String citizenId);

    java.util.Optional<Patient> findByMrnIgnoreCase(String mrn);

    java.util.Optional<Patient> findByCitizenIdIgnoreCase(String citizenId);
}
