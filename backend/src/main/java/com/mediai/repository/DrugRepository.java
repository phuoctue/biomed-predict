package com.mediai.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.mediai.entity.Drug;

public interface DrugRepository extends JpaRepository<Drug, UUID>, JpaSpecificationExecutor<Drug> {

    boolean existsByCodeIgnoreCase(String code);

    java.util.Optional<Drug> findByCodeIgnoreCase(String code);

    List<Drug> findDistinctByDrugIngredients_Ingredient_Id(UUID ingredientId);
}
