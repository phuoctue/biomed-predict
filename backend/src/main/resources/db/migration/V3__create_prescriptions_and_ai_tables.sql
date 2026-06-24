CREATE TABLE prescriptions (
    id BIGSERIAL PRIMARY KEY,
    prescription_code VARCHAR(50) UNIQUE,
    medical_record_id BIGINT NOT NULL REFERENCES medical_records(id),
    doctor_id BIGINT NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'DRAFT',
    note TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE TABLE prescription_items (
    id BIGSERIAL PRIMARY KEY,
    prescription_id BIGINT NOT NULL REFERENCES prescriptions(id),
    drug_id BIGINT NOT NULL REFERENCES drugs(id),
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration VARCHAR(100),
    quantity INTEGER,
    route VARCHAR(50),
    instruction TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP,
    UNIQUE(prescription_id, drug_id)
);

CREATE TABLE ai_evaluations (
    id BIGSERIAL PRIMARY KEY,
    prescription_id BIGINT NOT NULL REFERENCES prescriptions(id),
    evaluation_no INTEGER,
    model_provider VARCHAR(50),
    model_name VARCHAR(100),
    model_version VARCHAR(50),
    prompt TEXT,
    raw_response TEXT,
    overall_score NUMERIC(5,2),
    overall_risk VARCHAR(20),
    confidence_score NUMERIC(5,2),
    summary TEXT,
    processing_time_ms BIGINT,
    token_usage INTEGER,
    latest BOOLEAN DEFAULT false,
    status VARCHAR(30) DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_prescription_medical_record_id ON prescriptions(medical_record_id);
CREATE INDEX idx_prescription_doctor_id ON prescriptions(doctor_id);
CREATE INDEX idx_prescription_item_prescription_id ON prescription_items(prescription_id);
CREATE INDEX idx_ai_evaluation_prescription_id ON ai_evaluations(prescription_id);
