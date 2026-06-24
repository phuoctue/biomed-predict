package com.mediai.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.entity.LabResult;
import com.mediai.repository.LabResultRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LabResultService {

    private final LabResultRepository labResultRepository;

    public LabResult createLabResult(LabResult labResult) {
        return labResultRepository.save(labResult);
    }

    public LabResult getLabResultById(UUID id) {
        return labResultRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Lab result not found"));
    }

    public void deleteLabResult(UUID id) {
        LabResult labResult = getLabResultById(id);
        labResultRepository.delete(labResult);
    }
}
