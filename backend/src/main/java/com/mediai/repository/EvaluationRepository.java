package com.mediai.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mediai.entity.Evaluation;

public interface EvaluationRepository extends JpaRepository<Evaluation, UUID> {

    List<Evaluation> findByPatient_IdOrderByCreatedAtDesc(UUID patientId);

    Evaluation findTopByPatient_IdOrderByCreatedAtDesc(UUID patientId);
}
