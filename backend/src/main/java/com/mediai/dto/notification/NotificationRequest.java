package com.mediai.dto.notification;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;

public record NotificationRequest(
        @JsonProperty("title") @NotBlank(message = "Title is required") String title,
        @JsonProperty("message") @NotBlank(message = "Message is required") String message,
        @JsonProperty("type") @NotBlank(message = "Type is required") String type,
        @JsonProperty("recipientId") Long recipientId,
        @JsonProperty("relatedEntityType") String relatedEntityType,
        @JsonProperty("relatedEntityId") UUID relatedEntityId,
        @JsonProperty("actionUrl") String actionUrl) {
}
