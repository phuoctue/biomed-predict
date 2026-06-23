package com.mediai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mediai.entity.PatientAllergy;

public interface PatientAllergyRepository extends JpaRepository<PatientAllergy, Long> {
    List<PatientAllergy> findByPatient_Id(Long patientId);
}
