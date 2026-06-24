from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.api.router import api_router
from app.core.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="MediAI AI Service",
    version="0.1.0",
    description="FastAPI service for medication evaluation and explanation"
)

# Log settings on startup
logger.info(f"Starting MediAI AI Service...")
logger.info(f"LLM Provider: {settings.llm_provider}")
logger.info(f"LLM Model: {settings.llm_model}")
logger.info(f"LLM API Key present: {bool(settings.llm_api_key)}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(api_router, prefix="/api")


@app.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "ai-service"}
