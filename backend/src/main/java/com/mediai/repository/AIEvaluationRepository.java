package com.mediai.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.mediai.entity.AIEvaluation;

public interface AIEvaluationRepository extends JpaRepository<AIEvaluation, UUID>, JpaSpecificationExecutor<AIEvaluation> {

    List<AIEvaluation> findByPatient_IdOrderByCreatedAtDesc(UUID patientId);

    List<AIEvaluation> findByPatient_IdAndDrug_IdOrderByCreatedAtDesc(UUID patientId, UUID drugId);

    List<AIEvaluation> findByDrug_IdOrderByCreatedAtDesc(UUID drugId);

    AIEvaluation findTopByPatient_IdOrderByCreatedAtDesc(UUID patientId);
}
