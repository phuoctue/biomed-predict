# MediAI

Monorepo base for a medical AI platform focused on drugs, diseases, patient context, and explainable evaluation.

## Structure

```txt
medi-ai/
├── frontend/          # React + Vite + TypeScript
├── backend/           # Java 21 + Spring Boot 3 base
├── ai-service/        # Python 3.11+ + FastAPI
├── docker-compose.yml
├── .env.example
├── README.md
└── .gitignore
```

## What is already in place

- `frontend/` includes auth, protected routes, shell layout, sidebar, header, theme switch, axios client, and starter pages.
- `backend/` includes Spring Boot base structure, `pom.xml`, `application.yml`, `Dockerfile`, main class, and starter schema SQL.
- `ai-service/` includes FastAPI, `/evaluate`, `/explain`, environment-driven LLM config, and Docker support.
- `docker-compose.yml` runs `postgres`, `backend`, `ai-service`, and `frontend`.

## Setup

1. Copy env

```bash
copy .env.example .env
```

2. Install frontend deps

```bash
cd frontend
npm install
```

3. Run the frontend locally

```bash
npm run dev
```

4. Run the AI service locally

```bash
cd ../ai-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

5. Run the backend locally

```bash
cd ../backend
mvn spring-boot:run
```

6. Start everything with Docker

```bash
docker compose up --build
```

## Supabase PostgreSQL

For shared team data and easier deployment, point the backend to a Supabase PostgreSQL database.

1. Create a Supabase project.
2. Copy the PostgreSQL connection details from the Supabase dashboard.
3. Set these environment variables for the backend:

```bash
DATABASE_URL=jdbc:postgresql://db.<project-ref>.supabase.co:5432/postgres?sslmode=require
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<your_supabase_db_password>
```

4. Keep the backend `schema.sql` in place for local bootstrap, or switch to a migration tool later if you want stricter deployment control.

Recommended pool settings for cloud Postgres:

```bash
DB_POOL_MAX_SIZE=5
DB_POOL_MIN_IDLE=1
DB_POOL_CONNECTION_TIMEOUT_MS=30000
```

## One-command local start

Run this from the repository root on Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-dev.ps1
```

The script will:

- read existing env values from `.env` if present
- prompt for Supabase connection details if needed
- create the Python virtual environment for `ai-service` if missing
- install Python dependencies
- start the AI service and backend in the background

## Docker Compose

- `postgres` on `${POSTGRES_PORT:-5432}`
- `backend` on `${BACKEND_PORT:-8080}`
- `ai-service` on `${AI_SERVICE_PORT:-8000}`
- `frontend` on `${FRONTEND_PORT:-5173}`
- Frontend and AI service are mounted for live reload

## Initial schema

Core tables are defined in `backend/src/main/resources/db/schema.sql`:

- `users`
- `patients`
- `drugs`
- `evaluations`

## API hints

- Frontend expects `POST /api/auth/login` from the Java backend.
- AI service exposes `POST /api/v1/evaluate` and `POST /api/v1/explain`.
- Backend base exposes `GET /api/health`.
