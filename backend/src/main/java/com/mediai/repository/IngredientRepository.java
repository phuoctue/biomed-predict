package com.mediai.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.mediai.entity.Ingredient;

public interface IngredientRepository extends JpaRepository<Ingredient, Long>, JpaSpecificationExecutor<Ingredient> {

    boolean existsByCodeIgnoreCase(String code);

    Optional<Ingredient> findByCodeIgnoreCase(String code);

    List<Ingredient> findDistinctByDrugIngredients_Drug_Id(Long drugId);
}
