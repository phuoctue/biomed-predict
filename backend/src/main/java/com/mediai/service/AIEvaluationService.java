package com.mediai.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.entity.AIEvaluation;
import com.mediai.exception.ResourceNotFoundException;
import com.mediai.repository.AIEvaluationRepository;

import lombok.RequiredArgsConstructor;

@Service("legacyAIEvaluationService")
@RequiredArgsConstructor
@Transactional
public class AIEvaluationService {

    private final AIEvaluationRepository aiEvaluationRepository;

    public AIEvaluation createEvaluation(AIEvaluation evaluation) {
        return aiEvaluationRepository.save(evaluation);
    }

    public AIEvaluation getEvaluationById(UUID id) {
        return aiEvaluationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("AI evaluation not found."));
    }

    public void deleteEvaluation(UUID id) {
        AIEvaluation evaluation = getEvaluationById(id);
        aiEvaluationRepository.delete(evaluation);
    }
}
