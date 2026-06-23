# MediAI — Hệ thống hỗ trợ lâm sàng thông minh (CDSS)

## ✅ Trạng thái dự án

| Thành phần | Trạng thái | URL | Ghi chú |
|------------|-----------|-----|---------|
| **Backend** | ✅ Đang chạy | http://localhost:8081/api | Spring Boot + PostgreSQL |
| **AI Service** | ✅ Đang chạy | http://localhost:8000 | FastAPI + LLM |
| **Frontend** | ⏸️ Chưa chạy | http://localhost:5173 | React + Vite |
| **Database** | ✅ Supabase | PostgreSQL 17.6 | Cloud database |

---

## Kiến trúc

```
biomed-predict/
├── backend/        Java 21 + Spring Boot 3.4  → :8081/api
├── ai-service/     Python 3.10 + FastAPI       → :8000
└── frontend/       React 18 + Vite + Tailwind  → :5173
```

Database: **Supabase PostgreSQL** (đã có sẵn, không cần cài đặt)

---

## Yêu cầu cài đặt

| Công cụ | Phiên bản | Tải về |
|---------|-----------|--------|
| JDK | **21** (không dùng JDK 22+) | https://www.oracle.com/java/technologies/downloads/#java21 |
| Maven | 3.8+ | https://maven.apache.org/download.cgi |
| Node.js | 18+ | https://nodejs.org |
| Python | **3.10 – 3.12** (không dùng 3.13+) | https://www.python.org/downloads/ |

> ⚠️ **Quan trọng:** Dự án yêu cầu **JDK 21** vì phụ thuộc Lombok + MapStruct không tương thích JDK 22+.
> Nếu máy đang dùng JDK mới hơn, xem bước cấu hình JAVA_HOME bên dưới.

---

## Hướng dẫn chạy nhanh

### Bước 1 — Clone dự án

```bash
git clone https://github.com/phuoctue/biomed-predict.git
cd biomed-predict
```

---

### Bước 2 — Tạo file `.env`

File `.env` đã có sẵn với cấu hình Supabase. Không cần thay đổi gì!

Nếu cần xem lại hoặc customize:

```bash
# Database — Supabase (dùng chung, không cần thay đổi)
DATABASE_URL=jdbc:postgresql://db.hszcipdxyhednqknunpa.supabase.co:5432/postgres?sslmode=require
POSTGRES_USER=postgres
POSTGRES_PASSWORD=biomed-predict123

# Backend chạy port 8081
BACKEND_PORT=8081
VITE_API_BASE_URL=http://localhost:8081/api

# AI Service
AI_SERVICE_URL=http://localhost:8000
VITE_AI_BASE_URL=http://localhost:8000

# JWT (giữ nguyên hoặc đổi secret cho production)
JWT_ACCESS_SECRET=change_me_access_secret
JWT_REFRESH_SECRET=change_me_refresh_secret

# LLM — tuỳ chọn, bỏ trống nếu không có API key
LLM_PROVIDER=openai
LLM_API_KEY=
LLM_MODEL=gpt-4o-mini
```

---

### Bước 3 — Chạy Backend (Spring Boot)

**Windows — Cách nhanh nhất:**
```cmd
run-backend.bat
```

**Hoặc thủ công:**
```cmd
cd backend
set JAVA_HOME=C:\Program Files\Java\jdk-21
set PATH=%JAVA_HOME%\bin;%PATH%
mvn spring-boot:run -Dspring-boot.run.profiles=local -DskipTests
```

**macOS / Linux:**
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH

cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local -DskipTests
```

**Kiểm tra:** Backend khởi động thành công khi thấy:
```
Started MediAiApplication in X seconds
Tomcat started on port 8081
```

Test API:
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@mediai.local","password":"password123"}'
```

---

### Bước 4 — Chạy AI Service (FastAPI)

**Lần đầu tiên - Tạo virtual environment:**
```bash
cd ai-service
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

**Lần sau - Chạy nhanh:**

Windows:
```cmd
run-ai-service.bat
```

Manual:
```bash
cd ai-service
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Kiểm tra:**
```bash
curl http://localhost:8000/health
# Response: {"status":"ok","service":"ai-service"}
```

---

### Bước 5 — Chạy Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

**Kiểm tra:** Truy cập `http://localhost:5173`

---

## 👤 Tài khoản test

| Vai trò | Email | Mật khẩu | Quyền |
|---------|-------|----------|-------|
| **👨‍⚕️ Bác sĩ** | `doctor@mediai.local` | `password123` | Xem bệnh nhân, kê đơn, đánh giá AI |
| **🔧 Quản trị** | `admin@mediai.local` | `admin12345` | Quản lý toàn hệ thống |
| Bác sĩ 2 | `bs.nguyenvana@mediai.local` | `password123` | Xem bệnh nhân, kê đơn |
| Dược sĩ | `ds.levanc@mediai.local` | `password123` | Xác minh đơn thuốc |

---

## 📊 Dữ liệu test có sẵn trong DB

Database Supabase đã được populate với dữ liệu đầy đủ:

- **25 bệnh nhân** với hồ sơ lâm sàng chi tiết (tiền sử, bệnh mãn tính, dị ứng...)
- **52 loại thuốc** (Metformin, Warfarin, Digoxin, Aspirin, Lisinopril...)
- **15 đơn thuốc** đã được kê với đánh giá rủi ro AI
- **18 activity logs** (nhật ký hoạt động hệ thống)
- **4 người dùng** với các vai trò khác nhau (Doctor, Admin, Pharmacist)

---

## 🌐 Cấu trúc URL

| Service | URL | Docs | Ghi chú |
|---------|-----|------|---------|
| Frontend | http://localhost:5173 | - | React UI |
| Backend API | http://localhost:8081/api | [Swagger](http://localhost:8081/swagger-ui.html) | REST API |
| AI Service | http://localhost:8000 | [FastAPI Docs](http://localhost:8000/docs) | LLM Integration |
| Actuator | http://localhost:8081/actuator | - | Health monitoring |

---

## 📁 Cấu trúc file cấu hình quan trọng

```
backend/src/main/resources/
├── application.yml            # Cấu hình chính (đọc từ env vars)
└── application-local.yml      # Override cho local dev (Supabase DB)

ai-service/
├── .env                       # Biến môi trường AI service
└── app/core/config.py         # Cấu hình AI service

frontend/
└── .env.local                 # Biến môi trường frontend (VITE_*)

# File gốc
.env                           # Biến môi trường chung cho cả dự án
```

---

## 🔧 Các script tiện ích

| File | Mô tả | Hệ điều hành |
|------|-------|--------------|
| `run-backend.bat` | Chạy Backend với JDK 21 | Windows |
| `run-ai-service.bat` | Chạy AI Service | Windows |
| `run-frontend.bat` | Chạy Frontend (nếu có) | Windows |

---

## 🐳 Chạy bằng Docker (tuỳ chọn)

```bash
# Đảm bảo có file .env
docker-compose up --build
```

> ⚠️ **Lưu ý:** docker-compose mặc định dùng PostgreSQL local. 
> Để dùng Supabase, cập nhật `DATABASE_URL` trong `docker-compose.yml`.

---

## 🚨 Troubleshooting

### ❌ Backend không compile được

**Lỗi:** "Cannot find symbol" hoặc "Fatal error compiling"

**Nguyên nhân:** JDK không đúng phiên bản hoặc không set JAVA_HOME

**Giải pháp:**
```bash
# Kiểm tra Java version
java -version  # Phải hiện "21.x"

# Windows - Set JAVA_HOME
set JAVA_HOME=C:\Program Files\Java\jdk-21
set PATH=%JAVA_HOME%\bin;%PATH%

# macOS
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home

# Linux
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
```

---

### ❌ AI Service lỗi khi install dependencies

**Lỗi:** "pydantic-core build failed" hoặc "Microsoft Visual C++ required"

**Nguyên nhân:** Python 3.13+ chưa có prebuilt wheel cho một số package

**Giải pháp:** Dùng Python **3.10, 3.11, hoặc 3.12**

```bash
python --version  # Kiểm tra version
```

Nếu dùng Python 3.13, hãy install lại Python 3.12:
- Windows: https://www.python.org/downloads/release/python-3120/
- macOS: `brew install python@3.12`

---

### ❌ Backend lỗi "password authentication failed"

**Lỗi trong log:**
```
FATAL: password authentication failed for user "postgres"
```

**Giải pháp:** Kiểm tra file `backend/src/main/resources/application-local.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://db.hszcipdxyhednqknunpa.supabase.co:5432/postgres?sslmode=require
    username: postgres
    password: biomed-predict123
  flyway:
    enabled: false  # Quan trọng: Phải disable Flyway
```

---

### ❌ Frontend lỗi "Cannot read properties of undefined"

**Nguyên nhân:** Frontend không kết nối được với Backend

**Giải pháp:**

1. Kiểm tra Backend đã chạy chưa: `curl http://localhost:8081/api/auth/login`
2. Kiểm tra file `.env` hoặc `.env.local` trong `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8081/api
VITE_AI_BASE_URL=http://localhost:8000
```

3. Restart frontend sau khi sửa `.env`:
```bash
npm run dev
```

---

### ❌ Port bị chiếm dụng

**Lỗi:** "Port 8081 is already in use"

**Windows:**
```cmd
# Tìm process đang dùng port
netstat -ano | findstr :8081

# Kill process
taskkill /PID <PID> /F
```

**macOS / Linux:**
```bash
# Tìm và kill process
lsof -ti:8081 | xargs kill -9
```

---

### ❌ Flyway error "Unsupported Database: PostgreSQL 17.6"

**Giải pháp:** Đã fix bằng cách disable Flyway trong `application-local.yml`:

```yaml
spring:
  flyway:
    enabled: false
```

Database schema đã được tạo sẵn trên Supabase, không cần migration.

---

## 📚 Tài liệu bổ sung

- **API Documentation:** http://localhost:8081/swagger-ui.html (khi Backend chạy)
- **AI Service API:** http://localhost:8000/docs (khi AI Service chạy)
- **Architecture:** Xem thư mục `docs/` (nếu có)

---

## 🤝 Đóng góp

Dự án đang trong giai đoạn phát triển. Mọi góp ý và pull request đều được chào đón!

---

## 📞 Liên hệ / Báo lỗi

Nếu gặp vấn đề không thể tự giải quyết, vui lòng tạo issue trên GitHub repository hoặc liên hệ team phát triển.
