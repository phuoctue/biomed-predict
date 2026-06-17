from fastapi import APIRouter

from app.schemas.evaluation import EvaluationRequest, EvaluationResponse
from app.services.evaluator import evaluate_medication

router = APIRouter(tags=["evaluate"])


@router.post("/evaluate", response_model=EvaluationResponse)
async def evaluate(payload: EvaluationRequest) -> EvaluationResponse:
    return await evaluate_medication(payload)

