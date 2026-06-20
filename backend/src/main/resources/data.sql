-- Thêm dữ liệu mẫu vào database

-- Xóa dữ liệu cũ nếu có để tránh lỗi duplicate
DELETE FROM patient_drugs;
DELETE FROM drug_interactions;
DELETE FROM evaluations;
DELETE FROM drugs;
DELETE FROM patients;

-- 1. Bệnh nhân
INSERT INTO patients (id, mrn, full_name, date_of_birth, sex, citizen_id, phone, diagnosis, allergies, created_at, updated_at)
VALUES 
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1002485', 'Trần Văn Demo', '1975-04-30', 'Nam', '012345678901', '0901234567', 'Tăng huyết áp, Đái tháo đường type 2, Rung nhĩ', 'Penicillin', now(), now());

-- 2. Thuốc
INSERT INTO drugs (id, code, name, generic_name, dosage_form, strength, status, created_at, updated_at)
VALUES 
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'ASP81', 'Aspirin', 'Acetylsalicylic acid', 'Viên nén', '81mg', 'ACTIVE', now(), now()),
('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'WARF5', 'Warfarin', 'Warfarin sodium', 'Viên nén', '5mg', 'ACTIVE', now(), now()),
('e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'MET850', 'Metformin', 'Metformin', 'Viên nén', '850mg', 'ACTIVE', now(), now());

-- 3. Tương tác thuốc
INSERT INTO drug_interactions (id, source_drug_id, target_drug_id, severity, description, recommendation, created_at, updated_at)
VALUES 
('f4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'HIGH', 'Sử dụng đồng thời Aspirin và Warfarin làm tăng đáng kể nguy cơ chảy máu do tác dụng hiệp đồng chống đông máu và chống kết tập tiểu cầu.', 'Tránh sử dụng đồng thời nếu có thể. Nếu bắt buộc phải dùng, cần theo dõi chặt chẽ INR, dấu hiệu chảy máu và điều chỉnh liều Warfarin phù hợp.', now(), now());

-- 4. Đơn thuốc của bệnh nhân (patient_drugs)
INSERT INTO patient_drugs (id, patient_id, drug_id, dosage, frequency, indication, status, status_text, created_at, updated_at)
VALUES 
('11111111-1111-1111-1111-111111111111', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '81mg', '1 lần/ngày', 'Phòng ngừa huyết khối', 'WARNING', 'Tương tác nghiêm trọng', now(), now()),
('22222222-2222-2222-2222-222222222222', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '5mg', '1 lần/ngày', 'Chống đông máu', 'WARNING', 'Tương tác nghiêm trọng', now(), now()),
('33333333-3333-3333-3333-333333333333', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '850mg', '2 lần/ngày', 'Kiểm soát đường huyết', 'ACTIVE', 'An toàn', now(), now());
