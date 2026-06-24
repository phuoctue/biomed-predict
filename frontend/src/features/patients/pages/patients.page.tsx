import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Loader2, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { AddPatientModal } from "@/components/Patients/AddPatient";
import { EditPatientModal } from "@/components/Patients/EditPatient";
import { usePatients, type Patient } from "@/hooks/usePatients";
import { patientAPI } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const PatientsPage = () => {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(0);
  const size = 10;

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedKeyword(keyword), 400);
    return () => window.clearTimeout(id);
  }, [keyword]);

  const { patients, loading, totalPages, totalElements, refetch } = usePatients({
    page,
    size,
    keyword: debouncedKeyword,
  });

  const deletePatient = useMutation({
    mutationFn: async (patient: Patient) => {
      await patientAPI.delete(patient.id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  const visiblePatients = useMemo(() => patients, [patients]);

  const calculateAge = (dobString?: string): number => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleEditClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (patient: Patient) => {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa bệnh nhân "${patient.fullName}" không?`);
    if (!confirmed) return;

    try {
      await deletePatient.mutateAsync(patient);
      await refetch();
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.response?.data?.error || err.message
        : err instanceof Error
          ? err.message
          : "Không thể xóa bệnh nhân.";
      window.alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-sans antialiased text-slate-600">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Hồ sơ bệnh nhân</h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý và đánh giá tình trạng lâm sàng của{" "}
            <span className="font-semibold text-slate-700">{totalElements}</span> bệnh nhân từ hệ thống.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0061f2] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm bệnh nhân mới</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-white p-4 md:flex-row md:items-center">
          <div className="flex w-fit items-center gap-1 rounded-xl bg-slate-100/80 p-1">
            {["all", "inpatient", "outpatient"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab === "all" ? "Tất cả" : tab === "inpatient" ? "Nội trú" : "Ngoại trú"}
              </button>
            ))}
          </div>

          <div className="flex w-full max-w-sm items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-1.5">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(0);
              }}
              className="w-full bg-transparent text-xs font-medium outline-none text-slate-800 placeholder:text-slate-400"
              placeholder="Tìm kiếm theo tên bệnh nhân hoặc mã số..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-3">Tên bệnh nhân</th>
                <th className="px-4 py-3">Mã HS</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Dị ứng</th>
                <th className="px-4 py-3">Xét nghiệm gần nhất</th>
                <th className="px-6 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="bg-white py-16 text-center text-slate-400">
                    <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-blue-600" />
                    <span className="text-xs font-semibold text-slate-500">Đang đồng bộ hồ sơ bệnh án từ máy chủ...</span>
                  </td>
                </tr>
              ) : visiblePatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="bg-white py-16 text-center text-slate-400">
                    <Users className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                    <span className="block text-slate-500">Không tìm thấy bản ghi hồ sơ nào trên cơ sở dữ liệu.</span>
                  </td>
                </tr>
              ) : (
                visiblePatients.map((patient) => (
                  <tr key={patient.id} className="bg-white transition-colors hover:bg-slate-50/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-[11px] font-bold text-blue-600">
                          {patient.fullName ? patient.fullName.split(" ").pop()?.substring(0, 2).toUpperCase() : "BN"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{patient.fullName || "Chưa cập nhật"}</p>
                          <p className="mt-0.5 text-[11px] text-slate-400">
                            {patient.sex === "Male" || patient.sex === "Nam" ? "Nam" : "Nữ"} · {calculateAge(patient.dateOfBirth)} tuổi
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-slate-500">{patient.mrn || patient.citizenId || `#BN-${String(patient.id).padStart(3, "0")}`}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${patient.status === "Ổn định" ? "border border-emerald-100 bg-emerald-50 text-emerald-600" : "border border-amber-100 bg-amber-50 text-amber-600"}`}>
                        {patient.status || "Theo dõi"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {(patient.allergies || patient.allergy) && (patient.allergies || patient.allergy) !== "Không có" ? (
                        <span className="rounded border border-rose-100 bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-600">
                          {patient.allergies || patient.allergy}
                        </span>
                      ) : (
                        <span className="font-normal text-slate-400">Không có</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {patient.latestTestName ? (
                        <div>
                          <span className={patient.latestTestName === "ALT" ? "font-bold text-rose-500" : "font-bold text-slate-700"}>
                            {patient.latestTestName}: {patient.latestTestValue}
                          </span>
                          <p className="mt-0.5 text-[10px] text-slate-400">{patient.latestTestDate || "Gần đây"}</p>
                        </div>
                      ) : (
                        <span className="font-normal text-slate-400">Chưa có chỉ số</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditClick(patient)}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(patient)}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                          aria-label={`Xóa ${patient.fullName}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalElements > 0 ? (
          <div className="flex items-center justify-between border-t border-slate-100 bg-white p-4 text-xs font-medium text-slate-500">
            <div>
              Hiển thị <span className="font-semibold text-slate-800">{page * size + 1}</span> -{" "}
              <span className="font-semibold text-slate-800">{Math.min((page + 1) * size, totalElements)}</span> của{" "}
              <span className="font-semibold text-slate-800">{totalElements.toLocaleString()}</span> bệnh nhân
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-lg border border-slate-200 bg-white p-1 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index)}
                  className={`h-7 w-7 rounded-lg text-xs font-bold transition-colors ${
                    page === index ? "bg-blue-600 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="rounded-lg border border-slate-200 bg-white p-1 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={async () => {
          setIsAddModalOpen(false);
          await refetch();
        }}
      />

      {selectedPatient ? (
        <EditPatientModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPatient(null);
          }}
          patient={selectedPatient}
          onSuccess={async () => {
            setIsEditModalOpen(false);
            setSelectedPatient(null);
            await refetch();
          }}
        />
      ) : null}
    </div>
  );
};
