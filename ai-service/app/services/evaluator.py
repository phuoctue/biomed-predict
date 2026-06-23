from app.core.llm import build_prompt, call_llm
from app.schemas.evaluation import EvaluationRequest, EvaluationResponse


# Drug-specific knowledge base
DRUG_WARNINGS = {
    "Aspirin": [
        "Check for bleeding disorders before prescription.",
        "Monitor for gastrointestinal bleeding risk.",
        "Avoid in patients with active peptic ulcer disease."
    ],
    "Omeprazole": [
        "May increase risk of C. difficile infection with long-term use.",
        "Monitor magnesium levels in long-term therapy.",
        "Check for potential drug interactions with clopidogrel."
    ],
    "Warfarin": [
        "Requires regular INR monitoring.",
        "High risk of bleeding - avoid NSAIDs.",
        "Multiple drug-drug interactions possible."
    ],
    "Metformin": [
        "Check renal function before initiating therapy.",
        "Risk of lactic acidosis in renal impairment.",
        "Hold before contrast procedures."
    ],
    "Digoxin": [
        "Narrow therapeutic window - monitor levels.",
        "Check potassium and magnesium levels.",
        "Adjust dose in renal impairment."
    ]
}

DRUG_ALTERNATIVES = {
    "Aspirin": [
        "Consider Clopidogrel for antiplatelet therapy",
        "Evaluate need for gastric protection with PPI"
    ],
    "Omeprazole": [
        "Consider H2 blocker (Ranitidine) if appropriate",
        "Evaluate step-down therapy after 8 weeks"
    ],
    "Warfarin": [
        "Consider newer anticoagulants (DOACs) if eligible",
        "Discuss risks/benefits with patient"
    ],
    "Metformin": [
        "Consider SGLT2 inhibitors if contraindicated",
        "Sulfonylureas as alternative for T2DM"
    ],
    "Digoxin": [
        "Consider beta-blockers for rate control",
        "Calcium channel blockers as alternative"
    ]
}


async def evaluate_medication(payload: EvaluationRequest) -> EvaluationResponse:
    prompt = build_prompt(payload.model_dump(), "evaluate medication suitability")
    llm_text = await call_llm(prompt)

    # Get drug-specific warnings and alternatives
    drug_name = payload.drug_name
    warnings = DRUG_WARNINGS.get(drug_name, [
        "Check renal function before final prescription.",
        "Review potential drug-drug interactions with the full medication list."
    ])
    
    alternatives = DRUG_ALTERNATIVES.get(drug_name, [
        "Discuss a safer substitute with the formulary team",
        "Verify dose adjustment options"
    ])

    # Calculate risk based on patient factors
    has_allergy = bool(payload.allergies)
    patient_age = payload.patient_age or 0
    
    # Base score
    score = 92 if not has_allergy else 68
    
    # Adjust for age (elderly patients)
    if patient_age >= 65:
        score -= 10
    
    # Adjust for specific drugs
    if drug_name in ["Warfarin", "Digoxin"]:
        score -= 15  # High-risk drugs
    elif drug_name in ["Aspirin", "Metformin"]:
        score -= 5
    
    # Ensure score is within 0-100
    score = max(0, min(100, score))
    
    risk_level = "low" if score >= 85 else "moderate" if score >= 70 else "high"

    return EvaluationResponse(
        suitability_score=score,
        risk_level=risk_level,
        summary=f"{drug_name} was reviewed against the provided context. Score: {score}/100",
        warnings=warnings,
        alternatives=alternatives,
        raw_explanation=llm_text
    )

