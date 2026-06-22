package com.mediai.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.mediai.dto.auditlog.ActivityLogRequest;
import com.mediai.dto.auditlog.ActivityLogResponse;
import com.mediai.entity.ActivityLog;
import com.mediai.entity.ActivityLog.ActionType;
import com.mediai.entity.User;
import com.mediai.exception.ResourceNotFoundException;
import com.mediai.repository.ActivityLogRepository;
import com.mediai.repository.UserRepository;
import com.mediai.security.UserPrincipal;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository, UserRepository userRepository) {
        this.activityLogRepository = activityLogRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ActivityLogResponse logActivity(ActivityLogRequest request, UserPrincipal principal) {
        var user = userRepository.findById(principal.id())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        var activityLog = new ActivityLog();
        activityLog.setUser(user);
        activityLog.setActionType(ActionType.valueOf(request.actionType().toUpperCase()));
        activityLog.setEntityType(request.entityType());
        activityLog.setEntityId(request.entityId());
        activityLog.setDetails(request.details());
        activityLog.setIpAddress(getClientIpAddress());
        activityLog.setUserAgent(getUserAgent());

        return toResponse(activityLogRepository.save(activityLog));
    }

    @Transactional(readOnly = true)
    public Page<ActivityLogResponse> getActivityLogs(Pageable pageable) {
        return activityLogRepository.findAll(pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ActivityLogResponse> getActivityLogsByUser(UUID userId, Pageable pageable) {
        return activityLogRepository.findByUserId(userId, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ActivityLogResponse> getActivityLogsByEntity(String entityType, UUID entityId, Pageable pageable) {
        return activityLogRepository.findByEntityTypeAndEntityId(entityType, entityId, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ActivityLogResponse> getActivityLogsByActionType(String actionType, Pageable pageable) {
        return activityLogRepository.findByActionType(ActionType.valueOf(actionType.toUpperCase()), pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ActivityLogResponse> getActivityLogsByUserAndActionType(UUID userId, String actionType,
            Pageable pageable) {
        return activityLogRepository.findByUserIdAndActionType(userId, ActionType.valueOf(actionType.toUpperCase()),
                pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ActivityLogResponse> getActivityLogsByUserAndEntity(UUID userId, String entityType,
            Pageable pageable) {
        return activityLogRepository.findByUserIdAndEntityType(userId, entityType, pageable)
                .map(this::toResponse);
    }

    private ActivityLogResponse toResponse(ActivityLog log) {
        var createdAtLdt = LocalDateTime.ofInstant(log.getCreatedAt(), ZoneId.systemDefault());
        return new ActivityLogResponse(
                log.getId(),
                log.getUser().getId(),
                log.getUser().getFullName(),
                log.getActionType().toString(),
                log.getEntityType(),
                log.getEntityId(),
                log.getDetails(),
                log.getIpAddress(),
                createdAtLdt);
    }

    private String getClientIpAddress() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes == null) {
                return "UNKNOWN";
            }
            HttpServletRequest request = attributes.getRequest();
            String clientIp = request.getHeader("X-Forwarded-For");
            if (clientIp == null || clientIp.isEmpty()) {
                clientIp = request.getRemoteAddr();
            }
            return clientIp;
        } catch (Exception e) {
            return "UNKNOWN";
        }
    }

    private String getUserAgent() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes == null) {
                return "UNKNOWN";
            }
            return attributes.getRequest().getHeader("User-Agent");
        } catch (Exception e) {
            return "UNKNOWN";
        }
    }
}
