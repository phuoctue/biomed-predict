import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { apiClient } from "../../lib/api-client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddPatientModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const queryClient = useQueryClient();
  const createPatient = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      await apiClient.post("/patients", payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const raw = Object.fromEntries(formData.entries());
    try {
      await createPatient.mutateAsync({
        fullName: raw.fullName,
        mrn: raw.mrn,
        sex: raw.sex || "Unknown",
        dateOfBirth: raw.dateOfBirth || null,
        heightCm: raw.heightCm ? Number(raw.heightCm) : null,
        weightKg: raw.weightKg ? Number(raw.weightKg) : null,
        bloodType: raw.bloodType || null,
        citizenId: raw.citizenId || null,
        allergies: raw.allergy || null,
        diagnosis: raw.latestTestName || null,
      });
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Không thể thêm bệnh nhân";
      alert(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Thêm bệnh nhân mới</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700">Họ và tên</label>
              <input
                name="fullName"
                type="text"
                required
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Vui lòng nhập họ và tên!")}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
                placeholder="Nhập họ tên"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Mã HS / MRN</label>
              <input
                name="mrn"
                type="text"
                required
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Vui lòng nhập mã hồ sơ!")}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
                placeholder="BN-..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Ngày sinh</label>
              <input
                name="dateOfBirth"
                type="date"
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Giới tính</label>
              <select
                name="sex"
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm bg-white"
              >
                <option value="Unknown">Không xác định</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Nhóm máu</label>
              <select
                name="bloodType"
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm bg-white"
              >
                <option value="">Chưa rõ</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Chiều cao (cm)</label>
              <input
                name="heightCm"
                type="number"
                min="0"
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
                placeholder="VD: 170"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Cân nặng (kg)</label>
              <input
                name="weightKg"
                type="number"
                min="0"
                step="0.1"
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
                placeholder="VD: 65.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Trạng thái</label>
              <input
                name="status"
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
                placeholder="Ví dụ: Ổn định"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Dị ứng</label>
              <input
                name="allergy"
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
                placeholder="Nhập thông tin dị ứng"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700">Xét nghiệm / Chẩn đoán gần nhất</label>
              <input
                name="latestTestName"
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
                placeholder="Tên xét nghiệm & chỉ số / Chẩn đoán"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg bg-slate-100 py-2 font-bold text-slate-600 hover:bg-slate-200">
              Hủy
            </button>
            <button type="submit" disabled={createPatient.isPending} className="flex-1 rounded-lg bg-blue-600 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-70">
              {createPatient.isPending ? "Đang thêm..." : "Thêm bệnh nhân"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
