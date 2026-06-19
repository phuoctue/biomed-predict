package com.mediai.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mediai.entity.DrugInteraction;

public interface DrugInteractionRepository extends JpaRepository<DrugInteraction, UUID> {

    List<DrugInteraction> findBySourceDrug_IdOrTargetDrug_IdOrderByCreatedAtDesc(UUID sourceDrugId, UUID targetDrugId);
}
