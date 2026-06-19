package com.mediai.exception;

import java.util.List;

public record ErrorResponse(
        boolean success,
        String errorCode,
        String message,
        List<String> errors) {
}
