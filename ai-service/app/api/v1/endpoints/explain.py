from fastapi import APIRouter

from app.schemas.evaluation import ExplainRequest, ExplainResponse
from app.services.explainer import explain_result

router = APIRouter(tags=["explain"])


@router.post("/explain", response_model=ExplainResponse)
async def explain(payload: ExplainRequest) -> ExplainResponse:
    return await explain_result(payload)

