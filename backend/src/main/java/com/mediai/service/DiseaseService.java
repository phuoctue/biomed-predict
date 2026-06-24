package com.mediai.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.entity.Disease;
import com.mediai.repository.DiseaseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DiseaseService {

    private final DiseaseRepository diseaseRepository;

    public Disease createDisease(Disease disease) {
        return diseaseRepository.save(disease);
    }

    public Disease getDiseaseById(UUID id) {
        return diseaseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Disease not found"));
    }

    public void deleteDisease(UUID id) {
        Disease disease = getDiseaseById(id);
        diseaseRepository.delete(disease);
    }
}
