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
import org.springframework.data.domain.Sort;
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
import com.mediai.dto.common.PageResponse;
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
        var patient = findPatient(request.patientId());
        var drug = findDrug(request.drugId());
        var evaluator = findEvaluator(principal);
        var aiPayload = buildPayload(patient, drug, request.dosage(), request.labs());

        var prompt = buildPrompt(aiPayload);
        var start = System.nanoTime();
        var aiResponse = aiServiceClient.evaluate(aiPayload);
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
        Specification<AIEvaluation> specification = AIEvaluationSpecifications.hasPatientId(patientId)
                .and(AIEvaluationSpecifications.hasDrugId(drugId));

        return aiEvaluationRepository.findAll(specification, pageable)
                .map(this::toSummaryResponse);
    }

    @Transactional(readOnly = true)
    public Page<AIEvaluationSummaryResponse> getEvaluationHistory(UUID patientId, UUID drugId, String riskLevel,
            Pageable pageable) {
        Specification<AIEvaluation> specification = AIEvaluationSpecifications.hasPatientId(patientId)
                .and(AIEvaluationSpecifications.hasDrugId(drugId));

        if (riskLevel != null && !riskLevel.isBlank()) {
            specification = specification.and(AIEvaluationSpecifications.hasRiskLevel(riskLevel));
        }

        return aiEvaluationRepository.findAll(specification, pageable)
                .map(this::toSummaryResponse);
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
        var labs = readStringMap(previous.getLabsJson());
        var request = new AIEvaluationRequest(
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

    private EvaluationRequestPayload buildPayload(Patient patient, Drug drug, String dosage, Map<String, String> labs) {
        return new EvaluationRequestPayload(
                patient.getId().toString(),
                calculateAge(patient.getDateOfBirth()),
                firstNonBlank(patient.getDiagnosis(), "No diagnosis provided"),
                drug.getName(),
                firstNonBlank(dosage, firstNonBlank(drug.getRecommendedDose(), drug.getStrength())),
                parseAllergies(patient.getAllergies()),
                labs == null ? Map.of() : labs);
    }

    private AIEvaluationResponse toResponse(AIEvaluation evaluation, EvaluationResponsePayload aiResponse) {
        var warnings = readStringList(evaluation.getWarningsJson());
        var alternatives = readStringList(evaluation.getAlternativesJson());

        if (aiResponse != null) {
            warnings = aiResponse.warnings() == null ? warnings : aiResponse.warnings();
            alternatives = aiResponse.alternatives() == null ? alternatives : aiResponse.alternatives();
        }

        return new AIEvaluationResponse(
                evaluation.getId(),
                evaluation.getPatient().getId(),
                evaluation.getPatient().getFullName(),
                evaluation.getDrug().getId(),
                evaluation.getDrug().getName(),
                evaluation.getDosage(),
                evaluation.getModelName(),
                evaluation.getModelVersion(),
                evaluation.getSuitabilityScore(),
                evaluation.getConfidenceScore(),
                evaluation.getRiskLevel(),
                evaluation.getSummary(),
                warnings,
                alternatives,
                evaluation.getRawExplanation(),
                evaluation.getProcessingTimeMs(),
                evaluation.getCreatedAt());
    }

    private AIEvaluationSummaryResponse toSummaryResponse(AIEvaluation evaluation) {
        return new AIEvaluationSummaryResponse(
                evaluation.getId(),
                evaluation.getPatient().getId(),
                evaluation.getPatient().getFullName(),
                evaluation.getDrug().getId(),
                evaluation.getDrug().getName(),
                evaluation.getSuitabilityScore(),
                evaluation.getConfidenceScore(),
                evaluation.getRiskLevel(),
                evaluation.getSummary(),
                evaluation.getCreatedAt());
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

    private Integer calculateAge(LocalDate dateOfBirth) {
        if (dateOfBirth == null) {
            return null;
        }
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }

    private List<String> parseAllergies(String allergies) {
        if (allergies == null || allergies.isBlank()) {
            return List.of();
        }
        return List.of(allergies.split("[,;\\n]+")).stream()
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .toList();
    }

    private String firstNonBlank(String primary, String fallback) {
        return primary != null && !primary.isBlank() ? primary : fallback;
    }

    private String normalizeRiskLevel(String riskLevel) {
        if (riskLevel == null || riskLevel.isBlank()) {
            return "moderate";
        }
        return riskLevel.trim().toLowerCase();
    }

    private Integer estimateConfidence(Integer suitabilityScore) {
        if (suitabilityScore == null) {
            return null;
        }
        return Math.max(55, Math.min(95, suitabilityScore - 4));
    }

    private String buildPrompt(EvaluationRequestPayload payload) {
        return "evaluate medication suitability | " + toJson(payload);
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Unable to serialize AI payload.", exception);
        }
    }

    private List<String> readStringList(String json) {
        if (json == null || json.isBlank()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (IOException exception) {
            return List.of();
        }
    }

    private Map<String, String> readStringMap(String json) {
        if (json == null || json.isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, String>>() {});
        } catch (IOException exception) {
            return Collections.emptyMap();
        }
    }
}
