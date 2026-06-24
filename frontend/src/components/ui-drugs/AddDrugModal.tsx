import { useState, type FormEvent } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { X, Pill, Tag, FileText, List, Package, Building2, ShieldAlert, Sparkles } from "lucide-react";
import { drugAPI } from "@/services/api";

type AddDrugModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

type DrugFormState = {
  code: string;
  name: string;
  genericName: string;
  drugGroup: string;
  dosageForm: string;
  strength: string;
  unit: string;
  manufacturer: string;
  usageInstructions: string;
  recommendedDose: string;
  sideEffects: string;
  storageCondition: string;
  status: string;
};

const initialForm: DrugFormState = {
  code: "",
  name: "",
  genericName: "",
  drugGroup: "",
  dosageForm: "",
  strength: "",
  unit: "",
  manufacturer: "",
  usageInstructions: "",
  recommendedDose: "",
  sideEffects: "",
  storageCondition: "",
  status: "ACTIVE",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const iconWrapClass = "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400";

export const AddDrugModal = ({ isOpen, onClose, onCreated }: AddDrugModalProps) => {
  const [form, setForm] = useState<DrugFormState>(initialForm);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const createDrug = useMutation({
    mutationFn: async (payload: DrugFormState) => {
      await drugAPI.create(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["drugs"] });
    },
  });

  if (!isOpen) return null;

  const update = (field: keyof DrugFormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetAndClose = () => {
    setForm(initialForm);
    setError("");
    onClose();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await createDrug.mutateAsync({
        ...form,
        status: form.status || "ACTIVE",
      });
      onCreated?.();
      resetAndClose();
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.response?.data?.error || err.message
        : err instanceof Error
          ? err.message
          : "Không thể thêm thuốc mới.";
      setError(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
      <div className="animate-in fade-in zoom-in duration-200 w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Thêm thuốc mới</h2>
            <p className="mt-1 text-sm text-slate-500">Tạo nhanh thuốc mới cho kho danh mục.</p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* same fields as before */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Mã thuốc</label>
              <div className="relative">
                <Tag size={18} className={iconWrapClass} />
                <input value={form.code} onChange={(e) => update("code")(e.target.value)} type="text" required className={inputClass} placeholder="VD: TH-001" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Tên thuốc</label>
              <div className="relative">
                <Pill size={18} className={iconWrapClass} />
                <input value={form.name} onChange={(e) => update("name")(e.target.value)} type="text" required className={inputClass} placeholder="VD: Paracetamol 500mg" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Hoạt chất</label>
              <div className="relative">
                <Sparkles size={18} className={iconWrapClass} />
                <input value={form.genericName} onChange={(e) => update("genericName")(e.target.value)} type="text" className={inputClass} placeholder="VD: Paracetamol" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Nhóm thuốc</label>
              <div className="relative">
                <List size={18} className={iconWrapClass} />
                <input value={form.drugGroup} onChange={(e) => update("drugGroup")(e.target.value)} type="text" className={inputClass} placeholder="VD: Giảm đau" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Dạng bào chế</label>
              <div className="relative">
                <Package size={18} className={iconWrapClass} />
                <input value={form.dosageForm} onChange={(e) => update("dosageForm")(e.target.value)} type="text" className={inputClass} placeholder="VD: Viên nén" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Hàm lượng</label>
              <input value={form.strength} onChange={(e) => update("strength")(e.target.value)} type="text" className={inputClass} placeholder="VD: 500mg" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Đơn vị</label>
              <div className="relative">
                <Package size={18} className={iconWrapClass} />
                <input value={form.unit} onChange={(e) => update("unit")(e.target.value)} type="text" className={inputClass} placeholder="VD: viên" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Nhà sản xuất</label>
              <div className="relative">
                <Building2 size={18} className={iconWrapClass} />
                <input value={form.manufacturer} onChange={(e) => update("manufacturer")(e.target.value)} type="text" className={inputClass} placeholder="VD: DHG Pharma" />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Hướng dẫn sử dụng</label>
            <div className="relative">
              <FileText size={18} className={iconWrapClass} />
              <textarea value={form.usageInstructions} onChange={(e) => update("usageInstructions")(e.target.value)} className={`${inputClass} min-h-[96px] pl-10`} placeholder="Nhập hướng dẫn sử dụng..." />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Liều khuyến nghị</label>
              <input value={form.recommendedDose} onChange={(e) => update("recommendedDose")(e.target.value)} type="text" className={inputClass} placeholder="VD: 1 viên x 2 lần/ngày" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Trạng thái</label>
              <select value={form.status} onChange={(e) => update("status")(e.target.value)} className={inputClass}>
                <option value="ACTIVE">Đang lưu hành</option>
                <option value="INACTIVE">Ngừng lưu hành</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Tác dụng phụ</label>
            <div className="relative">
              <ShieldAlert size={18} className={iconWrapClass} />
              <textarea value={form.sideEffects} onChange={(e) => update("sideEffects")(e.target.value)} className={`${inputClass} min-h-[88px] pl-10`} placeholder="Mô tả tác dụng phụ nếu có..." />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Điều kiện bảo quản</label>
            <textarea value={form.storageCondition} onChange={(e) => update("storageCondition")(e.target.value)} className={`${inputClass} min-h-[88px]`} placeholder="VD: Nơi khô ráo, tránh ánh sáng..." />
          </div>

          <div className="flex gap-3 pt-3">
            <button type="button" onClick={resetAndClose} className="flex-1 rounded-xl bg-slate-100 px-4 py-3 font-semibold text-slate-600 transition hover:bg-slate-200">
              Hủy
            </button>
            <button type="submit" disabled={createDrug.isPending} className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">
              {createDrug.isPending ? "Đang thêm..." : "Thêm thuốc"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
