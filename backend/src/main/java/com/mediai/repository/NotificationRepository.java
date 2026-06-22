package com.mediai.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mediai.entity.Notification;
import com.mediai.entity.Notification.NotificationStatus;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    Page<Notification> findByRecipientId(UUID recipientId, Pageable pageable);

    Page<Notification> findByRecipientIdAndStatus(UUID recipientId, NotificationStatus status, Pageable pageable);

    List<Notification> findByRecipientIdAndStatusOrderByCreatedAtDesc(UUID recipientId, NotificationStatus status);

    Long countByRecipientIdAndStatus(UUID recipientId, NotificationStatus status);
}
