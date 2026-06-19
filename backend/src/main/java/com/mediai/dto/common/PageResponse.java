package com.mediai.dto.common;

import java.time.Instant;
import java.util.List;

public record PageResponse<T>(
        boolean success,
        String message,
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last,
        Instant timestamp) {

    public static <T> PageResponse<T> ok(String message, List<T> content, int page, int size, long totalElements,
            int totalPages, boolean first, boolean last) {
        return new PageResponse<>(true, message, content, page, size, totalElements, totalPages, first, last, Instant.now());
    }
}
