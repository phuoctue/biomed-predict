-- V8: Create the `patient_drugs` table used by PatientDrug entity.
-- Tracks which drugs are currently prescribed/active for each patient.

CREATE TABLE patient_drugs (
    id          BIGSERIAL PRIMARY KEY,
    patient_id  BIGINT NOT NULL REFERENCES patients(id),
    drug_id     BIGINT NOT NULL REFERENCES drugs(id),
    dosage      VARCHAR(255),
    frequency   VARCHAR(255),
    indication  TEXT,
    status      VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    status_text VARCHAR(255),
    start_date  DATE,
    end_date    DATE,
    created_at  TIMESTAMP NOT NULL,
    updated_at  TIMESTAMP NOT NULL,
    created_by  BIGINT,
    updated_by  BIGINT,
    version     BIGINT,
    deleted     BOOLEAN NOT NULL DEFAULT false,
    deleted_at  TIMESTAMP
);

CREATE INDEX idx_patient_drugs_patient_id ON patient_drugs(patient_id);
CREATE INDEX idx_patient_drugs_drug_id    ON patient_drugs(drug_id);
CREATE INDEX idx_patient_drugs_status     ON patient_drugs(status);
