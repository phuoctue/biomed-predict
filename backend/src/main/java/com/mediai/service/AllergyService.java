package com.mediai.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.dto.allergy.AllergyRequest;
import com.mediai.dto.allergy.AllergyResponse;
import com.mediai.entity.PatientAllergy;
import com.mediai.exception.ResourceNotFoundException;
import com.mediai.repository.DrugRepository;
import com.mediai.repository.IngredientRepository;
import com.mediai.repository.PatientAllergyRepository;
import com.mediai.repository.PatientRepository;

@Service
public class AllergyService {

    private final PatientAllergyRepository allergyRepository;
    private final PatientRepository patientRepository;
    private final DrugRepository drugRepository;
    private final IngredientRepository ingredientRepository;

    public AllergyService(PatientAllergyRepository allergyRepository,
            PatientRepository patientRepository,
            DrugRepository drugRepository,
            IngredientRepository ingredientRepository) {
        this.allergyRepository = allergyRepository;
        this.patientRepository = patientRepository;
        this.drugRepository = drugRepository;
        this.ingredientRepository = ingredientRepository;
    }

    @Transactional(readOnly = true)
    public List<AllergyResponse> listAllergies(UUID patientId) {
        if (patientId != null) {
            return allergyRepository.findByPatient_Id(patientId).stream()
                    .map(AllergyResponse::from).toList();
        }
        return allergyRepository.findAll().stream().map(AllergyResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public AllergyResponse getAllergy(UUID id) {
        return AllergyResponse.from(findAllergy(id));
    }

    @Transactional
    public AllergyResponse createAllergy(AllergyRequest request) {
        var allergy = new PatientAllergy();
        allergy.setPatient(patientRepository.findById(request.patientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found.")));
        if (request.drugId() != null) {
            allergy.setDrug(drugRepository.findById(request.drugId())
                    .orElseThrow(() -> new ResourceNotFoundException("Drug not found.")));
        }
        if (request.ingredientId() != null) {
            allergy.setIngredient(ingredientRepository.findById(request.ingredientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found.")));
        }
        allergy.setSeverity(request.severity());
        allergy.setReaction(request.reaction());
        allergy.setNotes(request.notes());
        return AllergyResponse.from(allergyRepository.save(allergy));
    }

    @Transactional
    public AllergyResponse updateAllergy(UUID id, AllergyRequest request) {
        var allergy = findAllergy(id);
        allergy.setSeverity(request.severity());
        allergy.setReaction(request.reaction());
        allergy.setNotes(request.notes());
        return AllergyResponse.from(allergyRepository.save(allergy));
    }

    @Transactional
    public void deleteAllergy(UUID id) {
        allergyRepository.delete(findAllergy(id));
    }

    private PatientAllergy findAllergy(UUID id) {
        return allergyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Allergy not found."));
    }
}
