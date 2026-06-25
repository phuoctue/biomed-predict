from app.core.llm import build_prompt, call_llm
from app.schemas.evaluation import ExplainRequest, ExplainResponse


async def explain_result(payload: ExplainRequest) -> ExplainResponse:
    prompt = build_prompt(payload.model_dump(), "explain clinical evaluation result")
    explanation = await call_llm(prompt)
    return ExplainResponse(explanation=explanation)

