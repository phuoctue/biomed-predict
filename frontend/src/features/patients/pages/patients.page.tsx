import React, { useState, useEffect, useCallback } from "react";
import { apiClient } from "../../../lib/api-client";
import { 
  Plus, 
  Search,  
  Eye, 
  Pencil, 
  Loader2,
  Users
} from "lucide-react";
import Pagination from '@/components/ui/Pagination';

interface Patient {
  id: number;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  citizenId: string;
  phone: string;
  status?: string;
  allergy?: string;
  latestTestName?: string;
  latestTestValue?: string;
  latestTestDate?: string;
}

export const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(10);
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
        setTotalElements(response.data.totalElements || 0);
      }
    } catch (error) {
      console.error("Lỗi khi kết nối API:", error);
      setPatients([]);
      setTotalElements(0);
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

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans antialiased text-slate-600">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hồ sơ bệnh nhân</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý và đánh giá tình trạng lâm sàng của <span className="font-semibold text-slate-700">{totalElements}</span> bệnh nhân.
          </p>
        </div>
        <button 
          onClick={() => alert("Chức năng đang kết nối")}
          className="inline-flex items-center justify-center gap-2 bg-[#0061f2] hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm bệnh nhân mới</span>
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl w-fit">
            {["all", "inpatient", "outpatient"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
              >
                {tab === "all" ? "Tất cả" : tab === "inpatient" ? "Nội trú" : "Ngoại trú"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-1.5 w-full max-w-sm">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input 
              type="text"
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setPage(0); }}
              className="w-full bg-transparent text-xs font-medium outline-none text-slate-800 placeholder:text-slate-400" 
              placeholder="Tìm kiếm bệnh nhân..." 
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
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600 mb-2" />
                    Đang đồng bộ...
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <Users className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                    Không tìm thấy dữ liệu.
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/40 transition-colors bg-white">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-[11px] border border-blue-100">
                          {patient.fullName?.split(" ").pop()?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{patient.fullName}</p>
                          <p className="text-[11px] text-slate-400">{patient.gender} · {calculateAge(patient.dateOfBirth)} tuổi</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-500">{patient.citizenId}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${patient.status === "Ổn định" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">{patient.allergy || "Không có"}</td>
                    <td className="py-4 px-4">{patient.latestTestName}: {patient.latestTestValue}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg"><Eye className="h-4 w-4" /></button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"><Pencil className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalElements > 0 && (
          <Pagination
            currentPage={page + 1}
            totalItems={totalElements}
            itemsPerPage={size}
            onPageChange={(newPage) => setPage(newPage - 1)}
          />
        )}
      </div>
    </div>
  );
};