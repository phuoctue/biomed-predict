from pydantic import BaseModel, Field


class EvaluationRequest(BaseModel):
    patient_id: str | None = None
    patient_age: int | None = Field(default=None, ge=0, le=120)
    diagnosis: str
    drug_name: str
    dosage: str | None = None
    allergies: list[str] = Field(default_factory=list)
    labs: dict[str, str] = Field(default_factory=dict)


class EvaluationResponse(BaseModel):
    suitability_score: int
    risk_level: str
    summary: str
    warnings: list[str]
    alternatives: list[str]
    raw_explanation: str


class ExplainRequest(BaseModel):
    result: str
    target_language: str = "vi"


class ExplainResponse(BaseModel):
    explanation: str

