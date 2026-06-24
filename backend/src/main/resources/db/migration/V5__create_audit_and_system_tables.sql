CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    token TEXT NOT NULL,
    expired_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    entity_name VARCHAR(255),
    entity_id BIGINT,
    ip_address VARCHAR(45),
    request_method VARCHAR(10),
    request_uri VARCHAR(500),
    execution_time_ms BIGINT,
    status VARCHAR(50),
    detail TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(255),
    message TEXT,
    notification_type VARCHAR(50),
    read_status BOOLEAN DEFAULT false,
    read_time TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE TABLE drug_interactions (
    id BIGSERIAL PRIMARY KEY,
    drug_a_id BIGINT NOT NULL REFERENCES drugs(id),
    drug_b_id BIGINT NOT NULL REFERENCES drugs(id),
    severity VARCHAR(50),
    description TEXT,
    recommendation TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP,
    CONSTRAINT check_different_drugs CHECK (drug_a_id <> drug_b_id)
);

CREATE TABLE treatment_guidelines (
    id BIGSERIAL PRIMARY KEY,
    disease_id BIGINT REFERENCES diseases(id),
    guideline TEXT,
    reference_source VARCHAR(255),
    version VARCHAR(50),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version_num BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE TABLE patient_allergies (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(id),
    drug_id BIGINT REFERENCES drugs(id),
    ingredient_id BIGINT REFERENCES ingredients(id),
    severity VARCHAR(50),
    reaction TEXT,
    notes TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_refresh_token_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_audit_log_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_log_action ON audit_logs(action);
CREATE INDEX idx_audit_log_entity_name ON audit_logs(entity_name);
CREATE INDEX idx_audit_log_created_at ON audit_logs(created_at);
CREATE INDEX idx_notification_user_id ON notifications(user_id);
CREATE INDEX idx_drug_interaction_drug_a_id ON drug_interactions(drug_a_id);
CREATE INDEX idx_drug_interaction_drug_b_id ON drug_interactions(drug_b_id);
CREATE INDEX idx_patient_allergy_patient_id ON patient_allergies(patient_id);
