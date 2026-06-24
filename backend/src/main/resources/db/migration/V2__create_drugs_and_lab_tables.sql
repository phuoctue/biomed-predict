CREATE TABLE diseases (
    id BIGSERIAL PRIMARY KEY,
    icd_code VARCHAR(30) UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE TABLE drugs (
    id BIGSERIAL PRIMARY KEY,
    drug_code VARCHAR(30) NOT NULL UNIQUE,
    generic_name VARCHAR(200) NOT NULL,
    brand_name VARCHAR(200),
    drug_group VARCHAR(100),
    dosage_form VARCHAR(50),
    strength VARCHAR(50),
    unit VARCHAR(30),
    manufacturer VARCHAR(200),
    instruction TEXT,
    recommended_dose TEXT,
    side_effects TEXT,
    storage_condition TEXT,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE TABLE ingredients (
    id BIGSERIAL PRIMARY KEY,
    ingredient_code VARCHAR(50) UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE TABLE drug_ingredients (
    id BIGSERIAL PRIMARY KEY,
    drug_id BIGINT NOT NULL REFERENCES drugs(id),
    ingredient_id BIGINT NOT NULL REFERENCES ingredients(id),
    concentration VARCHAR(100),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP,
    UNIQUE(drug_id, ingredient_id)
);

CREATE TABLE lab_results (
    id BIGSERIAL PRIMARY KEY,
    medical_record_id BIGINT NOT NULL REFERENCES medical_records(id),
    test_code VARCHAR(30),
    test_name VARCHAR(100),
    result_value VARCHAR(100),
    unit VARCHAR(30),
    reference_range VARCHAR(100),
    abnormal_flag BOOLEAN,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT,
    updated_by BIGINT,
    version BIGINT,
    deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_disease_icd_code ON diseases(icd_code);
CREATE INDEX idx_drug_code ON drugs(drug_code);
CREATE INDEX idx_drug_generic_name ON drugs(generic_name);
CREATE INDEX idx_lab_result_medical_record_id ON lab_results(medical_record_id);
