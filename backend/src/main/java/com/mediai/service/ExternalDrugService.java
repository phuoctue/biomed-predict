package com.mediai.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.mediai.dto.drug.ExternalDrugSearchRequest;
import com.mediai.dto.drug.ExternalDrugSearchResponse;

@Service
public class ExternalDrugService {

    private final RestClient restClient;

    public ExternalDrugService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.fda.gov")
                .build();
    }

    public List<ExternalDrugSearchResponse> searchDrugs(ExternalDrugSearchRequest request) {
        String query = buildQuery(request);
        String url = "/drug/label.json?search=" + query + "&limit=" + (request.limit() != null ? request.limit() : 10);
        
        try {
            OpenFDAResponse response = restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(OpenFDAResponse.class);
            
            if (response != null && response.results() != null) {
                return response.results().stream()
                        .map(this::mapToExternalDrugSearchResponse)
                        .toList();
            }
        } catch (Exception e) {
            // Log error and return empty list
            System.err.println("Error searching external drugs: " + e.getMessage());
        }
        
        return List.of();
    }

    public Optional<ExternalDrugSearchResponse> getDrugDetails(String splId) {
        try {
            String url = "/drug/label.json?search=id:" + splId + "&limit=1";
            OpenFDAResponse response = restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(OpenFDAResponse.class);
            
            if (response != null && response.results() != null && !response.results().isEmpty()) {
                return Optional.of(mapToExternalDrugSearchResponse(response.results().get(0)));
            }
        } catch (Exception e) {
            System.err.println("Error getting drug details: " + e.getMessage());
        }
        
        return Optional.empty();
    }

    private String buildQuery(ExternalDrugSearchRequest request) {
        StringBuilder query = new StringBuilder();
        
        if (request.keyword() != null && !request.keyword().isBlank()) {
            query.append("(openfda.brand_name:\"").append(request.keyword()).append("\"")
                   .append("+OR+openfda.generic_name:\"").append(request.keyword()).append("\")");
        }
        
        if (request.manufacturer() != null && !request.manufacturer().isBlank()) {
            if (!query.isEmpty()) {
                query.append("+AND+");
            }
            query.append("openfda.manufacturer_name:\"").append(request.manufacturer()).append("\"");
        }
        
        return query.toString();
    }

    private ExternalDrugSearchResponse mapToExternalDrugSearchResponse(OpenFDADrug drug) {
        return new ExternalDrugSearchResponse(
                getSplId(drug),
                getBrandName(drug),
                getGenericName(drug),
                getManufacturerName(drug),
                getDosageForm(drug),
                getActiveIngredients(drug)
        );
    }

    private String getSplId(OpenFDADrug drug) {
        if (drug.id() != null && !drug.id().isEmpty()) {
            return drug.id().get(0);
        }
        return "";
    }

    private String getBrandName(OpenFDADrug drug) {
        if (drug.openfda() != null && drug.openfda().brand_name() != null && !drug.openfda().brand_name().isEmpty()) {
            return drug.openfda().brand_name().get(0);
        }
        return "Unknown";
    }

    private String getGenericName(OpenFDADrug drug) {
        if (drug.openfda() != null && drug.openfda().generic_name() != null && !drug.openfda().generic_name().isEmpty()) {
            return drug.openfda().generic_name().get(0);
        }
        return "Unknown";
    }

    private String getManufacturerName(OpenFDADrug drug) {
        if (drug.openfda() != null && drug.openfda().manufacturer_name() != null && !drug.openfda().manufacturer_name().isEmpty()) {
            return drug.openfda().manufacturer_name().get(0);
        }
        return "Unknown";
    }

    private String getDosageForm(OpenFDADrug drug) {
        if (drug.dosage_form() != null && !drug.dosage_form().isEmpty()) {
            return String.join(", ", drug.dosage_form());
        }
        return "Unknown";
    }

    private String getActiveIngredients(OpenFDADrug drug) {
        if (drug.active_ingredient() != null && !drug.active_ingredient().isEmpty()) {
            return String.join(", ", drug.active_ingredient());
        }
        return "Unknown";
    }

    // Inner classes for API response mapping
    private record OpenFDAResponse(List<OpenFDADrug> results) {}
    private record OpenFDADrug(
            List<String> id,
            List<String> dosage_form,
            List<String> active_ingredient,
            OpenFDAData openfda) {}
    private record OpenFDAData(
            List<String> brand_name,
            List<String> generic_name,
            List<String> manufacturer_name) {}
}