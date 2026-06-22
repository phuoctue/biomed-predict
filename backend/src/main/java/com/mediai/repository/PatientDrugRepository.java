package com.mediai.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mediai.entity.PatientDrug;

public interface PatientDrugRepository extends JpaRepository<PatientDrug, UUID> {
    List<PatientDrug> findByPatient_Id(UUID patientId);
}
