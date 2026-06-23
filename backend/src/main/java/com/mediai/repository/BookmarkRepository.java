package com.mediai.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mediai.entity.Bookmark;

// Bookmark has its own UUID @Id (not from BaseEntity), so JpaRepository<Bookmark, UUID> is correct.
// However user.id and drug.id are Long (from BaseEntity).
@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, UUID> {

    Page<Bookmark> findByUserId(Long userId, Pageable pageable);

    Optional<Bookmark> findByUserIdAndDrugId(Long userId, Long drugId);

    void deleteByUserIdAndDrugId(Long userId, Long drugId);

    boolean existsByUserIdAndDrugId(Long userId, Long drugId);
}
