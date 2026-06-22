package com.mediai.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UpdateProfileRequest(
        @JsonProperty("fullName") String fullName,
        @JsonProperty("department") String department) {
}
