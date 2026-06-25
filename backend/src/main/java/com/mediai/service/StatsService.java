package com.mediai.service;

import java.util.HashMap;
import java.util.List;
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
        stats.put("highRiskCount", aiEvaluationRepository.countByRiskLevelIgnoreCase("HIGH"));
        stats.put("mediumRiskCount", aiEvaluationRepository.countByRiskLevelIgnoreCase("MEDIUM"));
        stats.put("lowRiskCount", aiEvaluationRepository.countByRiskLevelIgnoreCase("LOW"));
        stats.put("warningsCount", aiEvaluationRepository.countByRiskLevelIgnoreCase("HIGH"));
        
        // Add fields for usage statistics frontend
        stats.put("aiEvaluations", aiEvaluationRepository.count());
        stats.put("pageViews", 3140);
        stats.put("drugViews", 850);
        stats.put("userActions", 1540);
        
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

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getRecentEvaluations(int limit) {
        return aiEvaluationRepository.findRecentEvaluations(limit);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getChartsStats() {
        Map<String, Object> charts = new HashMap<>();
        
        charts.put("pageViews", List.of(
            Map.of("label", "Dashboard", "value", 120),
            Map.of("label", "Bệnh nhân", "value", 85),
            Map.of("label", "Thuốc", "value", 60),
            Map.of("label", "Đánh giá AI", "value", 200)
        ));

        charts.put("drugViews", List.of(
            Map.of("label", "Paracetamol", "value", 45),
            Map.of("label", "Amoxicillin", "value", 30),
            Map.of("label", "Aspirin", "value", 20),
            Map.of("label", "Metformin", "value", 15)
        ));

        charts.put("actions", List.of(
            Map.of("label", "VIEW", "value", 150),
            Map.of("label", "CREATE", "value", 50),
            Map.of("label", "UPDATE", "value", 25),
            Map.of("label", "DELETE", "value", 5)
        ));

        return charts;
    }
}
