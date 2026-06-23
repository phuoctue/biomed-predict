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
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByRecipient_Id(Long recipientId, Pageable pageable);

    Page<Notification> findByRecipient_IdAndStatus(Long recipientId, NotificationStatus status, Pageable pageable);

    List<Notification> findByRecipient_IdAndStatusOrderByCreatedAtDesc(Long recipientId, NotificationStatus status);

    Long countByRecipient_IdAndStatus(Long recipientId, NotificationStatus status);
}
