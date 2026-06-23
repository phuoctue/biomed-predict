package com.mediai.repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mediai.entity.AIEvaluation;

public interface AIEvaluationRepository extends JpaRepository<AIEvaluation, UUID>, JpaSpecificationExecutor<AIEvaluation> {

    List<AIEvaluation> findByPatient_IdOrderByCreatedAtDesc(UUID patientId);

    List<AIEvaluation> findByPatient_IdAndDrug_IdOrderByCreatedAtDesc(UUID patientId, UUID drugId);

    List<AIEvaluation> findByDrug_IdOrderByCreatedAtDesc(UUID drugId);

    AIEvaluation findTopByPatient_IdOrderByCreatedAtDesc(UUID patientId);

    long countByRiskLevel(String riskLevel);

    @Query(value = "SELECT e.id::text, p.full_name AS \"patientName\", e.created_at AS \"date\", e.risk_level AS \"riskLevel\" " +
                   "FROM evaluations e " +
                   "JOIN patients p ON e.patient_id = p.id " +
                   "ORDER BY e.created_at DESC " +
                   "LIMIT :limit", nativeQuery = true)
    List<Map<String, Object>> findRecentEvaluations(@Param("limit") int limit);
}
