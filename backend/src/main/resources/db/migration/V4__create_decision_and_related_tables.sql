CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE TABLE doctor_decisions (
    id BIGSERIAL PRIMARY KEY,
    prescription_id BIGINT NOT NULL REFERENCES prescriptions(id),
    doctor_id BIGINT NOT NULL REFERENCES users(id),
    decision VARCHAR(50) NOT NULL,
    override_reason TEXT,
    decision_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE TABLE pharmacy_verifications (
    id BIGSERIAL PRIMARY KEY,
    prescription_id BIGINT NOT NULL REFERENCES prescriptions(id),
    pharmacist_id BIGINT NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'PENDING',
    verification_time TIMESTAMP,
    note TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE TABLE ai_evaluation_items (
    id BIGSERIAL PRIMARY KEY,
    evaluation_id BIGINT NOT NULL REFERENCES ai_evaluations(id),
    prescription_item_id BIGINT NOT NULL REFERENCES prescription_items(id),
    suitability_score NUMERIC(5,2),
    risk_level VARCHAR(20),
    confidence NUMERIC(5,2),
    recommendation TEXT,
    explanation TEXT,
    suggested_dose VARCHAR(100),
    suggested_drug VARCHAR(100),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE TABLE ai_warnings (
    id BIGSERIAL PRIMARY KEY,
    evaluation_id BIGINT NOT NULL REFERENCES ai_evaluations(id),
    warning_type VARCHAR(50),
    severity VARCHAR(20),
    title VARCHAR(200),
    description TEXT,
    affected_drug VARCHAR(100),
    recommendation TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE TABLE contraindications (
    id BIGSERIAL PRIMARY KEY,
    drug_id BIGINT NOT NULL REFERENCES drugs(id),
    contraindication_type VARCHAR(50),
    reference_value VARCHAR(100),
    description TEXT,
    severity VARCHAR(20),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE TABLE patient_diseases (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(id),
    disease_id BIGINT NOT NULL REFERENCES diseases(id),
    diagnosed_date DATE,
    status VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE TABLE emergency_contacts (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(id),
    full_name VARCHAR(100),
    relationship VARCHAR(50),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_doctor_decision_prescription_id ON doctor_decisions(prescription_id);
CREATE INDEX idx_pharmacy_verification_prescription_id ON pharmacy_verifications(prescription_id);
CREATE INDEX idx_ai_evaluation_item_evaluation_id ON ai_evaluation_items(evaluation_id);
CREATE INDEX idx_ai_warning_evaluation_id ON ai_warnings(evaluation_id);
