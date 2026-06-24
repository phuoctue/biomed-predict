#!/usr/bin/env python3
"""
seed_data.py - Seed realistic test data into Supabase for MediAI.
Seeds: users, patients (thêm), drugs (thêm), evaluations, activity_logs
"""
import psycopg2, uuid, hashlib, random
from datetime import datetime, date, timedelta, timezone

HOST     = "db.hszcipdxyhednqknunpa.supabase.co"
PORT     = 5432; DBNAME = "postgres"; USER = "postgres"; PASSWORD = "biomed-predict123"; SSLMODE = "require"

BCRYPT_HASH = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LjZAEiCXNhe"  # "password123"

def conn():
    return psycopg2.connect(host=HOST,port=PORT,dbname=DBNAME,user=USER,password=PASSWORD,sslmode=SSLMODE)

def uid(): return str(uuid.uuid4())
def now(): return datetime.now(timezone.utc)

def run():
    c = conn(); cur = c.cursor()

    # ── 1. Users ─────────────────────────────────────────────────────────────
    print("Seeding users...")
    users = [
        (uid(),"bs.nguyenvana@mediai.local","Bác sĩ Nguyễn Văn A","DOCTOR","Nội khoa"),
        (uid(),"bs.tranb@mediai.local","Bác sĩ Trần Thị B","DOCTOR","Tim mạch"),
        (uid(),"ds.levanc@mediai.local","Dược sĩ Lê Văn C","PHARMACIST","Dược lâm sàng"),
        (uid(),"ds.phamd@mediai.local","Dược sĩ Phạm Thị D","PHARMACIST","Dược lâm sàng"),
        (uid(),"admin.hoang@mediai.local","Hoàng Quản Trị","ADMIN","IT"),
        (uid(),"bs.minh@mediai.local","Bác sĩ Trần Minh","DOCTOR","Hô hấp"),
        (uid(),"bs.hoa@mediai.local","Bác sĩ Nguyễn Thị Hoa","DOCTOR","Thần kinh"),
        (uid(),"ds.hung@mediai.local","Dược sĩ Lê Văn Hùng","PHARMACIST","Dược lâm sàng"),
    ]
    for u_id,email,fullname,role,dept in users:
        cur.execute("SELECT 1 FROM users WHERE email=%s",(email,))
        if not cur.fetchone():
            cur.execute("INSERT INTO users(id,email,password_hash,full_name,role,department,created_at,updated_at) VALUES(%s,%s,%s,%s,%s,%s,%s,%s)",
                (u_id,email,BCRYPT_HASH,fullname,role,dept,now(),now()))
    c.commit()

    # Lấy tất cả user IDs
    cur.execute("SELECT id,full_name,role FROM users")
    all_users = cur.fetchall()
    doctor_ids = [u[0] for u in all_users if u[2]=='DOCTOR']
    print(f"  {len(all_users)} users total, {len(doctor_ids)} doctors")

    # ── 2. Patients ───────────────────────────────────────────────────────────
    print("Seeding patients...")
    patients_data = [
        ("BN-2026-001","Nguyễn Văn Hùng","Male",date(1960,3,15),"012345678901","0901111001","Hà Nội","Type 2 Diabetes, Hypertension","Penicillin",72,170),
        ("BN-2026-002","Trần Thị Mai","Female",date(1975,7,22),"023456789012","0901111002","HCM","Asthma, Dyslipidemia","Sulfa drugs",58,160),
        ("BN-2026-003","Lê Văn Bình","Male",date(1958,11,5),"034567890123","0901111003","Đà Nẵng","Heart Failure, CKD Stage 3",None,85,168),
        ("BN-2026-004","Phạm Thị Lan","Female",date(1982,4,18),"045678901234","0901111004","Hải Phòng","Hypertension","Aspirin",63,155),
        ("BN-2026-005","Hoàng Văn Tùng","Male",date(1950,9,30),"056789012345","0901111005","Cần Thơ","COPD, Type 2 Diabetes","NSAIDs",78,165),
        ("BN-2026-006","Vũ Thị Thu","Female",date(1990,1,12),"067890123456","0901111006","Hà Nội","Depression, Anxiety",None,55,162),
        ("BN-2026-007","Đặng Văn Minh","Male",date(1965,6,8),"078901234567","0901111007","HCM","Atrial Fibrillation","Warfarin",80,172),
        ("BN-2026-008","Bùi Thị Hồng","Female",date(1978,2,25),"089012345678","0901111008","HCM","Rheumatoid Arthritis","Methotrexate",67,158),
        ("BN-2026-009","Ngô Văn Đức","Male",date(1970,8,14),"090123456789","0901111009","Hà Nội","Epilepsy",None,74,170),
        ("BN-2026-010","Lý Thị Xuân","Female",date(1985,12,3),"001234567890","0901111010","HCM","Migraine, Hypertension","Codeine",60,157),
        ("BN-2026-011","Trịnh Văn Long","Male",date(1955,5,20),"011234567891","0901111011","Huế","Chronic Kidney Disease, Anemia","Contrast media",82,169),
        ("BN-2026-012","Cao Thị Nhung","Female",date(1995,10,7),"022345678902","0901111012","Hà Nội","Type 1 Diabetes","Latex",52,163),
        ("BN-2026-013","Đinh Văn Khoa","Male",date(1968,3,28),"033456789013","0901111013","Nghệ An","Liver Cirrhosis, Hepatitis B","Amoxicillin",77,171),
        ("BN-2026-014","Mai Thị Kim","Female",date(1972,11,15),"044567890124","0901111014","HCM","Osteoporosis, Hypothyroidism",None,59,156),
        ("BN-2026-015","Nguyễn Thị Hà","Female",date(1988,7,9),"055678901235","0901111015","Hà Nội","Anxiety, Insomnia",None,57,161),
    ]
    patient_ids = []
    for mrn,fn,sex,dob,cid,phone,addr,diag,allergy,wt,ht in patients_data:
        cur.execute("SELECT id FROM patients WHERE mrn=%s",(mrn,))
        row = cur.fetchone()
        if row:
            patient_ids.append(str(row[0])); continue
        # Skip if citizen_id already exists
        if cid:
            cur.execute("SELECT id FROM patients WHERE citizen_id=%s",(cid,))
            dup = cur.fetchone()
            if dup:
                patient_ids.append(str(dup[0])); continue
        p_id = uid()
        cur.execute("""INSERT INTO patients(id,mrn,full_name,sex,date_of_birth,citizen_id,phone,address,
                       weight_kg,height_cm,diagnosis,allergies,created_at,updated_at)
                       VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
            (p_id,mrn,fn,sex,dob,cid,phone,addr,wt,ht,diag,allergy,now(),now()))
        patient_ids.append(p_id)
    c.commit()
    print(f"  {len(patient_ids)} patients ready")

    # ── 3. Drugs ─────────────────────────────────────────────────────────────
    print("Seeding more drugs...")
    more_drugs = [
        ("MET500","Metformin","Metformin HCl","Antidiabetic","Tablet","500mg","mg"),
        ("INS100","Insulin Glargine","Insulin glargine","Antidiabetic","Injection","100 IU/mL","IU/mL"),
        ("AML10","Amlodipine","Amlodipine besylate","Antihypertensive","Tablet","10mg","mg"),
        ("LIS20","Lisinopril","Lisinopril","ACE Inhibitor","Tablet","20mg","mg"),
        ("ATR40","Atorvastatin","Atorvastatin calcium","Statin","Tablet","40mg","mg"),
        ("OMEP20","Omeprazole","Omeprazole","PPI","Capsule","20mg","mg"),
        ("AMOX500","Amoxicillin","Amoxicillin trihydrate","Antibiotic","Capsule","500mg","mg"),
        ("CIPRO500","Ciprofloxacin","Ciprofloxacin HCl","Antibiotic","Tablet","500mg","mg"),
        ("WARF5","Warfarin","Warfarin sodium","Anticoagulant","Tablet","5mg","mg"),
        ("DIGOX025","Digoxin","Digoxin","Cardiac Glycoside","Tablet","0.25mg","mg"),
        ("CARV25","Carvedilol","Carvedilol","Beta Blocker","Tablet","25mg","mg"),
        ("FURO40","Furosemide","Furosemide","Loop Diuretic","Tablet","40mg","mg"),
        ("SPIRO25","Spironolactone","Spironolactone","Diuretic","Tablet","25mg","mg"),
        ("PRED20","Prednisolone","Prednisolone","Corticosteroid","Tablet","20mg","mg"),
        ("ALBU90","Albuterol","Salbutamol","Bronchodilator","Inhaler","90mcg/dose","mcg"),
        ("FLUT250","Fluticasone","Fluticasone propionate","Corticosteroid","Inhaler","250mcg","mcg"),
        ("GLIB5","Glibenclamide","Glibenclamide","Antidiabetic","Tablet","5mg","mg"),
        ("CLOZE25","Clozapine","Clozapine","Antipsychotic","Tablet","25mg","mg"),
        ("SERT50","Sertraline","Sertraline HCl","SSRI","Tablet","50mg","mg"),
        ("PARA500","Paracetamol","Acetaminophen","Analgesic","Tablet","500mg","mg"),
        ("IBU400","Ibuprofen","Ibuprofen","NSAID","Tablet","400mg","mg"),
        ("CODEINE30","Codeine","Codeine phosphate","Opioid Analgesic","Tablet","30mg","mg"),
        ("MTXATE10","Methotrexate","Methotrexate","DMARD","Tablet","10mg","mg"),
        ("HYCLORO25","Hydrochlorothiazide","Hydrochlorothiazide","Thiazide Diuretic","Tablet","25mg","mg"),
        ("RAMIP10","Ramipril","Ramipril","ACE Inhibitor","Capsule","10mg","mg"),
        ("TELMIS80","Telmisartan","Telmisartan","ARB","Tablet","80mg","mg"),
        ("IRON200","Ferrous Sulfate","Ferrous sulfate","Iron Supplement","Tablet","200mg","mg"),
        ("VITB12","Vitamin B12","Cyanocobalamin","Vitamin","Tablet","1000mcg","mcg"),
        ("CALCIU500","Calcium Carbonate","Calcium carbonate","Mineral","Tablet","500mg","mg"),
        ("LEVOT100","Levothyroxine","Levothyroxine sodium","Thyroid Hormone","Tablet","100mcg","mcg"),
    ]
    drug_id_map = {}  # code -> id
    # Get existing
    cur.execute("SELECT id,code FROM drugs")
    for row in cur.fetchall():
        drug_id_map[row[1]] = str(row[0])

    for code,name,generic,group,form,strength,unit in more_drugs:
        if code not in drug_id_map:
            d_id = uid()
            cur.execute("""INSERT INTO drugs(id,code,name,generic_name,drug_group,dosage_form,strength,unit,
                           status,created_at,updated_at) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,'ACTIVE',%s,%s)""",
                (d_id,code,name,generic,group,form,strength,unit,now(),now()))
            drug_id_map[code] = d_id
    c.commit()
    print(f"  {len(drug_id_map)} drugs total")

    # ── 4. Evaluations ────────────────────────────────────────────────────────
    print("Seeding evaluations...")
    cur.execute("SELECT COUNT(*) FROM evaluations")
    eval_count = cur.fetchone()[0]
    if eval_count < 20:
        eval_drugs = [drug_id_map.get(c) for c in ["MET500","WARF5","DIGOX025","CARV25","FURO40","CODEINE30","MTXATE10","CLOZE25"] if drug_id_map.get(c)]
        risk_levels = ["low","moderate","high","low","low","moderate","high","low","moderate","low"]
        eval_data = [
            (patient_ids[0], eval_drugs[0], 85, 80, "low", "Metformin phù hợp, cần theo dõi chức năng thận", "Kiểm tra eGFR định kỳ"),
            (patient_ids[1], eval_drugs[0], 78, 72, "moderate", "Metformin có thể dùng nhưng cần điều chỉnh liều", "Giảm liều nếu eGFR < 45"),
            (patient_ids[2], eval_drugs[2], 62, 58, "high", "Digoxin nguy hiểm với bệnh nhân suy thận", "Cân nhắc dừng hoặc giảm liều đáng kể"),
            (patient_ids[6], eval_drugs[1], 70, 65, "moderate", "Warfarin cần theo dõi INR chặt chẽ", "Kiểm tra INR 2 lần/tuần"),
            (patient_ids[3], eval_drugs[3], 88, 84, "low", "Carvedilol phù hợp cho tăng huyết áp", "Theo dõi nhịp tim"),
            (patient_ids[4], eval_drugs[4], 75, 70, "moderate", "Furosemide cẩn thận với bệnh nhân COPD", "Bổ sung kali"),
            (patient_ids[7], eval_drugs[6], 55, 50, "high", "Methotrexate có tương tác với dị ứng", "Xem xét thay thế"),
            (patient_ids[5], eval_drugs[7], 65, 60, "moderate", "Clozapine cần giám sát WBC", "Theo dõi công thức máu"),
            (patient_ids[9], eval_drugs[5], 45, 40, "high", "Codeine chống chỉ định với dị ứng đã biết", "Dừng ngay, dùng thay thế"),
            (patient_ids[10], eval_drugs[2], 50, 45, "high", "Digoxin rất nguy hiểm với suy thận nặng", "Không dùng"),
            (patient_ids[8], eval_drugs[0], 90, 86, "low", "Metformin an toàn, chức năng thận bình thường", "Tiếp tục theo dõi"),
            (patient_ids[11], eval_drugs[0], 82, 78, "low", "Metformin phù hợp cho ĐTĐ type 1", "Kết hợp insulin"),
            (patient_ids[12], eval_drugs[1], 60, 55, "high", "Warfarin nguy hiểm với xơ gan", "Cân nhắc thay NOAC"),
            (patient_ids[13], eval_drugs[0], 88, 84, "low", "Metformin an toàn", "Theo dõi định kỳ"),
            (patient_ids[14], eval_drugs[7], 72, 68, "moderate", "Clozapine phù hợp cho lo âu nặng", "Giám sát chặt chẽ"),
        ]
        for p_id, d_id, suit, conf, risk, summary, warning in eval_data:
            if not d_id: continue
            e_id = uid()
            days_ago = random.randint(1, 60)
            eval_time = now() - timedelta(days=days_ago, hours=random.randint(0,23))
            doctor_id = doctor_ids[random.randint(0, len(doctor_ids)-1)] if doctor_ids else None
            cur.execute("""INSERT INTO evaluations(id,patient_id,drug_id,evaluator_id,
                           model_name,model_version,suitability_score,confidence_score,risk_level,
                           summary,warnings_json,alternatives_json,created_at,updated_at)
                           VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                (e_id,p_id,d_id,doctor_id,"gpt-4o-mini","1.0",suit,conf,risk,
                 summary,'["'+warning+'"]','[]',eval_time,eval_time))
        c.commit()
        print(f"  Seeded {len(eval_data)} evaluations")
    else:
        print(f"  {eval_count} evaluations already exist, skipping")

    # ── 5. Activity logs ──────────────────────────────────────────────────────
    print("Seeding activity logs...")
    cur.execute("SELECT COUNT(*) FROM audit_logs")
    log_count = cur.fetchone()[0]
    if log_count < 10:
        actions = [
            ("Đăng nhập hệ thống", "Bác sĩ Nguyễn Văn A đăng nhập từ IP 192.168.1.10"),
            ("Tạo hồ sơ bệnh nhân", "Tạo hồ sơ BN-2026-001 cho Nguyễn Văn Hùng"),
            ("Đánh giá thuốc AI", "Đánh giá Metformin cho bệnh nhân BN-2026-001"),
            ("Cập nhật thông tin", "Cập nhật dị ứng cho bệnh nhân BN-2026-003"),
            ("Xuất báo cáo", "Xuất báo cáo đánh giá tháng 6/2026"),
            ("Đăng nhập hệ thống", "Dược sĩ Lê Văn C đăng nhập"),
            ("Xem hồ sơ bệnh nhân", "Xem hồ sơ BN-2026-007"),
            ("Thêm thuốc mới", "Thêm Ramipril vào danh mục"),
            ("Cảnh báo tương tác", "Phát hiện tương tác Warfarin-Aspirin"),
            ("Thay đổi mật khẩu", "Người dùng thay đổi mật khẩu"),
            ("Đánh giá thuốc AI", "Đánh giá Warfarin cho bệnh nhân BN-2026-007"),
            ("Phê duyệt đơn thuốc", "Phê duyệt đơn thuốc #RX-2026-042"),
            ("Đăng xuất", "Bác sĩ Trần Thị B đăng xuất"),
            ("Tạo hồ sơ bệnh nhân", "Tạo hồ sơ BN-2026-015"),
            ("Cập nhật quy tắc", "Cập nhật bộ quy tắc tương tác thuốc v2.5"),
        ]
        for i, (action, detail) in enumerate(actions):
            user_id = all_users[i % len(all_users)][0]
            days_ago = random.randint(0, 30)
            log_time = now() - timedelta(days=days_ago, hours=random.randint(0,23), minutes=random.randint(0,59))
            cur.execute("""INSERT INTO audit_logs(id,user_id,action,entity_name,detail,
                           ip_address,status,created_at,updated_at)
                           VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                (uid(),user_id,action,"SYSTEM",detail,
                 f"192.168.1.{random.randint(1,50)}","SUCCESS",log_time,log_time))
        c.commit()
        print(f"  Seeded {len(actions)} activity logs")
    else:
        print(f"  {log_count} activity logs already exist, skipping")

    # ── 6. Patient drugs (medications) ────────────────────────────────────────
    print("Seeding patient medications...")
    cur.execute("SELECT COUNT(*) FROM patient_drugs")
    med_count = cur.fetchone()[0]
    if med_count < 10:
        meds = [
            (patient_ids[0], drug_id_map.get("MET500"), "500mg","2 lần/ngày","Điều trị ĐTĐ type 2","ACTIVE"),
            (patient_ids[0], drug_id_map.get("AML10"), "10mg","1 lần/ngày","Điều trị tăng huyết áp","ACTIVE"),
            (patient_ids[1], drug_id_map.get("ATR40"), "40mg","1 lần/ngày","Điều trị rối loạn lipid","ACTIVE"),
            (patient_ids[1], drug_id_map.get("ALBU90"), "1 nhát xịt","Khi cần","Cắt cơn hen","ACTIVE"),
            (patient_ids[2], drug_id_map.get("CARV25"), "12.5mg","2 lần/ngày","Điều trị suy tim","ACTIVE"),
            (patient_ids[2], drug_id_map.get("FURO40"), "40mg","1 lần/ngày","Điều trị phù","ACTIVE"),
            (patient_ids[6], drug_id_map.get("WARF5"), "5mg","1 lần/ngày","Điều trị rung nhĩ","ACTIVE"),
            (patient_ids[6], drug_id_map.get("DIGOX025"), "0.25mg","1 lần/ngày","Kiểm soát nhịp tim","ACTIVE"),
            (patient_ids[3], drug_id_map.get("LIS20"), "10mg","1 lần/ngày","Điều trị tăng huyết áp","ACTIVE"),
            (patient_ids[7], drug_id_map.get("MTXATE10"), "10mg","1 lần/tuần","Điều trị viêm khớp","ACTIVE"),
            (patient_ids[4], drug_id_map.get("MET500"), "500mg","2 lần/ngày","Điều trị ĐTĐ type 2","ACTIVE"),
            (patient_ids[4], drug_id_map.get("FURO40"), "40mg","1 lần/ngày","Điều trị phù","ACTIVE"),
            (patient_ids[11], drug_id_map.get("INS100"), "10 IU","2 lần/ngày","Insulin nền","ACTIVE"),
            (patient_ids[9], drug_id_map.get("SERT50"), "50mg","1 lần/ngày","Điều trị đau đầu migraine","ACTIVE"),
            (patient_ids[13], drug_id_map.get("LEVOT100"), "100mcg","Sáng trước ăn","Điều trị nhược giáp","ACTIVE"),
        ]
        for p_id, d_id, dose, freq, indication, status in meds:
            if not d_id or not p_id: continue
            cur.execute("""INSERT INTO patient_drugs(id,patient_id,drug_id,dosage,frequency,
                           indication,status,created_at,updated_at)
                           VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                (uid(),p_id,d_id,dose,freq,indication,status,now(),now()))
        c.commit()
        print(f"  Seeded patient medications")
    else:
        print(f"  {med_count} patient medications already exist")

    # ── Summary ───────────────────────────────────────────────────────────────
    for table in ["users","patients","drugs","evaluations","audit_logs","patient_drugs"]:
        cur.execute(f"SELECT COUNT(*) FROM {table}")
        print(f"  {table}: {cur.fetchone()[0]} rows")

    cur.close(); c.close()
    print("\n✓ Seed completed!")

if __name__ == "__main__":
    run()
