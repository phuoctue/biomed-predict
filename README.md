# MediAI — Hệ thống hỗ trợ lâm sàng thông minh (CDSS)

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

## Hướng dẫn chạy

### Bước 1 — Clone dự án

```bash
git clone https://github.com/phuoctue/biomed-predict.git
cd biomed-predict
git checkout feature/fix
```

---

### Bước 2 — Tạo file `.env`

Copy file mẫu và điền thông tin:

```bash
cp .env.example .env
```

Mở `.env` và cập nhật các giá trị sau:

```env
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

> Nếu không có LLM API key, AI service vẫn chạy nhưng trả về fallback response thay vì gọi GPT.

---

### Bước 3 — Chạy Backend (Spring Boot)

**Windows:**
```cmd
# Cách 1 — Dùng script có sẵn (khuyên dùng)
run-backend.bat

# Cách 2 — Thủ công (nếu JDK 21 là default)
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local -DskipTests
```

**macOS / Linux:**
```bash
export JAVA_HOME=/path/to/jdk-21
export PATH=$JAVA_HOME/bin:$PATH

cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local -DskipTests
```

**Kiểm tra:** Truy cập `http://localhost:8081/api/health` → `{"status":"ok","service":"backend"}`

> **Nếu máy có nhiều JDK:** Cần đặt JAVA_HOME trỏ đúng JDK 21 trước khi chạy Maven.
> Windows: `set JAVA_HOME=C:\Program Files\Java\jdk-21`

---

### Bước 4 — Chạy AI Service (FastAPI)

**Tạo virtual environment và cài packages:**
```bash
cd ai-service
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

**Chạy server:**
```bash
# Windows — dùng script có sẵn
cd ..
run-ai-service.bat

# Hoặc thủ công
cd ai-service
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Kiểm tra:** Truy cập `http://localhost:8000/health` → `{"status":"ok","service":"ai-service"}`

---

### Bước 5 — Chạy Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

**Kiểm tra:** Truy cập `http://localhost:5173`

---

## Tài khoản test

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| **Bác sĩ** | `doctor@mediai.local` | `password123` |
| **Quản trị** | `admin@mediai.local` | `admin12345` |
| Bác sĩ 2 | `bs.nguyenvana@mediai.local` | `password123` |
| Dược sĩ | `ds.levanc@mediai.local` | `password123` |

---

## Dữ liệu test có sẵn trong DB

- **25 bệnh nhân** với hồ sơ lâm sàng đầy đủ
- **52 loại thuốc** (Metformin, Warfarin, Digoxin, Aspirin...)
- **15 đánh giá AI** với các mức rủi ro khác nhau
- **18 activity logs** (nhật ký hệ thống)

---

## Cấu trúc URL

| Service | URL | Ghi chú |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Giao diện chính |
| Backend API | http://localhost:8081/api | REST API |
| AI Service | http://localhost:8000 | FastAPI |
| API Docs | http://localhost:8081/swagger-ui.html | Swagger UI |
| AI Docs | http://localhost:8000/docs | FastAPI Docs |

---

## Cấu trúc file cấu hình quan trọng

```
backend/src/main/resources/
├── application.yml            # Cấu hình chính (đọc từ env vars)
└── application-local.yml      # Override cho local dev (Supabase DB)

ai-service/
├── .env                       # Tạo từ .env.example
└── app/core/config.py         # Cấu hình AI service

frontend/
└── .env (hoặc dùng VITE_ vars từ .env gốc)
```

---

## Chạy bằng Docker (tuỳ chọn)

```bash
# Tạo .env trước, sau đó:
docker-compose up --build
```

> Lưu ý: docker-compose dùng PostgreSQL local. Để dùng Supabase, cần cập nhật `DATABASE_URL` trong `.env`.

---

## Troubleshooting

**❌ "Cannot find symbol" hoặc compile lỗi với Java**
→ Kiểm tra `java -version`, đảm bảo là **21.x**, đặt lại `JAVA_HOME`.

**❌ "pydantic-core build failed" khi pip install**
→ Python 3.13+ chưa có prebuilt wheel. Dùng Python **3.10, 3.11, hoặc 3.12**.

**❌ Backend lỗi "password authentication failed"**
→ Kiểm tra file `application-local.yml` có đúng connection string Supabase chưa.

**❌ Frontend hiện "Cannot read properties of undefined"**
→ Đảm bảo `VITE_API_BASE_URL=http://localhost:8081/api` trong `.env`.

**❌ Port 8081 đã bị dùng**
→ `netstat -ano | findstr :8081` (Windows) để tìm PID, sau đó `taskkill /PID <pid> /F`.
