package com.mediai.dto.notification;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public record NotificationResponse(
        @JsonProperty("id") Long id,
        @JsonProperty("recipientId") Long recipientId,
        @JsonProperty("title") String title,
        @JsonProperty("message") String message,
        @JsonProperty("type") String type,
        @JsonProperty("status") String status,
        @JsonProperty("readAt") LocalDateTime readAt,
        @JsonProperty("sentAt") LocalDateTime sentAt,
        @JsonProperty("relatedEntityType") String relatedEntityType,
        @JsonProperty("relatedEntityId") UUID relatedEntityId,
        @JsonProperty("actionUrl") String actionUrl,
        @JsonProperty("createdAt") LocalDateTime createdAt) {
}
