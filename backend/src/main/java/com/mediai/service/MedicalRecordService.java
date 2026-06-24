package com.mediai.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.entity.MedicalRecord;
import com.mediai.repository.MedicalRecordRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;

    public MedicalRecord createMedicalRecord(MedicalRecord medicalRecord) {
        return medicalRecordRepository.save(medicalRecord);
    }

    public MedicalRecord getMedicalRecordById(UUID id) {
        return medicalRecordRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Medical record not found"));
    }

    public MedicalRecord updateMedicalRecord(UUID id, MedicalRecord recordDetails) {
        MedicalRecord record = getMedicalRecordById(id);
        record.setSymptoms(recordDetails.getSymptoms());
        record.setDiagnosis(recordDetails.getDiagnosis());
        record.setClinicalNote(recordDetails.getClinicalNote());
        record.setStatus(recordDetails.getStatus());
        return medicalRecordRepository.save(record);
    }

    public void deleteMedicalRecord(UUID id) {
        MedicalRecord record = getMedicalRecordById(id);
        medicalRecordRepository.delete(record);
    }
}
