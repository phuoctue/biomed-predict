@echo off
cd /d "%~dp0ai-service"
echo Starting AI service on port 8000...
".venv\Scripts\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
