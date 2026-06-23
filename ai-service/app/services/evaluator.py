from app.core.llm import build_prompt, call_llm
from app.schemas.evaluation import EvaluationRequest, EvaluationResponse
import json
import re


async def evaluate_medication(payload: EvaluationRequest) -> EvaluationResponse:
    # Build detailed prompt for LLM
    prompt = f"""You are an expert clinical pharmacist AI assistant. Analyze this medication for a patient and provide a structured evaluation.

Patient Information:
- Age: {payload.patient_age or 'Unknown'}
- Diagnosis: {payload.diagnosis}
- Allergies: {', '.join(payload.allergies) if payload.allergies else 'None'}
- Current Medications: None listed

Medication to Evaluate:
- Drug: {payload.drug_name}
- Dosage: {payload.dosage}

Please provide:
1. Suitability Score (0-100): How suitable is this drug for this patient?
2. Risk Level: low, moderate, or high
3. Summary: Brief clinical summary in Vietnamese (2-3 sentences)
4. Warnings: List 3-5 specific clinical warnings for this drug-patient combination
5. Alternatives: List 2-3 alternative medications or approaches

Format your response as JSON:
{{
  "suitability_score": <number>,
  "risk_level": "<low|moderate|high>",
  "summary": "<vietnamese summary>",
  "warnings": ["<warning 1>", "<warning 2>", ...],
  "alternatives": ["<alternative 1>", "<alternative 2>", ...]
}}

Be specific to this patient's age, diagnosis, and allergies. Consider drug interactions, contraindications, and age-related factors."""

    # Call LLM
    llm_response = await call_llm(prompt)
    
    # Try to parse LLM JSON response
    try:
        # Extract JSON from response (handle markdown code blocks)
        json_match = re.search(r'```json\s*(\{.*?\})\s*```', llm_response, re.DOTALL)
        if json_match:
            llm_data = json.loads(json_match.group(1))
        else:
            # Try direct JSON parse
            json_match = re.search(r'\{.*\}', llm_response, re.DOTALL)
            if json_match:
                llm_data = json.loads(json_match.group(0))
            else:
                raise ValueError("No JSON found in LLM response")
        
        return EvaluationResponse(
            suitability_score=llm_data.get("suitability_score", 70),
            risk_level=llm_data.get("risk_level", "moderate"),
            summary=llm_data.get("summary", f"{payload.drug_name} đã được đánh giá dựa trên hồ sơ bệnh nhân."),
            warnings=llm_data.get("warnings", ["Theo dõi các tác dụng phụ", "Tương tác thuốc cần được xem xét"]),
            alternatives=llm_data.get("alternatives", ["Tham khảo ý kiến chuyên gia", "Xem xét thuốc thay thế"]),
            raw_explanation=llm_response
        )
    
    except Exception as e:
        # Fallback to rule-based if LLM parsing fails
        print(f"LLM parsing failed: {e}")
        print(f"LLM Response: {llm_response[:500]}")
        
        # Fallback logic
        has_allergy = bool(payload.allergies)
        patient_age = payload.patient_age or 0
        
        score = 92 if not has_allergy else 68
        if patient_age >= 65:
            score -= 10
        
        score = max(0, min(100, score))
        risk_level = "low" if score >= 85 else "moderate" if score >= 70 else "high"
        
        return EvaluationResponse(
            suitability_score=score,
            risk_level=risk_level,
            summary=f"{payload.drug_name} đã được đánh giá. Vui lòng xem xét thêm thông tin lâm sàng.",
            warnings=[
                "Kiểm tra chức năng thận trước khi kê đơn",
                "Theo dõi tương tác thuốc với danh sách thuốc đầy đủ"
            ],
            alternatives=[
                "Tham khảo ý kiến dược sĩ lâm sàng",
                "Xem xét điều chỉnh liều lượng"
            ],
            raw_explanation=llm_response
        )

