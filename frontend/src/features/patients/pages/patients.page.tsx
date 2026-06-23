import React, { useState, useEffect, useCallback } from "react";
import { apiClient } from "../../../lib/api-client";
import { 
  Plus, 
  Search,  
  Eye, 
  Pencil, 
  ChevronLeft, 
  ChevronRight, 
  Loader2,
  Users
} from "lucide-react";

// Import các component Modal
import { AddPatientModal } from '@/components/Patients/AddPatient';
import { EditPatientModal } from '@/components/Patients/EditPatient';

interface Patient {
  id: string;
  fullName: string;
  sex: string;
  dateOfBirth: string;
  mrn: string;
  citizenId?: string;
  phone: string;
  status?: string;
  allergies?: string;
  allergy?: string;
  latestTestName?: string;
  latestTestValue?: string;
  latestTestDate?: string;
}

export const PatientsPage = () => {
  // --- STATE QUẢN LÝ MODAL ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");

  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/patients", {
        params: {
          keyword: keyword || undefined,
          page: page,
          size: size,
          sort: "id,desc"
        }
      });

      if (response.data && response.data.success) {
        setPatients(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalElements(response.data.totalElements || 0);
      }
    } catch (error) {
      console.error("Lỗi khi kết nối đến máy chủ API /api/patients:", error);
      setPatients([]);
      setTotalElements(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [keyword, page, size]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPatients();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [fetchPatients]);

  const calculateAge = (dobString: string): number => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleEditClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans antialiased text-slate-600">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hồ sơ bệnh nhân</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý và đánh giá tình trạng lâm sàng của <span className="font-semibold text-slate-700">{totalElements}</span> bệnh nhân từ hệ thống.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#0061f2] hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm bệnh nhân mới</span>
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl w-fit">
            <button onClick={() => setActiveTab("all")} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>Tất cả</button>
            <button onClick={() => setActiveTab("inpatient")} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "inpatient" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>Nội trú</button>
            <button onClick={() => setActiveTab("outpatient")} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "outpatient" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>Ngoại trú</button>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-1.5 w-full max-w-sm">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input 
              type="text"
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setPage(0); }}
              className="w-full bg-transparent text-xs font-medium outline-none text-slate-800 placeholder:text-slate-400" 
              placeholder="Tìm kiếm theo tên bệnh nhân hoặc mã số..." 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-6">Tên bệnh nhân</th>
                <th className="py-3 px-4">Mã HS</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Dị ứng</th>
                <th className="py-3 px-4">Xét nghiệm gần nhất</th>
                <th className="py-3 px-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 bg-white">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600 mb-2" />
                    <span className="font-semibold text-xs text-slate-500">Đang đồng bộ hồ sơ bệnh án từ máy chủ...</span>
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 bg-white">
                    <Users className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                    <span className="text-slate-500 block">Không tìm thấy bản ghi hồ sơ nào trên cơ sở dữ liệu.</span>
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/40 transition-colors bg-white">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-[11px] border border-blue-100">
                          {patient.fullName ? patient.fullName.split(" ").pop()?.substring(0, 2).toUpperCase() : "BN"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{patient.fullName || "Chưa cập nhật"}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {patient.sex === "Male" || patient.sex === "Nam" ? "Nam" : "Nữ"} · {calculateAge(patient.dateOfBirth)} tuổi
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-500">{patient.mrn || patient.citizenId || `#BN-2026-${String(patient.id).padStart(3, '0')}`}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${patient.status === "Ổn định" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}>
                        {patient.status || "Theo dõi"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {(patient.allergies || patient.allergy) && (patient.allergies || patient.allergy) !== "Không có" ? (
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100 font-bold text-[11px]">{patient.allergies || patient.allergy}</span>
                      ) : (
                        <span className="text-slate-400 font-normal">Không có</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {patient.latestTestName ? (
                        <div>
                          <span className={patient.latestTestName === "ALT" ? "text-rose-500 font-bold" : "text-slate-700 font-bold"}>{patient.latestTestName}: {patient.latestTestValue}</span>
                          <p className="text-[10px] mt-0.5 text-slate-400">{patient.latestTestDate || "Gần đây"}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-normal">Chưa có chỉ số</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => handleEditClick(patient)} className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalElements > 0 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium bg-white">
            <div>Hiển thị <span className="text-slate-800 font-semibold">{page * size + 1}</span> - <span className="text-slate-800 font-semibold">{Math.min((page + 1) * size, totalElements)}</span> của <span className="text-slate-800 font-semibold">{totalElements.toLocaleString()}</span> bệnh nhân</div>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-1 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
              {[...Array(Math.min(5, totalPages))].map((_, index) => (
                <button key={index} onClick={() => setPage(index)} className={`h-7 w-7 rounded-lg text-xs font-bold transition-colors ${page === index ? "bg-blue-600 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{index + 1}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="p-1 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* --- CÁC MODAL --- */}
      <AddPatientModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => { setIsAddModalOpen(false); fetchPatients(); }} 
      />
      
      {selectedPatient && (
        <EditPatientModal 
          isOpen={isEditModalOpen} 
          onClose={() => { setIsEditModalOpen(false); setSelectedPatient(null); }} 
          patient={selectedPatient}
          onSuccess={() => { setIsEditModalOpen(false); setSelectedPatient(null); fetchPatients(); }}
        />
      )}
    </div>
  );
};