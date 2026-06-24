package com.mediai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;

/**
 * Maps to the `audit_logs` table (from schema.sql).
 * Column mapping aligned with actual DB schema.
 */
@Entity
@Table(name = "audit_logs")
public class ActivityLog extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // DB column is `action` (plain text, no enum constraint)
    @Column(name = "action", nullable = false, length = 255)
    private String actionType;

    @Column(name = "entity_type", length = 255)
    private String entityType;

    @Column(name = "entity_id")
    private UUID entityId;

    // Use new_data as the "details" storage field
    @Column(name = "new_data", columnDefinition = "text")
    private String details;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", columnDefinition = "text")
    private String userAgent;

    @Column(name = "result", length = 50)
    private String result;

    // Legacy ActionType enum kept for service compatibility
    public enum ActionType {
        CREATE, READ, UPDATE, DELETE, EXPORT, IMPORT, AUTHENTICATE, AUTHORIZE_FAILED
    }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }

    // Accept enum from service layer, store as string
    public void setActionType(ActionType actionType) {
        this.actionType = actionType == null ? null : actionType.name();
    }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public UUID getEntityId() { return entityId; }
    public void setEntityId(UUID entityId) { this.entityId = entityId; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
}
