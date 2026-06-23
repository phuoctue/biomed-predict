package com.mediai.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.dto.common.PageResponse;
import com.mediai.dto.drug.DrugSummaryResponse;
import com.mediai.dto.ingredient.IngredientRequest;
import com.mediai.dto.ingredient.IngredientResponse;
import com.mediai.entity.Ingredient;
import com.mediai.exception.ResourceNotFoundException;
import com.mediai.repository.DrugRepository;
import com.mediai.repository.IngredientRepository;
import com.mediai.specification.IngredientSpecifications;

@Service
public class IngredientService {

    private final IngredientRepository ingredientRepository;
    private final DrugRepository drugRepository;

    public IngredientService(IngredientRepository ingredientRepository, DrugRepository drugRepository) {
        this.ingredientRepository = ingredientRepository;
        this.drugRepository = drugRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<IngredientResponse> listIngredients(String keyword, Pageable pageable) {
        Specification<Ingredient> specification = IngredientSpecifications.keywordContains(keyword);
        Page<IngredientResponse> page = ingredientRepository.findAll(specification, pageable)
                .map(IngredientResponse::from);
        return PageResponse.ok("Ingredients retrieved successfully.", page.getContent(),
                page.getNumber(), page.getSize(), page.getTotalElements(),
                page.getTotalPages(), page.isFirst(), page.isLast());
    }

    @Transactional(readOnly = true)
    public IngredientResponse getIngredient(Long id) {
        return IngredientResponse.from(findIngredient(id));
    }

    @Transactional
    public IngredientResponse createIngredient(IngredientRequest request) {
        validateUniqueCode(request.code(), null);
        var ingredient = new Ingredient();
        ingredient.setCode(request.code());
        ingredient.setName(request.name());
        ingredient.setDescription(request.description());
        return IngredientResponse.from(ingredientRepository.save(ingredient));
    }

    @Transactional
    public IngredientResponse updateIngredient(Long id, IngredientRequest request) {
        var ingredient = findIngredient(id);
        validateUniqueCode(request.code(), id);
        ingredient.setCode(request.code());
        ingredient.setName(request.name());
        ingredient.setDescription(request.description());
        return IngredientResponse.from(ingredientRepository.save(ingredient));
    }

    @Transactional
    public void deleteIngredient(Long id) {
        ingredientRepository.delete(findIngredient(id));
    }

    @Transactional(readOnly = true)
    public List<DrugSummaryResponse> getDrugsByIngredient(Long ingredientId) {
        findIngredient(ingredientId);
        return drugRepository.findDistinctByDrugIngredients_Ingredient_Id(ingredientId).stream()
                .map(DrugSummaryResponse::from)
                .toList();
    }

    private Ingredient findIngredient(Long id) {
        return ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found."));
    }

    private void validateUniqueCode(String code, Long currentId) {
        var existing = ingredientRepository.findByCodeIgnoreCase(code);
        if (existing.isPresent() && (currentId == null || !existing.get().getId().equals(currentId))) {
            throw new IllegalArgumentException("Ingredient code already exists.");
        }
    }
}
