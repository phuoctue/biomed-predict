package com.mediai.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediai.dto.notification.NotificationRequest;
import com.mediai.dto.notification.NotificationResponse;
import com.mediai.entity.Notification;
import com.mediai.entity.Notification.NotificationStatus;
import com.mediai.entity.Notification.NotificationType;
import com.mediai.entity.User;
import com.mediai.exception.ResourceNotFoundException;
import com.mediai.repository.NotificationRepository;
import com.mediai.repository.UserRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public NotificationResponse createNotification(NotificationRequest request) {
        var recipient = userRepository.findById(request.recipientId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        var notification = new Notification();
        notification.setRecipient(recipient);
        notification.setTitle(request.title());
        notification.setMessage(request.message());
        notification.setType(NotificationType.valueOf(request.type().toUpperCase()));
        notification.setStatus(NotificationStatus.UNREAD);
        notification.setSentAt(LocalDateTime.now());
        notification.setRelatedEntityType(request.relatedEntityType());
        notification.setRelatedEntityId(request.relatedEntityId());
        notification.setActionUrl(request.actionUrl());

        return toResponse(notificationRepository.save(notification));
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getNotifications(UUID userId, Pageable pageable) {
        return notificationRepository.findByRecipientId(userId, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getUnreadNotifications(UUID userId, Pageable pageable) {
        return notificationRepository.findByRecipientIdAndStatus(userId, NotificationStatus.UNREAD, pageable)
                .map(this::toResponse);
    }

    @Transactional
    public NotificationResponse markAsRead(UUID notificationId) {
        var notification = findNotification(notificationId);
        notification.setStatus(NotificationStatus.READ);
        notification.setReadAt(LocalDateTime.now());
        return toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public void markAsArchived(UUID notificationId) {
        var notification = findNotification(notificationId);
        notification.setStatus(NotificationStatus.ARCHIVED);
        notificationRepository.save(notification);
    }

    @Transactional
    public void deleteNotification(UUID notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    @Transactional(readOnly = true)
    public Long getUnreadCount(UUID userId) {
        return notificationRepository.countByRecipientIdAndStatus(userId, NotificationStatus.UNREAD);
    }

    private Notification findNotification(UUID id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found."));
    }

    private NotificationResponse toResponse(Notification notification) {
        var createdAtLdt = LocalDateTime.ofInstant(notification.getCreatedAt(), ZoneId.systemDefault());
        return new NotificationResponse(
                notification.getId(),
                notification.getRecipient().getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType().toString(),
                notification.getStatus().toString(),
                notification.getReadAt(),
                notification.getSentAt(),
                notification.getRelatedEntityType(),
                notification.getRelatedEntityId(),
                notification.getActionUrl(),
                createdAtLdt);
    }
}
