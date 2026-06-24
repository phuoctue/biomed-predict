import React, { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { apiClient } from "../../lib/api-client";
import { type Patient } from "../../hooks/usePatients";

interface EditPatientProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSuccess: () => void;
}

export const EditPatientModal = ({ isOpen, onClose, patient, onSuccess }: EditPatientProps) => {
  const mrnRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLInputElement>(null);
  const allergyRef = useRef<HTMLInputElement>(null);
  const latestTestNameRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const updatePatient = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      await apiClient.put(`/patients/${patient.id}`, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      await updatePatient.mutateAsync({
        mrn: mrnRef.current?.value || patient.mrn,
        fullName: patient.fullName,
        dateOfBirth: patient.dateOfBirth,
        sex: patient.sex,
        citizenId: patient.citizenId,
        phone: patient.phone,
        address: patient.address,
        heightCm: patient.heightCm,
        weightKg: patient.weightKg,
        bloodType: patient.bloodType,
        insuranceNumber: patient.insuranceNumber,
        emergencyContactName: patient.emergencyContactName,
        emergencyContactPhone: patient.emergencyContactPhone,
        emergencyContactRelation: patient.emergencyContactRelation,
        diagnosis: statusRef.current?.value || "",
        allergies: allergyRef.current?.value || "",
      });
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Không thể cập nhật";
      alert(msg);
    }
  };

  const inputStyle =
    "mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
  const labelStyle = "mb-1 mt-3 block text-xs font-bold text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Sửa thông tin bệnh nhân</h2>
          <button onClick={onClose} className="text-slate-400 transition-colors hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-1">
          <label className={labelStyle}>Mã HS</label>
          <input ref={mrnRef} className={inputStyle} defaultValue={patient.mrn ?? ""} />

          <label className={labelStyle}>Trạng thái</label>
          <input ref={statusRef} className={inputStyle} defaultValue={patient.diagnosis ?? ""} />

          <label className={labelStyle}>Dị ứng</label>
          <input ref={allergyRef} className={inputStyle} defaultValue={patient.allergies ?? ""} />

          <label className={labelStyle}>Xét nghiệm gần nhất</label>
          <input
            ref={latestTestNameRef}
            className={`${inputStyle} bg-slate-50 text-slate-500 cursor-not-allowed`}
            defaultValue={patient.latestTestName ?? ""}
            disabled
          />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl bg-slate-100 px-6 py-2 text-sm font-bold text-slate-600 transition-all hover:bg-slate-200">
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={updatePatient.isPending}
            className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white transition-all shadow-md shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-70"
          >
            {updatePatient.isPending ? "Đang lưu..." : "Lưu thông tin"}
          </button>
        </div>
      </div>
    </div>
  );
};
