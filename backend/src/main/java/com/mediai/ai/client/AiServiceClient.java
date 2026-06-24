package com.mediai.ai.client;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.mediai.ai.config.AiServiceProperties;
import com.mediai.ai.dto.EvaluationRequestPayload;
import com.mediai.ai.dto.EvaluationResponsePayload;
import com.mediai.ai.dto.ExplainRequestPayload;
import com.mediai.ai.dto.ExplainResponsePayload;

@Component
public class AiServiceClient {

    private final AiServiceProperties properties;
    private final RestTemplate restTemplate;

    public AiServiceClient(AiServiceProperties properties) {
        this.properties = properties;
        this.restTemplate = new RestTemplate();
    }

    public EvaluationResponsePayload evaluate(EvaluationRequestPayload payload) {
        if (payload == null) {
            throw new IllegalArgumentException("Evaluation payload cannot be null");
        }
        
        try {
            String url = properties.baseUrl() + properties.evaluationPath();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<EvaluationRequestPayload> request = new HttpEntity<>(payload, headers);
            
            System.out.println("[AiServiceClient] POST " + url);
            System.out.println("[AiServiceClient] Payload: " + payload);
            
            ResponseEntity<EvaluationResponsePayload> response = restTemplate.postForEntity(
                url, 
                request, 
                EvaluationResponsePayload.class
            );
            
            System.out.println("[AiServiceClient] Response status: " + response.getStatusCode());
            return response.getBody();
            
        } catch (Exception e) {
            System.err.println("[AiServiceClient] Error calling AI service: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to call AI service: " + e.getMessage(), e);
        }
    }

    public ExplainResponsePayload explain(ExplainRequestPayload payload) {
        String url = properties.baseUrl() + properties.explainPath();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<ExplainRequestPayload> request = new HttpEntity<>(payload, headers);
        
        ResponseEntity<ExplainResponsePayload> response = restTemplate.postForEntity(
            url, 
            request, 
            ExplainResponsePayload.class
        );
        
        return response.getBody();
    }
}
