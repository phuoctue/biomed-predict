package com.mediai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mediai.entity.Contraindication;

@Repository
public interface ContraindicationRepository extends JpaRepository<Contraindication, Long> {
}
