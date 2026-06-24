INSERT INTO roles (name, description, created_at, updated_at, deleted) VALUES
('ADMIN', 'Administrator with full access', NOW(), NOW(), false),
('DOCTOR', 'Doctor user role', NOW(), NOW(), false),
('PHARMACIST', 'Pharmacist user role', NOW(), NOW(), false),
('MEDICAL_STAFF', 'Medical staff user role', NOW(), NOW(), false);

INSERT INTO permissions (code, name, description, created_at, updated_at, deleted) VALUES
('PATIENT_READ', 'Read patient information', 'View patient records', NOW(), NOW(), false),
('PATIENT_CREATE', 'Create patient', 'Register new patient', NOW(), NOW(), false),
('PATIENT_UPDATE', 'Update patient', 'Modify patient information', NOW(), NOW(), false),
('PATIENT_DELETE', 'Delete patient', 'Soft delete patient', NOW(), NOW(), false),
('PRESCRIPTION_CREATE', 'Create prescription', 'Create new prescriptions', NOW(), NOW(), false),
('PRESCRIPTION_APPROVE', 'Approve prescription', 'Confirm prescriptions', NOW(), NOW(), false),
('AI_EVALUATION', 'AI Evaluation', 'Access AI evaluation features', NOW(), NOW(), false),
('REPORT_VIEW', 'View reports', 'Access reporting features', NOW(), NOW(), false);

INSERT INTO diseases (icd_code, name, description, created_at, updated_at, deleted) VALUES
('E11', 'Type 2 Diabetes Mellitus', 'Non-insulin dependent diabetes', NOW(), NOW(), false),
('I10', 'Essential Hypertension', 'High blood pressure', NOW(), NOW(), false),
('J45', 'Asthma', 'Chronic respiratory disease', NOW(), NOW(), false),
('E78', 'Dyslipidemia', 'Abnormal blood lipids', NOW(), NOW(), false);

INSERT INTO ingredients (ingredient_code, name, description, created_at, updated_at, deleted) VALUES
('ING001', 'Metformin', 'Antidiabetic agent', NOW(), NOW(), false),
('ING002', 'Lisinopril', 'ACE inhibitor for hypertension', NOW(), NOW(), false),
('ING003', 'Atorvastatin', 'Statin for cholesterol', NOW(), NOW(), false),
('ING004', 'Albuterol', 'Bronchodilator for asthma', NOW(), NOW(), false);

INSERT INTO drugs (drug_code, generic_name, brand_name, drug_group, dosage_form, strength, unit, manufacturer, recommended_dose, status, created_at, updated_at, deleted) VALUES
('DRUG001', 'Metformin', 'Glucophage', 'Antidiabetic', 'Tablet', '500', 'mg', 'Merck', '500-2000 mg daily', 'ACTIVE', NOW(), NOW(), false),
('DRUG002', 'Lisinopril', 'Prinivil', 'Antihypertensive', 'Tablet', '10', 'mg', 'Pfizer', '10-40 mg daily', 'ACTIVE', NOW(), NOW(), false),
('DRUG003', 'Atorvastatin', 'Lipitor', 'Statin', 'Tablet', '20', 'mg', 'Pfizer', '10-80 mg daily', 'ACTIVE', NOW(), NOW(), false),
('DRUG004', 'Albuterol', 'Proventil', 'Bronchodilator', 'Inhaler', '90', 'mcg', 'GSK', 'As needed', 'ACTIVE', NOW(), NOW(), false);

INSERT INTO drug_ingredients (drug_id, ingredient_id, concentration, created_at, updated_at, deleted) VALUES
(1, 1, '500 mg', NOW(), NOW(), false),
(2, 2, '10 mg', NOW(), NOW(), false),
(3, 3, '20 mg', NOW(), NOW(), false),
(4, 4, '90 mcg', NOW(), NOW(), false);
