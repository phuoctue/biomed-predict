package com.mediai.dto.auditlog;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ActivityLogResponse(
        @JsonProperty("id") Long id,
        @JsonProperty("userId") Long userId,
        @JsonProperty("userName") String userName,
        @JsonProperty("actionType") String actionType,
        @JsonProperty("entityType") String entityType,
        @JsonProperty("entityId") UUID entityId,
        @JsonProperty("details") String details,
        @JsonProperty("ipAddress") String ipAddress,
        @JsonProperty("createdAt") LocalDateTime createdAt) {
}
