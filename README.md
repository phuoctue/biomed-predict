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
