package com.mediai.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mediai.dto.common.ApiResponse;
import com.mediai.dto.common.PageResponse;
import com.mediai.dto.notification.NotificationRequest;
import com.mediai.dto.notification.NotificationResponse;
import com.mediai.security.UserPrincipal;
import com.mediai.service.NotificationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NotificationResponse>> createNotification(
            @Valid @RequestBody NotificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Notification created successfully.",
                        notificationService.createNotification(request)));
    }

    @GetMapping
    public PageResponse<NotificationResponse> getNotifications(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 20) Pageable pageable) {
        var page = notificationService.getNotifications(principal.id(), pageable);
        return PageResponse.ok(
                "Notifications retrieved successfully.",
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast());
    }

    @GetMapping("/unread")
    public PageResponse<NotificationResponse> getUnreadNotifications(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 20) Pageable pageable) {
        var page = notificationService.getUnreadNotifications(principal.id(), pageable);
        return PageResponse.ok(
                "Unread notifications retrieved successfully.",
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast());
    }

    @GetMapping("/unread-count")
    public ApiResponse<Long> getUnreadCount(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("Unread count retrieved successfully.",
                notificationService.getUnreadCount(principal.id()));
    }

    @PutMapping("/{id}/read")
    public ApiResponse<NotificationResponse> markAsRead(@PathVariable Long id) {
        return ApiResponse.ok("Notification marked as read.", notificationService.markAsRead(id));
    }

    @PutMapping("/{id}/archive")
    public ApiResponse<String> markAsArchived(@PathVariable Long id) {
        notificationService.markAsArchived(id);
        return ApiResponse.ok("Notification archived successfully.", "archived");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ApiResponse.ok("Notification deleted successfully.", "deleted");
    }
}
