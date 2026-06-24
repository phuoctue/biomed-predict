package com.mediai.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.mediai.entity.Drug;

public interface DrugRepository extends JpaRepository<Drug, UUID>, JpaSpecificationExecutor<Drug> {

    boolean existsByCodeIgnoreCase(String code);

    Optional<Drug> findByCodeIgnoreCase(String code);

    List<Drug> findDistinctByDrugIngredients_Ingredient_Id(UUID ingredientId);
}
