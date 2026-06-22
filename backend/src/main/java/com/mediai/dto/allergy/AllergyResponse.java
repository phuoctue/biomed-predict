package com.mediai.dto.allergy;

import java.time.Instant;
import java.util.UUID;

import com.mediai.entity.PatientAllergy;

public record AllergyResponse(
    UUID id,
    UUID patientId,
    String patientName,
    UUID drugId,
    String drugName,
    UUID ingredientId,
    String ingredientName,
    String severity,
    String reaction,
    String notes,
    Instant createdAt
) {
    public static AllergyResponse from(PatientAllergy a) {
        return new AllergyResponse(
            a.getId(),
            a.getPatient() != null ? a.getPatient().getId() : null,
            a.getPatient() != null ? a.getPatient().getFullName() : null,
            a.getDrug() != null ? a.getDrug().getId() : null,
            a.getDrug() != null ? a.getDrug().getName() : null,
            a.getIngredient() != null ? a.getIngredient().getId() : null,
            a.getIngredient() != null ? a.getIngredient().getName() : null,
            a.getSeverity(),
            a.getReaction(),
            a.getNotes(),
            a.getCreatedAt()
        );
    }
}
