package com.mediai.ai.client;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.mediai.ai.config.AiServiceProperties;
import com.mediai.ai.dto.EvaluationRequestPayload;
import com.mediai.ai.dto.EvaluationResponsePayload;
import com.mediai.ai.dto.ExplainRequestPayload;
import com.mediai.ai.dto.ExplainResponsePayload;

@Component
public class AiServiceClient {

    private final AiServiceProperties properties;
    private final RestClient restClient;

    public AiServiceClient(AiServiceProperties properties) {
        this.properties = properties;
        this.restClient = RestClient.builder()
                .baseUrl(properties.baseUrl())
                .build();
    }

    public EvaluationResponsePayload evaluate(EvaluationRequestPayload payload) {
        return restClient.post()
                .uri(properties.evaluationPath())
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(EvaluationResponsePayload.class);
    }

    public ExplainResponsePayload explain(ExplainRequestPayload payload) {
        return restClient.post()
                .uri(properties.explainPath())
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(ExplainResponsePayload.class);
    }
}
