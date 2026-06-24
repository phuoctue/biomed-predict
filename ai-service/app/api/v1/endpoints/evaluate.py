from fastapi import APIRouter
import logging

from app.schemas.evaluation import EvaluationRequest, EvaluationResponse
from app.services.evaluator import evaluate_medication

router = APIRouter(tags=["evaluate"])
logger = logging.getLogger(__name__)


@router.post("/evaluate", response_model=EvaluationResponse)
async def evaluate(payload: EvaluationRequest) -> EvaluationResponse:
    logger.info(f"Received evaluation request for drug: {payload.drug_name}, patient age: {payload.patient_age}")
    result = await evaluate_medication(payload)
    logger.info(f"Evaluation completed: score={result.suitability_score}, risk={result.risk_level}")
    return result

