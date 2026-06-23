package com.mediai.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mediai.entity.PatientAllergy;

public interface PatientAllergyRepository extends JpaRepository<PatientAllergy, UUID> {
    List<PatientAllergy> findByPatient_Id(UUID patientId);
}
