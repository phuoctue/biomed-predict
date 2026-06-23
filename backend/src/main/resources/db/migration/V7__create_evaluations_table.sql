-- V7: Create the `evaluations` table used by the new patient+drug-based AI
-- evaluation flow (com.mediai.ai.service.AIEvaluationService). This is
-- distinct from the older `ai_evaluations` table (V3) which is prescription-based.

CREATE TABLE evaluations (
    id          BIGSERIAL PRIMARY KEY,
    patient_id  BIGINT REFERENCES patients(id),
    drug_id     BIGINT REFERENCES drugs(id),
    evaluator_id BIGINT REFERENCES users(id),
    model_name  VARCHAR(100),
    model_version VARCHAR(50),
    prompt      TEXT,
    response    TEXT,
    processing_time_ms BIGINT,
    dosage      VARCHAR(255),
    labs_json   TEXT,
    suitability_score INTEGER NOT NULL,
    confidence_score  INTEGER,
    risk_level  VARCHAR(50) NOT NULL,
    summary     TEXT,
    raw_explanation TEXT,
    warnings_json    TEXT,
    alternatives_json TEXT,
    created_at  TIMESTAMP NOT NULL,
    updated_at  TIMESTAMP NOT NULL,
    created_by  BIGINT,
    updated_by  BIGINT,
    version     BIGINT,
    deleted     BOOLEAN NOT NULL DEFAULT false,
    deleted_at  TIMESTAMP
);

CREATE INDEX idx_evaluations_patient_id   ON evaluations(patient_id);
CREATE INDEX idx_evaluations_drug_id      ON evaluations(drug_id);
CREATE INDEX idx_evaluations_evaluator_id ON evaluations(evaluator_id);
CREATE INDEX idx_evaluations_created_at   ON evaluations(created_at);
CREATE INDEX idx_evaluations_risk_level   ON evaluations(risk_level);
