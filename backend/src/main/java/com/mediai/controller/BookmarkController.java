package com.mediai.controller;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mediai.dto.common.ApiResponse;
import com.mediai.dto.common.PageResponse;
import com.mediai.dto.drug.DrugSummaryResponse;
import com.mediai.security.UserPrincipal;
import com.mediai.service.BookmarkService;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @PostMapping("/drugs/{drugId}")
    public ResponseEntity<ApiResponse<DrugSummaryResponse>> addBookmark(
            @PathVariable UUID drugId,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Drug bookmarked successfully.",
                        bookmarkService.addBookmark(principal.id(), drugId)));
    }

    @GetMapping
    public PageResponse<DrugSummaryResponse> getBookmarks(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 20) Pageable pageable) {
        var page = bookmarkService.getBookmarks(principal.id(), pageable);
        return PageResponse.ok(
                "Bookmarks retrieved successfully.",
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast());
    }

    @GetMapping("/drugs/{drugId}/is-bookmarked")
    public ApiResponse<Boolean> isBookmarked(
            @PathVariable UUID drugId,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("Bookmark status retrieved.",
                bookmarkService.isBookmarked(principal.id(), drugId));
    }

    @DeleteMapping("/drugs/{drugId}")
    public ApiResponse<String> removeBookmark(
            @PathVariable UUID drugId,
            @AuthenticationPrincipal UserPrincipal principal) {
        bookmarkService.removeBookmark(principal.id(), drugId);
        return ApiResponse.ok("Bookmark removed successfully.", "removed");
    }
}
