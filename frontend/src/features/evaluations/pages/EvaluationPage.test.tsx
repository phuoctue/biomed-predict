import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderWithQueryClient } from "@/test/render-with-query";

const apiPostMock = vi.fn();
const patientClickMock = vi.fn();
const drugClickMock = vi.fn();

vi.mock("@/hooks/usePatients", () => ({
  usePatients: () => ({
    patients: [{ id: "p1", fullName: "Nguyen Van A", diagnosis: "Tăng huyết áp" }],
    loading: false,
  }),
}));

vi.mock("@/lib/api-client", () => ({
  apiClient: {
    post: (...args: unknown[]) => apiPostMock(...args),
  },
}));

vi.mock("@/components/evaluations/PatientInfo", () => ({
  PatientInfo: ({ patients, onSelect }: any) => (
    <div>
      <div>PatientInfo Mock</div>
      {patients.map((patient: any) => (
        <button key={patient.id} type="button" onClick={() => onSelect(patient)}>
          Chọn {patient.name}
        </button>
      ))}
      <button type="button" onClick={() => patientClickMock()}>
        patient-test-hook
      </button>
    </div>
  ),
}));

vi.mock("@/components/evaluations/DrugSelector", () => ({
  DrugSelector: ({ onAdd, onRemove }: any) => (
    <div>
      <button type="button" onClick={() => onAdd({ id: "d1", name: "Paracetamol", dosage: "500mg" })}>
        Thêm Paracetamol
      </button>
      <button type="button" onClick={() => onRemove("d1")}>
        Xóa Paracetamol
      </button>
      <button type="button" onClick={() => drugClickMock()}>
        drug-test-hook
      </button>
    </div>
  ),
}));

vi.mock("@/components/evaluations/ClinicalSummary", () => ({
  ClinicalSummary: ({ aiLogic, recommendation, riskLevel, drugName }: any) => (
    <div>
      <div>ClinicalSummary Mock</div>
      <div>{aiLogic}</div>
      <div>{recommendation}</div>
      {riskLevel === "high" && <div>Rủi ro Cao: {drugName}</div>}
      {riskLevel === "medium" && <div>Rủi ro Trung bình: {drugName}</div>}
    </div>
  ),
}));

vi.mock("@/components/evaluations/RiskAlert", () => ({
  RiskAlert: ({ title }: any) => <div>{title}</div>,
}));

vi.mock("@/components/evaluations/ActionFooter", () => ({
  ActionFooter: () => <div>ActionFooter Mock</div>,
}));

vi.mock("@/components/evaluations/AIAnalysisStatus", () => ({
  AIAnalysisStatus: ({ progress }: { progress: number }) => <div>Progress: {progress}</div>,
}));

import { EvaluationPage } from "./EvaluationPage";

describe("EvaluationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("disables evaluation button when patient or drug is missing", () => {
    renderWithQueryClient(<EvaluationPage />);

    expect(screen.getByRole("button", { name: "Lưu vào hồ sơ" })).toBeDisabled();
    expect(apiPostMock).not.toHaveBeenCalled();
  });

  it("calls AI evaluation API after selecting patient and drug", async () => {
    apiPostMock.mockResolvedValueOnce({
      data: {
        content: {
          drugName: "Paracetamol",
          dosage: "500mg",
          riskLevel: "low",
          summary: "An toàn",
          alternatives: ["Theo dõi định kỳ"],
          warnings: [],
        },
      },
    });

    renderWithQueryClient(<EvaluationPage />);

    await userEvent.click(screen.getByRole("button", { name: "Chọn Nguyen Van A" }));
    await userEvent.click(screen.getByRole("button", { name: "Thêm Paracetamol" }));
    await userEvent.click(screen.getByRole("button", { name: "Lưu vào hồ sơ" }));

    await waitFor(() => {
      expect(apiPostMock).toHaveBeenCalledWith("/ai/evaluate", {
        patientId: "p1",
        drugId: "d1",
        dosage: "500mg",
        labs: {
          diagnosis: "Tăng huyết áp",
        },
      });
    });

    expect(await screen.findByText("An toàn")).toBeInTheDocument();
  });

  it("shows risk title when AI returns high risk", async () => {
    apiPostMock.mockResolvedValueOnce({
      data: {
        data: {
          drugName: "Warfarin",
          dosage: "5mg",
          riskLevel: "high",
          summary: "Tương tác nguy hiểm",
          alternatives: ["Xem xét thay thế"],
          warnings: ["Theo dõi INR"],
        },
      },
    });

    renderWithQueryClient(<EvaluationPage />);

    await userEvent.click(screen.getByRole("button", { name: "Chọn Nguyen Van A" }));
    await userEvent.click(screen.getByRole("button", { name: "Thêm Paracetamol" }));
    await userEvent.click(screen.getByRole("button", { name: "Lưu vào hồ sơ" }));

    expect(await screen.findByText("Rủi ro Cao: Warfarin")).toBeInTheDocument();
  });
});
