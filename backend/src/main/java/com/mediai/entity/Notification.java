package com.mediai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter
@Setter
public class Notification extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User recipient;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", length = 50)
    private NotificationType type;

    @Column(name = "read_status", columnDefinition = "boolean default false")
    private boolean readStatus = false;

    @Column(name = "read_time")
    private LocalDateTime readTime;

    // TODO: These fields need to be added to database in future migration
    // @Column(name = "read_at")
    // private LocalDateTime readAt;
    
    // @Column(name = "action_url", length = 500)
    // private String actionUrl;

    public enum NotificationType {
        EVALUATION_COMPLETED,
        DRUG_INTERACTION_ALERT,
        PATIENT_UPDATED,
        PRESCRIPTION_REMINDER,
        SYSTEM_ALERT
    }

    public enum NotificationStatus {
        UNREAD,
        READ,
        ARCHIVED
    }
}
