package com.mediai.controller;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mediai.dto.auditlog.ActivityLogRequest;
import com.mediai.dto.auditlog.ActivityLogResponse;
import com.mediai.dto.common.ApiResponse;
import com.mediai.dto.common.PageResponse;
import com.mediai.security.UserPrincipal;
import com.mediai.service.ActivityLogService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/activity-logs")
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    public ActivityLogController(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ActivityLogResponse>> logActivity(
            @Valid @RequestBody ActivityLogRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Activity logged successfully.",
                        activityLogService.logActivity(request, principal)));
    }

    @GetMapping
    public PageResponse<ActivityLogResponse> getActivityLogs(
            @PageableDefault(size = 20) Pageable pageable) {
        var page = activityLogService.getActivityLogs(pageable);
        return PageResponse.ok("Activity logs retrieved successfully.",
                page.getContent(), page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages(), page.isFirst(), page.isLast());
    }

    @GetMapping("/by-user")
    public PageResponse<ActivityLogResponse> getActivityLogsByUser(
            @RequestParam Long userId,
            @PageableDefault(size = 20) Pageable pageable) {
        var page = activityLogService.getActivityLogsByUser(userId, pageable);
        return PageResponse.ok("Activity logs retrieved successfully.",
                page.getContent(), page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages(), page.isFirst(), page.isLast());
    }

    @GetMapping("/by-entity")
    public PageResponse<ActivityLogResponse> getActivityLogsByEntity(
            @RequestParam String entityType,
            @RequestParam UUID entityId,
            @PageableDefault(size = 20) Pageable pageable) {
        var page = activityLogService.getActivityLogsByEntity(entityType, entityId, pageable);
        return PageResponse.ok("Activity logs retrieved successfully.",
                page.getContent(), page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages(), page.isFirst(), page.isLast());
    }

    @GetMapping("/by-action")
    public PageResponse<ActivityLogResponse> getActivityLogsByActionType(
            @RequestParam String actionType,
            @PageableDefault(size = 20) Pageable pageable) {
        var page = activityLogService.getActivityLogsByActionType(actionType, pageable);
        return PageResponse.ok("Activity logs retrieved successfully.",
                page.getContent(), page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages(), page.isFirst(), page.isLast());
    }

    @GetMapping("/by-user-and-action")
    public PageResponse<ActivityLogResponse> getActivityLogsByUserAndActionType(
            @RequestParam Long userId,
            @RequestParam String actionType,
            @PageableDefault(size = 20) Pageable pageable) {
        var page = activityLogService.getActivityLogsByUserAndActionType(userId, actionType, pageable);
        return PageResponse.ok("Activity logs retrieved successfully.",
                page.getContent(), page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages(), page.isFirst(), page.isLast());
    }

    @GetMapping("/by-user-and-entity")
    public PageResponse<ActivityLogResponse> getActivityLogsByUserAndEntity(
            @RequestParam Long userId,
            @RequestParam String entityType,
            @PageableDefault(size = 20) Pageable pageable) {
        var page = activityLogService.getActivityLogsByUserAndEntity(userId, entityType, pageable);
        return PageResponse.ok("Activity logs retrieved successfully.",
                page.getContent(), page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages(), page.isFirst(), page.isLast());
    }
}
