package com.mediai.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.dto.drug.DrugInteractionRequest;
import com.mediai.dto.drug.DrugInteractionResponse;
import com.mediai.entity.DrugInteraction;
import com.mediai.exception.ResourceNotFoundException;
import com.mediai.repository.DrugInteractionRepository;
import com.mediai.repository.DrugRepository;

@Service
public class DrugInteractionService {

    private final DrugInteractionRepository drugInteractionRepository;
    private final DrugRepository drugRepository;

    public DrugInteractionService(DrugInteractionRepository drugInteractionRepository,
            DrugRepository drugRepository) {
        this.drugInteractionRepository = drugInteractionRepository;
        this.drugRepository = drugRepository;
    }

    @Transactional(readOnly = true)
    public List<DrugInteractionResponse> listAll(Long drugId) {
        if (drugId == null) {
            return drugInteractionRepository.findAll().stream()
                    .map(DrugInteractionResponse::from).toList();
        }
        return drugInteractionRepository
                .findBySourceDrug_IdOrTargetDrug_IdOrderByCreatedAtDesc(drugId, drugId).stream()
                .map(DrugInteractionResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public DrugInteractionResponse getInteraction(Long id) {
        return DrugInteractionResponse.from(findInteraction(id));
    }

    @Transactional
    public DrugInteractionResponse createInteraction(DrugInteractionRequest request) {
        var interaction = new DrugInteraction();
        applyRequest(interaction, request);
        return DrugInteractionResponse.from(drugInteractionRepository.save(interaction));
    }

    @Transactional
    public DrugInteractionResponse updateInteraction(Long id, DrugInteractionRequest request) {
        var interaction = findInteraction(id);
        applyRequest(interaction, request);
        return DrugInteractionResponse.from(drugInteractionRepository.save(interaction));
    }

    @Transactional
    public void deleteInteraction(Long id) {
        drugInteractionRepository.delete(findInteraction(id));
    }

    private DrugInteraction findInteraction(Long id) {
        return drugInteractionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drug interaction not found."));
    }

    private void applyRequest(DrugInteraction interaction, DrugInteractionRequest request) {
        if (request.sourceDrugId().equals(request.targetDrugId())) {
            throw new IllegalArgumentException("Source drug and target drug must be different.");
        }
        interaction.setSourceDrug(drugRepository.findById(request.sourceDrugId())
                .orElseThrow(() -> new ResourceNotFoundException("Source drug not found.")));
        interaction.setTargetDrug(drugRepository.findById(request.targetDrugId())
                .orElseThrow(() -> new ResourceNotFoundException("Target drug not found.")));
        interaction.setSeverity(request.severity());
        interaction.setDescription(request.description());
        interaction.setRecommendation(request.recommendation());
    }
}
