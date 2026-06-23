package com.mediai.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mediai.entity.ActivityLog;
import com.mediai.entity.ActivityLog.ActionType;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    Page<ActivityLog> findByUser_Id(Long userId, Pageable pageable);

    Page<ActivityLog> findByEntityTypeAndEntityId(String entityType, UUID entityId, Pageable pageable);

    Page<ActivityLog> findByActionType(ActionType actionType, Pageable pageable);

    Page<ActivityLog> findByUser_IdAndActionType(Long userId, ActionType actionType, Pageable pageable);

    Page<ActivityLog> findByUser_IdAndEntityType(Long userId, String entityType, Pageable pageable);
}
