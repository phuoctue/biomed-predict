package com.mediai.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    private final List<String> allowedOrigins;
    private final List<String> allowedMethods;
    private final List<String> allowedHeaders;
    private final List<String> exposedHeaders;
    private final long maxAge;
    private final boolean allowCredentials;

    public CorsConfig(
            @Value("${app.cors.allowed-origins:http://localhost:5173,http://127.0.0.1:5173}") String allowedOrigins,
            @Value("${app.cors.allowed-methods:GET,POST,PUT,PATCH,DELETE,OPTIONS}") String allowedMethods,
            @Value("${app.cors.allowed-headers:Authorization,Content-Type,Accept,Origin}") String allowedHeaders,
            @Value("${app.cors.exposed-headers:Authorization}") String exposedHeaders,
            @Value("${app.cors.max-age:3600}") long maxAge,
            @Value("${app.cors.allow-credentials:true}") boolean allowCredentials) {
        this.allowedOrigins = splitCsv(allowedOrigins);
        this.allowedMethods = splitCsv(allowedMethods);
        this.allowedHeaders = splitCsv(allowedHeaders);
        this.exposedHeaders = splitCsv(exposedHeaders);
        this.maxAge = maxAge;
        this.allowCredentials = allowCredentials;
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        var configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(allowedMethods);
        configuration.setAllowedHeaders(allowedHeaders);
        configuration.setExposedHeaders(exposedHeaders);
        configuration.setAllowCredentials(allowCredentials);
        configuration.setMaxAge(maxAge);

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private static List<String> splitCsv(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }
}
