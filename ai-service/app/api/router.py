from fastapi import APIRouter

from app.api.v1.endpoints.evaluate import router as evaluate_router
from app.api.v1.endpoints.explain import router as explain_router

api_router = APIRouter()
api_router.include_router(evaluate_router, prefix="/v1")
api_router.include_router(explain_router, prefix="/v1")

