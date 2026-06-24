package com.mediai.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mediai.entity.MedicalRecord;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, UUID> {
    MedicalRecord findTopByPatient_IdOrderByVisitDateDesc(UUID patientId);
}
