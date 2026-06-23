package com.mediai.ai.service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.Period;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mediai.ai.client.AiServiceClient;
import com.mediai.ai.config.AiServiceProperties;
import com.mediai.ai.dto.AIEvaluationRequest;
import com.mediai.ai.dto.AIEvaluationResponse;
import com.mediai.ai.dto.AIEvaluationSummaryResponse;
import com.mediai.ai.dto.EvaluationRequestPayload;
import com.mediai.ai.dto.EvaluationResponsePayload;
import com.mediai.ai.dto.ExplainRequestPayload;
import com.mediai.ai.dto.ExplainResponsePayload;
import com.mediai.entity.AIEvaluation;
import com.mediai.entity.Drug;
import com.mediai.entity.Patient;
import com.mediai.entity.User;
import com.mediai.exception.ResourceNotFoundException;
import com.mediai.repository.AIEvaluationRepository;
import com.mediai.repository.DrugRepository;
import com.mediai.repository.PatientRepository;
import com.mediai.repository.UserRepository;
import com.mediai.security.UserPrincipal;
import com.mediai.specification.AIEvaluationSpecifications;

@Service
public class AIEvaluationService {

    private final AIEvaluationRepository aiEvaluationRepository;
    private final PatientRepository patientRepository;
    private final DrugRepository drugRepository;
    private final UserRepository userRepository;
    private final AiServiceClient aiServiceClient;
    private final AiServiceProperties aiServiceProperties;
    private final ObjectMapper objectMapper;

    public AIEvaluationService(
            AIEvaluationRepository aiEvaluationRepository,
            PatientRepository patientRepository,
            DrugRepository drugRepository,
            UserRepository userRepository,
            AiServiceClient aiServiceClient,
            AiServiceProperties aiServiceProperties,
            ObjectMapper objectMapper) {
        this.aiEvaluationRepository = aiEvaluationRepository;
        this.patientRepository = patientRepository;
        this.drugRepository = drugRepository;
        this.userRepository = userRepository;
        this.aiServiceClient = aiServiceClient;
        this.aiServiceProperties = aiServiceProperties;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public AIEvaluationResponse evaluate(AIEvaluationRequest request, UserPrincipal principal) {
        var patient   = findPatient(request.patientId());
        var drug      = findDrug(request.drugId());
        var evaluator = findEvaluator(principal);
        var aiPayload = buildPayload(patient, drug, request.dosage(), request.labs());

        var prompt          = buildPrompt(aiPayload);
        var start           = System.nanoTime();
        var aiResponse      = aiServiceClient.evaluate(aiPayload);
        var processingTimeMs = (System.nanoTime() - start) / 1_000_000L;

        var evaluation = new AIEvaluation();
        evaluation.setPatient(patient);
        evaluation.setDrug(drug);
        evaluation.setEvaluator(evaluator);
        evaluation.setModelName(aiServiceProperties.modelName());
        evaluation.setModelVersion(aiServiceProperties.modelVersion());
        evaluation.setPrompt(prompt);
        evaluation.setResponse(toJson(aiResponse));
        evaluation.setProcessingTimeMs(processingTimeMs);
        evaluation.setDosage(request.dosage());
        evaluation.setLabsJson(toJson(request.labs() == null ? Map.of() : request.labs()));
        evaluation.setSuitabilityScore(aiResponse.suitability_score());
        evaluation.setConfidenceScore(estimateConfidence(aiResponse.suitability_score()));
        evaluation.setRiskLevel(normalizeRiskLevel(aiResponse.risk_level()));
        evaluation.setSummary(aiResponse.summary());
        evaluation.setRawExplanation(aiResponse.raw_explanation());
        evaluation.setWarningsJson(toJson(aiResponse.warnings() == null ? List.of() : aiResponse.warnings()));
        evaluation.setAlternativesJson(toJson(aiResponse.alternatives() == null ? List.of() : aiResponse.alternatives()));

        return toResponse(aiEvaluationRepository.save(evaluation), aiResponse);
    }

    @Transactional(readOnly = true)
    public Page<AIEvaluationSummaryResponse> listEvaluations(UUID patientId, UUID drugId, Pageable pageable) {
        Specification<AIEvaluation> spec = AIEvaluationSpecifications.hasPatientId(patientId)
                .and(AIEvaluationSpecifications.hasDrugId(drugId));
        return aiEvaluationRepository.findAll(spec, pageable).map(this::toSummaryResponse);
    }

    @Transactional(readOnly = true)
    public AIEvaluationResponse getEvaluation(UUID id) {
        return toResponse(findEvaluation(id), null);
    }

    @Transactional(readOnly = true)
    public AIEvaluationSummaryResponse getSummary(UUID id) {
        return toSummaryResponse(findEvaluation(id));
    }

    @Transactional(readOnly = true)
    public List<String> getWarnings(UUID id) {
        return readStringList(findEvaluation(id).getWarningsJson());
    }

    @Transactional(readOnly = true)
    public List<String> getRecommendations(UUID id) {
        return readStringList(findEvaluation(id).getAlternativesJson());
    }

    @Transactional
    public AIEvaluationResponse reanalyze(UUID id, UserPrincipal principal) {
        var previous = findEvaluation(id);
        var labs     = readStringMap(previous.getLabsJson());
        var request  = new AIEvaluationRequest(
                previous.getPatient().getId(),
                previous.getDrug().getId(),
                previous.getDosage(),
                labs);
        return evaluate(request, principal);
    }

    @Transactional(readOnly = true)
    public ExplainResponsePayload explain(String result, String targetLanguage) {
        return aiServiceClient.explain(new ExplainRequestPayload(result, targetLanguage));
    }

    // ── private helpers ──────────────────────────────────────────────────────

    private EvaluationRequestPayload buildPayload(Patient patient, Drug drug,
            String dosage, Map<String, String> labs) {
        return new EvaluationRequestPayload(
                patient.getId().toString(),
                calculateAge(patient.getDateOfBirth()),
                firstNonBlank(patient.getDiagnosis(), "No diagnosis provided"),
                drug.getName(),
                firstNonBlank(dosage, firstNonBlank(drug.getRecommendedDose(), drug.getStrength())),
                parseAllergies(patient.getAllergies()),
                labs == null ? Map.of() : labs);
    }

    private AIEvaluationResponse toResponse(AIEvaluation e, EvaluationResponsePayload ai) {
        var warnings     = readStringList(e.getWarningsJson());
        var alternatives = readStringList(e.getAlternativesJson());
        if (ai != null) {
            warnings     = ai.warnings()     == null ? warnings     : ai.warnings();
            alternatives = ai.alternatives() == null ? alternatives : ai.alternatives();
        }
        return new AIEvaluationResponse(
                e.getId(), e.getPatient().getId(), e.getPatient().getFullName(),
                e.getDrug().getId(), e.getDrug().getName(), e.getDosage(),
                e.getModelName(), e.getModelVersion(),
                e.getSuitabilityScore(), e.getConfidenceScore(),
                e.getRiskLevel(), e.getSummary(),
                warnings, alternatives, e.getRawExplanation(),
                e.getProcessingTimeMs(), e.getCreatedAt());
    }

    private AIEvaluationSummaryResponse toSummaryResponse(AIEvaluation e) {
        return new AIEvaluationSummaryResponse(
                e.getId(), e.getPatient().getId(), e.getPatient().getFullName(),
                e.getDrug().getId(), e.getDrug().getName(),
                e.getSuitabilityScore(), e.getConfidenceScore(),
                e.getRiskLevel(), e.getSummary(), e.getCreatedAt());
    }

    private AIEvaluation findEvaluation(UUID id) {
        return aiEvaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AI evaluation not found."));
    }

    private Patient findPatient(UUID id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found."));
    }

    private Drug findDrug(UUID id) {
        return drugRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drug not found."));
    }

    private User findEvaluator(UserPrincipal principal) {
        return userRepository.findById(principal.id())
                .orElseThrow(() -> new ResourceNotFoundException("Evaluator account not found."));
    }

    private Integer calculateAge(LocalDate dob) {
        return dob == null ? null : Period.between(dob, LocalDate.now()).getYears();
    }

    private List<String> parseAllergies(String allergies) {
        if (allergies == null || allergies.isBlank()) return List.of();
        return List.of(allergies.split("[,;\\n]+")).stream()
                .map(String::trim).filter(v -> !v.isBlank()).toList();
    }

    private String firstNonBlank(String a, String b) {
        return a != null && !a.isBlank() ? a : b;
    }

    private String normalizeRiskLevel(String r) {
        return r == null || r.isBlank() ? "moderate" : r.trim().toLowerCase();
    }

    private Integer estimateConfidence(Integer score) {
        return score == null ? null : Math.max(55, Math.min(95, score - 4));
    }

    private String buildPrompt(EvaluationRequestPayload payload) {
        return "evaluate medication suitability | " + toJson(payload);
    }

    private String toJson(Object value) {
        try { return objectMapper.writeValueAsString(value); }
        catch (JsonProcessingException e) { throw new IllegalStateException("Serialization error", e); }
    }

    private List<String> readStringList(String json) {
        if (json == null || json.isBlank()) return List.of();
        try { return objectMapper.readValue(json, new TypeReference<>() {}); }
        catch (IOException e) { return List.of(); }
    }

    private Map<String, String> readStringMap(String json) {
        if (json == null || json.isBlank()) return Map.of();
        try { return objectMapper.readValue(json, new TypeReference<>() {}); }
        catch (IOException e) { return Collections.emptyMap(); }
    }
}
