package com.mediai.service;

import org.springframework.stereotype.Service;

@Service
public class HealthService {

    public String message() {
        return "MediAI backend is running";
    }
}

