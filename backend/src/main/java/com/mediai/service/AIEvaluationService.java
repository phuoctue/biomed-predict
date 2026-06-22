package com.mediai.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.entity.AIEvaluation;
import com.mediai.repository.AIEvaluationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AIEvaluationService {

    private final AIEvaluationRepository aiEvaluationRepository;

    public AIEvaluation createEvaluation(AIEvaluation evaluation) {
        return aiEvaluationRepository.save(evaluation);
    }

    public AIEvaluation getEvaluationById(Long id) {
        return aiEvaluationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("AI evaluation not found"));
    }

    public void deleteEvaluation(Long id) {
        AIEvaluation evaluation = getEvaluationById(id);
        evaluation.setDeleted(true);
        aiEvaluationRepository.save(evaluation);
    }
}
