-- V9: Add clinical and contact columns to the `patients` table.
-- These columns are required by the Patient JPA entity but were not present
-- in the original V1 schema.

ALTER TABLE patients
    ADD COLUMN IF NOT EXISTS height_cm               INTEGER,
    ADD COLUMN IF NOT EXISTS weight_kg               INTEGER,
    ADD COLUMN IF NOT EXISTS insurance_number        VARCHAR(30) UNIQUE,
    ADD COLUMN IF NOT EXISTS emergency_contact_name  VARCHAR(100),
    ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(20),
    ADD COLUMN IF NOT EXISTS emergency_contact_relation VARCHAR(50),
    ADD COLUMN IF NOT EXISTS diagnosis               TEXT,
    ADD COLUMN IF NOT EXISTS allergies               TEXT;
