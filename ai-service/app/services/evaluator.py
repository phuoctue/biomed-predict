from app.core.llm import build_prompt, call_llm
from app.schemas.evaluation import EvaluationRequest, EvaluationResponse


async def evaluate_medication(payload: EvaluationRequest) -> EvaluationResponse:
    prompt = build_prompt(payload.model_dump(), "evaluate medication suitability")
    llm_text = await call_llm(prompt)

    has_allergy = bool(payload.allergies)
    score = 92 if not has_allergy else 68
    risk_level = "low" if score >= 85 else "moderate" if score >= 70 else "high"

    return EvaluationResponse(
        suitability_score=score,
        risk_level=risk_level,
        summary=f"{payload.drug_name} was reviewed against the provided context.",
        warnings=[
            "Check renal function before final prescription.",
            "Review potential drug-drug interactions with the full medication list."
        ],
        alternatives=["Discuss a safer substitute with the formulary team", "Verify dose adjustment options"],
        raw_explanation=llm_text
    )

