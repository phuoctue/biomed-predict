package com.mediai.ai.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ai.service")
public record AiServiceProperties(
        String baseUrl,
        String evaluationPath,
        String explainPath,
        String modelName,
        String modelVersion) {
}
