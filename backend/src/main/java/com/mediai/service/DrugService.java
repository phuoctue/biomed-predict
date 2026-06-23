package com.mediai.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.dto.common.PageResponse;
import com.mediai.dto.drug.DrugInteractionResponse;
import com.mediai.dto.drug.DrugRequest;
import com.mediai.dto.drug.DrugResponse;
import com.mediai.dto.drug.DrugSummaryResponse;
import com.mediai.entity.Drug;
import com.mediai.exception.ResourceNotFoundException;
import com.mediai.repository.DrugInteractionRepository;
import com.mediai.repository.DrugRepository;
import com.mediai.specification.DrugSpecifications;

@Service
public class DrugService {

    private final DrugRepository drugRepository;
    private final DrugInteractionRepository drugInteractionRepository;

    public DrugService(DrugRepository drugRepository, DrugInteractionRepository drugInteractionRepository) {
        this.drugRepository = drugRepository;
        this.drugInteractionRepository = drugInteractionRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<DrugSummaryResponse> listDrugs(String keyword, String drugGroup, String ingredient,
            Pageable pageable) {
        Specification<Drug> specification = DrugSpecifications.keywordContains(keyword)
                .and(DrugSpecifications.drugGroupEquals(drugGroup))
                .and(DrugSpecifications.ingredientContains(ingredient));

        Page<DrugSummaryResponse> page = drugRepository.findAll(specification, pageable).map(DrugSummaryResponse::from);
        return PageResponse.ok(
                "Drugs retrieved successfully.",
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast());
    }

    @Transactional(readOnly = true)
    public DrugResponse getDrug(Long id) {
        return DrugResponse.from(findDrug(id));
    }

    @Transactional
    public DrugResponse createDrug(DrugRequest request) {
        validateUniqueCode(request.code(), null);

        var drug = new Drug();
        applyRequest(drug, request);
        return DrugResponse.from(drugRepository.save(drug));
    }

    @Transactional
    public DrugResponse updateDrug(Long id, DrugRequest request) {
        var drug = findDrug(id);
        validateUniqueCode(request.code(), id);

        applyRequest(drug, request);
        return DrugResponse.from(drugRepository.save(drug));
    }

    @Transactional
    public void deleteDrug(Long id) {
        drugRepository.delete(findDrug(id));
    }

    @Transactional(readOnly = true)
    public List<DrugInteractionResponse> getInteractions(Long drugId) {
        findDrug(drugId);
        return drugInteractionRepository
                .findBySourceDrug_IdOrTargetDrug_IdOrderByCreatedAtDesc(drugId, drugId).stream()
                .map(DrugInteractionResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DrugSummaryResponse> getDrugsByIngredient(Long ingredientId) {
        return drugRepository.findDistinctByDrugIngredients_Ingredient_Id(ingredientId).stream()
                .map(DrugSummaryResponse::from)
                .toList();
    }

    private Drug findDrug(Long id) {
        return drugRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drug not found."));
    }

    private void validateUniqueCode(String code, Long currentId) {
        var existing = drugRepository.findByCodeIgnoreCase(code);
        if (existing.isPresent() && (currentId == null || !existing.get().getId().equals(currentId))) {
            throw new IllegalArgumentException("Drug code already exists.");
        }
    }

    private void applyRequest(Drug drug, DrugRequest request) {
        drug.setCode(request.code());
        drug.setName(request.name());
        drug.setGenericName(request.genericName());
        drug.setDrugGroup(request.drugGroup());
        drug.setDosageForm(request.dosageForm());
        drug.setStrength(request.strength());
        drug.setUnit(request.unit());
        drug.setManufacturer(request.manufacturer());
        drug.setUsageInstructions(request.usageInstructions());
        drug.setRecommendedDose(request.recommendedDose());
        drug.setSideEffects(request.sideEffects());
        drug.setStorageCondition(request.storageCondition());
        drug.setStatus(request.status() == null || request.status().isBlank() ? "ACTIVE" : request.status());
    }
}
