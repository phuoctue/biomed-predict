package com.mediai.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.entity.Prescription;
import com.mediai.repository.PrescriptionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    public Prescription createPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    public Prescription getPrescriptionById(UUID id) {
        return prescriptionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Prescription not found"));
    }

    public Prescription updatePrescriptionStatus(UUID id, String status) {
        Prescription prescription = getPrescriptionById(id);
        prescription.setStatus(status);
        return prescriptionRepository.save(prescription);
    }

    public void deletePrescription(UUID id) {
        Prescription prescription = getPrescriptionById(id);
        prescriptionRepository.delete(prescription);
    }
}
