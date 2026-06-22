package com.mediai.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mediai.entity.Bookmark;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, UUID> {
    Page<Bookmark> findByUserId(UUID userId, Pageable pageable);

    Optional<Bookmark> findByUserIdAndDrugId(UUID userId, UUID drugId);

    void deleteByUserIdAndDrugId(UUID userId, UUID drugId);

    boolean existsByUserIdAndDrugId(UUID userId, UUID drugId);
}
