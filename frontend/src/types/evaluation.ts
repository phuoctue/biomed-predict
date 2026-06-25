export interface PatientInfo {
  name: string;
  age: number;
  gender: string;
  patientId: string;
  allergy: string;
  diagnosis: string;
  evaluatedAt: string;
}

export interface Interaction {
  id: number;
  drugPair: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  description: string;
  riskAlert: string;
  recommendation: string;
}

export interface PrescribedDrug {
  id: number;
  name: string;
  activeIngredient: string;
  dosage: string;
  frequency: string;
  indication: string;
  status: "ACTIVE" | "WARNING";
  statusText: string;
}