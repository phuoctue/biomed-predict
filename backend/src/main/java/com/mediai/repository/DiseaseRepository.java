package com.mediai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mediai.entity.Disease;

@Repository
public interface DiseaseRepository extends JpaRepository<Disease, Long> {
}
