-- Create test users with BCrypt hashed passwords (strength 10)
-- Admin: admin@mediai.local / admin123
-- Doctor: doctor@mediai.local / doctor123  
-- Pharmacist: pharmacist@mediai.local / pharma123
-- Medical Staff: staff@mediai.local / staff123

INSERT INTO users (email, password_hash, full_name, role, department, created_at, updated_at, deleted) VALUES
('admin@mediai.local', '$2a$10$N.wmcV8X1q7sxzE.vKxJf.JZ0Sk7qJJ4Y.5bCK7K5VvPqK8mJQdPy', 'System Administrator', 'ADMIN', 'Administration', NOW(), NOW(), false),
('doctor@mediai.local', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Roekjpkh.bH4yLlWxFVvixUm', 'Dr. Nguyen Van A', 'DOCTOR', 'Internal Medicine', NOW(), NOW(), false),
('pharmacist@mediai.local', '$2a$10$k8PzMGLR5H7JnXcF3U5QCeC1VC8LqV3Z6YXJ5KHvW9MqN2OZ3FkL6', 'Tran Thi B', 'PHARMACIST', 'Pharmacy', NOW(), NOW(), false),
('staff@mediai.local', '$2a$10$L9QrN2M3P4R5S6T7U8V9W.jH5gK6lM7nO8pQ9rS0tU1vW2xY3zA4b', 'Le Van C', 'MEDICAL_STAFF', 'Nursing', NOW(), NOW(), false);

-- Insert comprehensive patient data for testing
INSERT INTO patients (medical_record_number, full_name, date_of_birth, gender, phone, email, address, emergency_contact_name, emergency_contact_phone, insurance_number, insurance_provider, blood_type, height, weight, status, created_at, updated_at, deleted) VALUES
('MRN001', 'Hoàng Văn Minh', '1985-03-15', 'MALE', '0901234567', 'minh.hv@email.com', '123 Đường Lê Lợi, Quận 1, TP.HCM', 'Hoàng Thị Mai', '0907654321', 'INS001234', 'Bảo Việt', 'O+', 170.5, 68.0, 'ACTIVE', NOW(), NOW(), false),
('MRN002', 'Nguyễn Thị Lan', '1990-07-22', 'FEMALE', '0912345678', 'lan.nt@email.com', '456 Trần Hưng Đạo, Quận 5, TP.HCM', 'Nguyễn Văn Hùng', '0908765432', 'INS002345', 'Prudential', 'A+', 160.0, 55.0, 'ACTIVE', NOW(), NOW(), false),
('MRN003', 'Trần Quốc Bảo', '1978-11-08', 'MALE', '0923456789', 'bao.tq@email.com', '789 Nguyễn Huệ, Quận 1, TP.HCM', 'Trần Thị Hoa', '0909876543', 'INS003456', 'Manulife', 'B+', 175.0, 80.5, 'ACTIVE', NOW(), NOW(), false),
('MRN004', 'Phạm Thị Hương', '1995-05-30', 'FEMALE', '0934567890', 'huong.pt@email.com', '321 Võ Văn Tần, Quận 3, TP.HCM', 'Phạm Văn Tùng', '0910987654', 'INS004567', 'AIA', 'AB+', 165.0, 58.0, 'ACTIVE', NOW(), NOW(), false),
('MRN005', 'Lê Minh Tuấn', '1982-12-18', 'MALE', '0945678901', 'tuan.lm@email.com', '654 Hai Bà Trưng, Quận 1, TP.HCM', 'Lê Thị Nga', '0911098765', 'INS005678', 'Bảo Việt', 'O-', 168.0, 72.0, 'ACTIVE', NOW(), NOW(), false),
('MRN006', 'Vũ Thị Thu', '1988-09-25', 'FEMALE', '0956789012', 'thu.vt@email.com', '987 Cách Mạng Tháng 8, Quận 10, TP.HCM', 'Vũ Văn Long', '0912109876', 'INS006789', 'Prudential', 'A-', 158.0, 52.0, 'ACTIVE', NOW(), NOW(), false),
('MRN007', 'Đỗ Văn Nam', '1975-02-14', 'MALE', '0967890123', 'nam.dv@email.com', '147 Lý Thường Kiệt, Quận Tân Bình, TP.HCM', 'Đỗ Thị Liên', '0913210987', 'INS007890', 'Manulife', 'B-', 172.0, 75.0, 'ACTIVE', NOW(), NOW(), false),
('MRN008', 'Bùi Thị Mai', '1992-06-07', 'FEMALE', '0978901234', 'mai.bt@email.com', '258 Phan Xích Long, Quận Phú Nhuận, TP.HCM', 'Bùi Văn Dũng', '0914321098', 'INS008901', 'AIA', 'O+', 162.0, 56.0, 'ACTIVE', NOW(), NOW(), false),
('MRN009', 'Ngô Văn Thành', '1980-10-11', 'MALE', '0989012345', 'thanh.nv@email.com', '369 Nguyễn Đình Chiểu, Quận 3, TP.HCM', 'Ngô Thị Hằng', '0915432109', 'INS009012', 'Bảo Việt', 'A+', 178.0, 82.0, 'ACTIVE', NOW(), NOW(), false),
('MRN010', 'Đinh Thị Nhung', '1987-04-20', 'FEMALE', '0990123456', 'nhung.dt@email.com', '753 Lê Văn Sỹ, Quận Tân Bình, TP.HCM', 'Đinh Văn Phong', '0916543210', 'INS010123', 'Prudential', 'AB-', 163.0, 54.0, 'ACTIVE', NOW(), NOW(), false);

-- Add more drug data for testing
INSERT INTO drugs (drug_code, generic_name, brand_name, drug_group, dosage_form, strength, unit, manufacturer, recommended_dose, status, created_at, updated_at, deleted) VALUES
('DRUG005', 'Amoxicillin', 'Amoxil', 'Antibiotic', 'Capsule', '500', 'mg', 'GSK', '250-500 mg every 8 hours', 'ACTIVE', NOW(), NOW(), false),
('DRUG006', 'Omeprazole', 'Prilosec', 'Proton Pump Inhibitor', 'Capsule', '20', 'mg', 'AstraZeneca', '20-40 mg daily', 'ACTIVE', NOW(), NOW(), false),
('DRUG007', 'Ibuprofen', 'Advil', 'NSAID', 'Tablet', '400', 'mg', 'Pfizer', '200-800 mg every 6-8 hours', 'ACTIVE', NOW(), NOW(), false),
('DRUG008', 'Paracetamol', 'Tylenol', 'Analgesic', 'Tablet', '500', 'mg', 'Johnson & Johnson', '500-1000 mg every 4-6 hours', 'ACTIVE', NOW(), NOW(), false),
('DRUG009', 'Cetirizine', 'Zyrtec', 'Antihistamine', 'Tablet', '10', 'mg', 'UCB', '5-10 mg daily', 'ACTIVE', NOW(), NOW(), false),
('DRUG010', 'Amlodipine', 'Norvasc', 'Calcium Channel Blocker', 'Tablet', '5', 'mg', 'Pfizer', '5-10 mg daily', 'ACTIVE', NOW(), NOW(), false);

-- Add more ingredients
INSERT INTO ingredients (ingredient_code, name, description, created_at, updated_at, deleted) VALUES
('ING005', 'Amoxicillin', 'Beta-lactam antibiotic', NOW(), NOW(), false),
('ING006', 'Omeprazole', 'Proton pump inhibitor', NOW(), NOW(), false),
('ING007', 'Ibuprofen', 'NSAID for pain and inflammation', NOW(), NOW(), false),
('ING008', 'Paracetamol', 'Analgesic and antipyretic', NOW(), NOW(), false),
('ING009', 'Cetirizine', 'Second-generation antihistamine', NOW(), NOW(), false),
('ING010', 'Amlodipine', 'Calcium channel blocker', NOW(), NOW(), false);

-- Link drugs to ingredients
INSERT INTO drug_ingredients (drug_id, ingredient_id, concentration, created_at, updated_at, deleted) VALUES
(5, 5, '500 mg', NOW(), NOW(), false),
(6, 6, '20 mg', NOW(), NOW(), false),
(7, 7, '400 mg', NOW(), NOW(), false),
(8, 8, '500 mg', NOW(), NOW(), false),
(9, 9, '10 mg', NOW(), NOW(), false),
(10, 10, '5 mg', NOW(), NOW(), false);

-- Add some patient medications
INSERT INTO patient_drugs (patient_id, drug_id, prescribed_by, prescription_date, dosage_instructions, start_date, end_date, status, created_at, updated_at, deleted) VALUES
(1, 1, 2, NOW() - INTERVAL '10 days', '500mg twice daily with meals', NOW() - INTERVAL '10 days', NOW() + INTERVAL '80 days', 'ACTIVE', NOW(), NOW(), false),
(1, 2, 2, NOW() - INTERVAL '10 days', '10mg once daily before breakfast', NOW() - INTERVAL '10 days', NOW() + INTERVAL '80 days', 'ACTIVE', NOW(), NOW(), false),
(2, 3, 2, NOW() - INTERVAL '5 days', '20mg once daily at bedtime', NOW() - INTERVAL '5 days', NOW() + INTERVAL '85 days', 'ACTIVE', NOW(), NOW(), false),
(3, 2, 2, NOW() - INTERVAL '15 days', '10mg once daily', NOW() - INTERVAL '15 days', NOW() + INTERVAL '75 days', 'ACTIVE', NOW(), NOW(), false),
(3, 10, 2, NOW() - INTERVAL '15 days', '5mg once daily', NOW() - INTERVAL '15 days', NOW() + INTERVAL '75 days', 'ACTIVE', NOW(), NOW(), false),
(4, 9, 2, NOW() - INTERVAL '3 days', '10mg once daily for allergies', NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days', 'ACTIVE', NOW(), NOW(), false),
(5, 1, 2, NOW() - INTERVAL '20 days', '500mg twice daily', NOW() - INTERVAL '20 days', NOW() + INTERVAL '70 days', 'ACTIVE', NOW(), NOW(), false),
(6, 8, 2, NOW() - INTERVAL '2 days', '500mg every 6 hours as needed for pain', NOW() - INTERVAL '2 days', NOW() + INTERVAL '13 days', 'ACTIVE', NOW(), NOW(), false);

-- Add some prescriptions
INSERT INTO prescriptions (prescription_number, patient_id, doctor_id, diagnosis, prescription_date, status, notes, created_at, updated_at, deleted) VALUES
('PRE001', 1, 2, 'Type 2 Diabetes Mellitus with Hypertension', NOW() - INTERVAL '10 days', 'COMPLETED', 'Patient responded well to initial dosage', NOW(), NOW(), false),
('PRE002', 2, 2, 'Dyslipidemia', NOW() - INTERVAL '5 days', 'COMPLETED', 'Monitor lipid levels monthly', NOW(), NOW(), false),
('PRE003', 3, 2, 'Essential Hypertension', NOW() - INTERVAL '15 days', 'COMPLETED', 'Blood pressure controlled', NOW(), NOW(), false),
('PRE004', 4, 2, 'Allergic Rhinitis', NOW() - INTERVAL '3 days', 'ACTIVE', 'Seasonal allergies', NOW(), NOW(), false),
('PRE005', 5, 2, 'Type 2 Diabetes Mellitus', NOW() - INTERVAL '20 days', 'COMPLETED', 'Continue monitoring glucose levels', NOW(), NOW(), false);

-- Link prescriptions to drugs
INSERT INTO prescription_drugs (prescription_id, drug_id, dosage, frequency, duration_days, quantity, notes, created_at, updated_at, deleted) VALUES
(1, 1, '500mg', 'Twice daily', 90, 180, 'Take with meals', NOW(), NOW(), false),
(1, 2, '10mg', 'Once daily', 90, 90, 'Before breakfast', NOW(), NOW(), false),
(2, 3, '20mg', 'Once daily', 90, 90, 'At bedtime', NOW(), NOW(), false),
(3, 2, '10mg', 'Once daily', 90, 90, 'Any time of day', NOW(), NOW(), false),
(3, 10, '5mg', 'Once daily', 90, 90, 'Same time each day', NOW(), NOW(), false),
(4, 9, '10mg', 'Once daily', 30, 30, 'Can be taken with or without food', NOW(), NOW(), false),
(5, 1, '500mg', 'Twice daily', 90, 180, 'With meals', NOW(), NOW(), false);

-- Add some lab results
INSERT INTO lab_results (patient_id, test_type, test_name, test_date, result_value, unit, reference_range, status, interpretation, notes, created_at, updated_at, deleted) VALUES
(1, 'BLOOD_CHEMISTRY', 'Fasting Blood Glucose', NOW() - INTERVAL '5 days', '126', 'mg/dL', '70-100', 'COMPLETED', 'Elevated - Consistent with diabetes', 'Continue medication', NOW(), NOW(), false),
(1, 'BLOOD_CHEMISTRY', 'HbA1c', NOW() - INTERVAL '5 days', '7.2', '%', '<5.7', 'COMPLETED', 'Above target', 'Monitor closely', NOW(), NOW(), false),
(2, 'LIPID_PANEL', 'Total Cholesterol', NOW() - INTERVAL '3 days', '245', 'mg/dL', '<200', 'COMPLETED', 'Elevated', 'Statin therapy indicated', NOW(), NOW(), false),
(2, 'LIPID_PANEL', 'LDL Cholesterol', NOW() - INTERVAL '3 days', '165', 'mg/dL', '<100', 'COMPLETED', 'High', 'Treatment target <100', NOW(), NOW(), false),
(3, 'VITAL_SIGNS', 'Blood Pressure', NOW() - INTERVAL '2 days', '138/88', 'mmHg', '<120/80', 'COMPLETED', 'Stage 1 Hypertension', 'On antihypertensive therapy', NOW(), NOW(), false);
