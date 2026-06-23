package com.mediai.specification;

import org.springframework.data.jpa.domain.Specification;

import com.mediai.entity.AIEvaluation;

public final class AIEvaluationSpecifications {

    private AIEvaluationSpecifications() {
    }

    public static Specification<AIEvaluation> hasPatientId(Long patientId) {
        return (root, query, cb) -> patientId == null
                ? cb.conjunction()
                : cb.equal(root.get("patient").get("id"), patientId);
    }

    public static Specification<AIEvaluation> hasDrugId(Long drugId) {
        return (root, query, cb) -> drugId == null
                ? cb.conjunction()
                : cb.equal(root.get("drug").get("id"), drugId);
    }
}
