package com.mediai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mediai.entity.DrugInteraction;

public interface DrugInteractionRepository extends JpaRepository<DrugInteraction, Long> {

    List<DrugInteraction> findBySourceDrug_IdOrTargetDrug_IdOrderByCreatedAtDesc(Long sourceDrugId, Long targetDrugId);
}
