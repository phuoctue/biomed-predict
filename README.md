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
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local -DskipTests
```

**macOS / Linux:**
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH

cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local -DskipTests
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

## Testing

Phần kiểm thử của hệ thống MediAI được xây dựng nhằm xác minh tính đúng đắn của các chức năng quan trọng, đặc biệt là luồng đăng nhập, tìm kiếm thuốc và đánh giá thuốc bằng AI. Trong quá trình kiểm thử, dự án áp dụng đồng thời hai nhóm phương pháp là kiểm thử hộp trắng và kiểm thử hộp đen để đảm bảo cả logic xử lý nội bộ lẫn hành vi quan sát được từ phía người dùng đều hoạt động phù hợp với yêu cầu.

### 1. Kiểm thử hộp trắng

- **Mục tiêu:**
  - Xác minh logic nội bộ của các component, hook và hàm xử lý dữ liệu.
  - Kiểm tra các nhánh xử lý quan trọng như gọi API, quản lý trạng thái và hiển thị điều kiện.
- **Phương pháp:**
  - Sử dụng Unit Test với Vitest.
  - Kết hợp React Testing Library để mô phỏng hành vi tương tác của component.
  - Dùng `jsdom` làm môi trường mô phỏng trình duyệt.
- **Công cụ sử dụng:** `Vitest`, `React Testing Library`, `jsdom`
- **Đối tượng kiểm thử:**
  - Đăng nhập `LoginPage`
  - Tìm kiếm thuốc ở `DrugSelector`
  - Đánh giá thuốc bằng AI ở `EvaluationPage`

**Kết quả:**
- Kiểm tra thành công luồng đăng nhập hợp lệ và luồng lỗi khi đăng nhập thất bại.
- Kiểm tra thành công chức năng tìm kiếm thuốc, chọn thuốc và xóa thuốc đã chọn.
- Kiểm tra thành công trạng thái thiếu dữ liệu và luồng gọi API AI trong màn hình đánh giá.

**Kết luận:**
- Kiểm thử hộp trắng giúp phát hiện sớm lỗi logic và bảo đảm các phần xử lý bên trong hoạt động đúng theo thiết kế.
- Phương pháp này phù hợp với dự án React + Vite vì cấu hình gọn, dễ viết test và dễ bảo trì.

### 2. Kiểm thử hộp đen

- **Mục tiêu:**
  - Xác minh hành vi hệ thống từ góc nhìn người dùng cuối.
  - Đảm bảo giao diện và kết quả trả về phù hợp với yêu cầu nghiệp vụ.
- **Phương pháp:**
  - Xây dựng test case theo kịch bản người dùng thực tế.
  - Thực hiện kiểm thử thủ công trên trình duyệt.
- **Công cụ sử dụng:** trình duyệt, bảng test case, tài liệu ghi nhận kết quả
- **Đối tượng kiểm thử:**
  - Đăng nhập
  - Tìm kiếm thuốc
  - Đánh giá thuốc bằng AI

**Kết quả:**
- Xác minh được luồng đăng nhập đúng/sai thông tin.
- Xác minh được kết quả tìm kiếm thuốc theo từ khóa.
- Xác minh được việc đánh giá AI khi có đủ dữ liệu và khi thiếu dữ liệu.

**Kết luận:**
- Kiểm thử hộp đen phản ánh chính xác trải nghiệm thực tế của người dùng.
- Đây là phương pháp phù hợp để trình bày trong báo cáo môn học vì dễ hiểu, dễ minh họa và dễ demo.

### 3. Cách chạy test

Chạy toàn bộ unit test ở frontend:

```bash
cd frontend
npm test -- --run
```

Hoặc chạy chế độ một lần:

```bash
cd frontend
npm run test:run
```

### 4. Kết quả kiểm thử mẫu

- `LoginPage`: kiểm tra submit thành công, submit thất bại, và ẩn/hiện mật khẩu
- `DrugSelector`: kiểm tra tìm thuốc, chọn thuốc, và xóa thuốc đã chọn
- `EvaluationPage`: kiểm tra trạng thái thiếu dữ liệu, gọi API AI, và hiển thị kết quả rủi ro

### 5. Kịch bản kiểm thử tiêu biểu

#### Kịch bản 1: Đăng nhập thành công
- **Mục tiêu:** xác minh người dùng có thể đăng nhập bằng thông tin hợp lệ.
- **Phương pháp:** black-box và white-box.
- **Dữ liệu vào:** email hợp lệ, mật khẩu đúng.
- **Các bước thực hiện:**
  1. Mở trang đăng nhập.
  2. Nhập email và mật khẩu.
  3. Nhấn nút `Đăng nhập`.
- **Kết quả mong đợi:** hệ thống xác thực thành công và chuyển hướng sang dashboard.

#### Kịch bản 2: Đăng nhập thất bại
- **Mục tiêu:** xác minh hệ thống xử lý đúng khi sai thông tin đăng nhập.
- **Phương pháp:** black-box và white-box.
- **Dữ liệu vào:** email hoặc mật khẩu không hợp lệ.
- **Các bước thực hiện:**
  1. Mở trang đăng nhập.
  2. Nhập sai thông tin.
  3. Nhấn nút `Đăng nhập`.
- **Kết quả mong đợi:** hệ thống hiển thị thông báo lỗi và không cho vào dashboard.

#### Kịch bản 3: Tìm kiếm thuốc
- **Mục tiêu:** xác minh chức năng gợi ý thuốc theo từ khóa.
- **Phương pháp:** black-box và white-box.
- **Dữ liệu vào:** từ khóa có ít nhất 2 ký tự, ví dụ `pa`.
- **Các bước thực hiện:**
  1. Mở màn hình tìm kiếm thuốc.
  2. Nhập từ khóa.
  3. Chọn thuốc từ danh sách gợi ý.
- **Kết quả mong đợi:** danh sách thuốc phù hợp được hiển thị và thuốc được thêm vào danh sách chọn.

#### Kịch bản 4: Đánh giá thuốc bằng AI
- **Mục tiêu:** xác minh hệ thống thực hiện đánh giá AI khi chọn đủ bệnh nhân và thuốc.
- **Phương pháp:** black-box và white-box.
- **Dữ liệu vào:** một bệnh nhân, một loại thuốc.
- **Các bước thực hiện:**
  1. Chọn bệnh nhân.
  2. Chọn thuốc.
  3. Nhấn `Lưu vào hồ sơ`.
- **Kết quả mong đợi:** hệ thống gửi yêu cầu tới AI service và hiển thị kết quả đánh giá.

#### Kịch bản 5: Thiếu dữ liệu đầu vào
- **Mục tiêu:** xác minh hệ thống ngăn người dùng thực hiện đánh giá khi chưa đủ điều kiện.
- **Phương pháp:** black-box và white-box.
- **Dữ liệu vào:** chưa chọn bệnh nhân hoặc chưa chọn thuốc.
- **Các bước thực hiện:**
  1. Mở màn hình đánh giá.
  2. Không chọn đủ dữ liệu.
  3. Quan sát trạng thái nút và thông báo hệ thống.
- **Kết quả mong đợi:** nút đánh giá bị vô hiệu hóa và hệ thống không gửi yêu cầu không hợp lệ.

### 6. Bảng test case chi tiết

| ID | Chức năng | Mục tiêu | Dữ liệu test | Kết quả mong đợi |
|---|---|---|---|---|
| TC-LOGIN-01 | Login | Đăng nhập thành công | Email hợp lệ, mật khẩu đúng | Chuyển sang dashboard |
| TC-LOGIN-02 | Login | Sai email | Email không tồn tại, mật khẩu đúng | Hiện lỗi đăng nhập |
| TC-LOGIN-03 | Login | Sai mật khẩu | Email đúng, mật khẩu sai | Hiện lỗi đăng nhập |
| TC-LOGIN-04 | Login | Email sai định dạng | `abc` | Hiện lỗi định dạng email |
| TC-LOGIN-05 | Login | Mật khẩu trống | Email hợp lệ, password rỗng | Không cho submit hoặc hiện lỗi bắt buộc nhập |
| TC-LOGIN-06 | Login | Cả form trống | Trống toàn bộ | Không cho submit |
| TC-LOGIN-07 | Login | Hiện/ẩn mật khẩu | Nhập bất kỳ mật khẩu nào | Chuyển đổi giữa `password` và `text` |
| TC-LOGIN-08 | Login | Giữ trạng thái checkbox | Chọn/bỏ chọn `Duy trì trạng thái đăng nhập` | Checkbox thay đổi đúng |
| TC-DRUG-01 | Tìm thuốc | Tìm thuốc với từ khóa hợp lệ | `para` | Hiển thị danh sách thuốc phù hợp |
| TC-DRUG-02 | Tìm thuốc | Từ khóa quá ngắn | `p` | Không gọi tìm kiếm |
| TC-DRUG-03 | Tìm thuốc | Không tìm thấy thuốc | Từ khóa không tồn tại | Hiện thông báo không tìm thấy |
| TC-DRUG-04 | Tìm thuốc | Chọn thuốc từ gợi ý | Chọn `Paracetamol` | Thuốc được thêm vào danh sách |
| TC-DRUG-05 | Tìm thuốc | Chọn đúng dosage | Thuốc có strength/recommendedDose | Hiển thị liều dùng đúng |
| TC-DRUG-06 | Tìm thuốc | Xóa thuốc đã chọn | Bấm nút xóa trên thẻ thuốc | Thuốc bị xóa khỏi danh sách |
| TC-DRUG-07 | Tìm thuốc | Tìm kiếm nhiều lần | Đổi từ khóa liên tục | Kết quả cập nhật theo từ khóa mới |
| TC-DRUG-08 | Tìm thuốc | Danh sách rỗng | Chưa thêm thuốc nào | Hiện trạng thái trống |
| TC-AI-01 | AI Evaluation | Đánh giá thành công | Chọn bệnh nhân + thuốc | Hiển thị kết quả AI |
| TC-AI-02 | AI Evaluation | Thiếu bệnh nhân | Chỉ chọn thuốc | Nút bị disable / hiện cảnh báo phù hợp |
| TC-AI-03 | AI Evaluation | Thiếu thuốc | Chỉ chọn bệnh nhân | Nút bị disable / hiện cảnh báo phù hợp |
| TC-AI-04 | AI Evaluation | Rủi ro thấp | AI trả `low` | Hiện thông báo an toàn |
| TC-AI-05 | AI Evaluation | Rủi ro trung bình | AI trả `medium` | Hiện cảnh báo trung bình |
| TC-AI-06 | AI Evaluation | Rủi ro cao | AI trả `high` | Hiện cảnh báo nguy cơ cao |
| TC-AI-07 | AI Evaluation | Backend lỗi | API trả lỗi | Hiện thông báo thất bại |
| TC-AI-08 | AI Evaluation | Trạng thái đang xử lý | Gửi yêu cầu đánh giá | Hiện loading/progress |

---

## Kết luận kiểm thử

Kết quả kiểm thử cho thấy các chức năng trọng tâm của hệ thống MediAI đã được xác minh ở hai mức độ khác nhau. Ở mức hộp trắng, các unit test giúp kiểm tra tính đúng đắn của logic xử lý trong những thành phần quan trọng như đăng nhập, tìm kiếm thuốc và đánh giá AI. Ở mức hộp đen, các test case mô phỏng hành vi người dùng đã xác nhận rằng hệ thống phản hồi phù hợp với các tình huống sử dụng thực tế, bao gồm nhập dữ liệu hợp lệ, nhập thiếu dữ liệu và xử lý lỗi từ máy chủ.

Từ kết quả này có thể kết luận rằng cách tiếp cận kết hợp giữa kiểm thử hộp trắng và hộp đen là phù hợp với dự án MediAI, vì vừa đảm bảo chất lượng kỹ thuật của mã nguồn, vừa phản ánh đúng yêu cầu nghiệp vụ và trải nghiệm sử dụng của người dùng cuối.

## Đánh giá ưu nhược điểm

### Ưu điểm

- Dễ triển khai trong môi trường Vite + React + TypeScript.
- Vitest cho tốc độ chạy nhanh, cấu hình gọn và phù hợp với bài tập môn học.
- Manual test case đơn giản, dễ trình bày và dễ demo trước giảng viên.
- Phạm vi kiểm thử tập trung vào các chức năng quan trọng nhất của hệ thống.
- Có thể mở rộng thêm test tự động khi cần nâng cấp chất lượng dự án.

### Nhược điểm

- Manual test case phụ thuộc vào thao tác người thực hiện nên chưa tự động hóa hoàn toàn.
- Bộ unit test hiện tại mới tập trung vào các luồng chính, chưa bao phủ toàn bộ hệ thống.
- Các mock dữ liệu trong test chưa phản ánh đầy đủ mọi tình huống biên phức tạp.
- Chưa áp dụng end-to-end testing ở mức đầy đủ, nên vẫn cần kiểm thử tích hợp nếu muốn đánh giá sâu hơn luồng liên kết giữa frontend, backend và AI service.

### Hướng phát triển tiếp theo

- Bổ sung thêm test cho các trường hợp biên và lỗi mạng.
- Tăng mức độ tự động hóa bằng Playwright hoặc Cypress.
- Tách thêm các hàm xử lý nghiệp vụ để unit test dễ viết và dễ bảo trì hơn.

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
- **3 nhóm tài khoản** với các vai trò khác nhau (Doctor, Admin, Pharmacist)

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
