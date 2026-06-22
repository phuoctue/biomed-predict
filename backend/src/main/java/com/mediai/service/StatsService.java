package com.mediai.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.repository.UserRepository;
import com.mediai.repository.PatientRepository;
import com.mediai.repository.AIEvaluationRepository;

@Service
public class StatsService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final AIEvaluationRepository aiEvaluationRepository;

    public StatsService(UserRepository userRepository, PatientRepository patientRepository,
            AIEvaluationRepository aiEvaluationRepository) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.aiEvaluationRepository = aiEvaluationRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("users", userRepository.count());
        stats.put("patients", patientRepository.count());
        stats.put("evaluations", aiEvaluationRepository.count());
        return stats;
    }

    @Transactional(readOnly = true)
    public Long getUserCount() {
        return userRepository.count();
    }

    @Transactional(readOnly = true)
    public Long getPatientCount() {
        return patientRepository.count();
    }

    @Transactional(readOnly = true)
    public Long getEvaluationCount() {
        return aiEvaluationRepository.count();
    }
}
