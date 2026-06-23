package com.mediai.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.dto.medication.MedicationRequest;
import com.mediai.dto.medication.MedicationResponse;
import com.mediai.entity.PatientDrug;
import com.mediai.exception.ResourceNotFoundException;
import com.mediai.repository.DrugRepository;
import com.mediai.repository.PatientDrugRepository;
import com.mediai.repository.PatientRepository;

@Service
public class MedicationService {

    private final PatientDrugRepository patientDrugRepository;
    private final PatientRepository patientRepository;
    private final DrugRepository drugRepository;

    public MedicationService(PatientDrugRepository patientDrugRepository,
            PatientRepository patientRepository,
            DrugRepository drugRepository) {
        this.patientDrugRepository = patientDrugRepository;
        this.patientRepository = patientRepository;
        this.drugRepository = drugRepository;
    }

    @Transactional(readOnly = true)
    public List<MedicationResponse> listMedications(Long patientId) {
        if (patientId != null) {
            return patientDrugRepository.findByPatient_Id(patientId).stream()
                    .map(MedicationResponse::from).toList();
        }
        return patientDrugRepository.findAll().stream().map(MedicationResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public MedicationResponse getMedication(UUID id) {
        return MedicationResponse.from(findMedication(id));
    }

    @Transactional
    public MedicationResponse createMedication(MedicationRequest request) {
        var pd = new PatientDrug();
        pd.setPatient(patientRepository.findById(request.patientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found.")));
        pd.setDrug(drugRepository.findById(request.drugId())
                .orElseThrow(() -> new ResourceNotFoundException("Drug not found.")));
        pd.setDosage(request.dosage());
        pd.setFrequency(request.frequency());
        pd.setIndication(request.indication());
        pd.setStatus(request.status());
        pd.setStatusText(request.statusText());
        pd.setStartDate(request.startDate());
        pd.setEndDate(request.endDate());
        return MedicationResponse.from(patientDrugRepository.save(pd));
    }

    @Transactional
    public MedicationResponse updateMedication(UUID id, MedicationRequest request) {
        var pd = findMedication(id);
        pd.setDosage(request.dosage());
        pd.setFrequency(request.frequency());
        pd.setIndication(request.indication());
        pd.setStatus(request.status());
        pd.setStatusText(request.statusText());
        pd.setStartDate(request.startDate());
        pd.setEndDate(request.endDate());
        return MedicationResponse.from(patientDrugRepository.save(pd));
    }

    @Transactional
    public void deleteMedication(UUID id) {
        patientDrugRepository.delete(findMedication(id));
    }

    private PatientDrug findMedication(UUID id) {
        return patientDrugRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medication not found."));
    }
}
