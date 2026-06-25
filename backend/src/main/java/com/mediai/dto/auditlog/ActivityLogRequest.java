package com.mediai.dto.auditlog;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ActivityLogRequest(
        @JsonProperty("actionType") String actionType,
        @JsonProperty("entityType") String entityType,
        @JsonProperty("entityId") UUID entityId,
        @JsonProperty("details") String details) {
}
