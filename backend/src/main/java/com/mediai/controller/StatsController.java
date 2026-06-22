package com.mediai.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import com.mediai.dto.common.ApiResponse;
import com.mediai.service.StatsService;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@PreAuthorize("hasRole('ADMIN')")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/dashboard")
    public ApiResponse<Map<String, Object>> getDashboard() {
        return ApiResponse.ok("Dashboard statistics retrieved.", statsService.getDashboardStats());
    }

    @GetMapping("/users")
    public ApiResponse<Long> getUserCount() {
        return ApiResponse.ok("User count retrieved.", statsService.getUserCount());
    }

    @GetMapping("/patients")
    public ApiResponse<Long> getPatientCount() {
        return ApiResponse.ok("Patient count retrieved.", statsService.getPatientCount());
    }

    @GetMapping("/evaluations")
    public ApiResponse<Long> getEvaluationCount() {
        return ApiResponse.ok("Evaluation count retrieved.", statsService.getEvaluationCount());
    }
}
