import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Download,
  AlertTriangle,
  CheckCircle,
  Activity,
  User,
  ShieldAlert,
  Dna,
  SlidersHorizontal,
  Plus,
  MoreVertical,
} from "lucide-react";

// 1. Định nghĩa Interfaces dữ liệu chuẩn từ API AI Evaluation
interface PatientInfo {
  name: string;
  age: number;
  gender: string;
  patientId: string;
  allergy: string;
  diagnosis: string;
  evaluatedAt: string;
}

interface Interaction {
  id: number;
  drugPair: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  description: string;
  riskAlert: string;
  recommendation: string;
}

interface PrescribedDrug {
  id: number;
  name: string;
  activeIngredient: string;
  dosage: string;
  frequency: string;
  indication: string;
  status: "ACTIVE" | "WARNING";
  statusText: string;
}

export const EvaluationsPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  
  // States lưu trữ dữ liệu phân tích từ AI
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [drugs, setDrugs] = useState<PrescribedDrug[]>([]);

  // 2. Gọi API chung của dự án
  const fetchEvaluationData = async () => {
    try {
      setLoading(true);
      // Giả định lấy kết quả phân tích của bệnh nhân hiện tại (ví dụ ID: 1002485)
      const response = await axios.get("/api/ai-evaluations/latest", {
        params: { patientId: "1002485" }
      });

      if (response.data && response.data.success) {
        setPatient(response.data.data.patient);
        setInteractions(response.data.data.interactions);
        setDrugs(response.data.data.drugs);
      }
    } catch (error) {
      console.error("Lỗi kết nối API /api/ai-evaluations, sử dụng dữ liệu Mock Figma:", error);
      
      // Đổ dữ liệu Mock chuẩn chỉnh theo ảnh Figma nếu BE chưa có dữ liệu
      setPatient({
        name: "Phạm Văn Mạnh",
        age: 68,
        gender: "Nam",
        patientId: "1002485",
        allergy: "Penicillin",
        diagnosis: "Tăng huyết áp vô căn (I10)",
        evaluatedAt: "Hôm nay, 09:15 AM"
      });

      setInteractions([
        {
          id: 1,
          drugPair: "Warfarin + Aspirin",
          severity: "HIGH",
          description: "Việc sử dụng đồng thời làm tăng đáng kể nguy cơ chảy máu nội tạng. Warfarin (thuốc chống đông máu) kết hợp với Aspirin (kháng tiểu cầu) tạo ra hiệp đồng tác dụng phụ.",
          riskAlert: "! Tăng nguy cơ xuất huyết tiêu hóa 4.5x",
          recommendation: "Thay thế Aspirin"
        },
        {
          id: 2,
          drugPair: "Lisinopril + Spironolacton",
          severity: "MEDIUM",
          description: "Nguy cơ tăng Kali máu (Hyperkalemia). Cần kiểm tra nồng độ creatinine và kali trong máu trong vòng 1 tuần sau khi bắt đầu phối hợp.",
          riskAlert: "Mức độ: Trung bình",
          recommendation: "Theo dõi xét nghiệm"
        }
      ]);

      setDrugs([
        {
          id: 1,
          name: "Warfarin (Coumadin)",
          activeIngredient: "Thuốc chống đông máu",
          dosage: "5 mg",
          frequency: "1 lần/ngày (Chiều)",
          indication: "Rung nhĩ",
          status: "ACTIVE",
          statusText: "Đang dùng"
        },
        {
          id: 2,
          name: "Aspirin (81mg)",
          activeIngredient: "Kháng tiểu cầu",
          dosage: "81 mg",
          frequency: "1 lần/ngày (Sáng)",
          indication: "Dự phòng tim mạch",
          status: "WARNING",
          statusText: "Cần thay thế"
        },
        {
          id: 3,
          name: "Lisinopril",
          activeIngredient: "Ức chế men chuyển (ACEI)",
          dosage: "10 mg",
          frequency: "1 lần/ngày (Sáng)",
          indication: "Tăng huyết áp",
          status: "ACTIVE",
          statusText: "Đang dùng"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluationData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="text-center text-slate-500 font-semibold text-sm">
          <Activity className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-2" />
          Đang chạy mô hình AI phân tích đơn thuốc...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen font-sans antialiased text-slate-600">
      
      {/* 3. THANH CÔNG CỤ TRÊN TRANG (TOP ACTION BAR) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <h1 className="text-xl font-bold text-slate-800">Chi tiết Kết quả Đánh giá</h1>
        <button 
          onClick={() => alert("Đang xuất file báo cáo PDF...")}
          className="inline-flex items-center justify-center gap-2 bg-[#0061f2] hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm transition-colors w-fit"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Xuất báo cáo PDF</span>
        </button>
      </div>

      {patient && (
        /* 4. KHỐI THÔNG TIN BỆNH NHÂN TRỰC QUAN */
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl border border-slate-200">
              <User className="h-6 w-6 text-slate-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">{patient.name}</h2>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold">{patient.age} Tuổi</span>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold">{patient.gender}</span>
                <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded font-mono font-bold">ID: {patient.patientId}</span>
              </div>
              <div className="mt-2 text-xs font-semibold flex flex-wrap gap-x-6 gap-y-1">
                <p className="text-slate-400">CHẨN ĐOÁN CHÍNH: <span className="text-slate-800 font-bold">{patient.diagnosis}</span></p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 text-right">
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>DỊ ỨNG: {patient.allergy}</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">ĐÁNH GIÁ CUỐI: <span className="text-slate-600 font-bold">{patient.evaluatedAt}</span></p>
          </div>
        </div>
      )}

      {/* 5. CẤU TRÚC 2 CỘT CHÍNH THEO BẢN FIGMA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* CỘT TRÁI: CẢNH BÁO TƯƠNG TÁC THUỐC NGHIÊM TRỌNG (CHIẾM 2 CỘT) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-500" /> Tương tác thuốc-thuốc nghiêm trọng
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">Ưu tiên cao</span>
            </div>

            <div className="space-y-4">
              {interactions.map((item) => (
                <div 
                  key={item.id} 
                  className={`border rounded-xl p-4 transition-all ${
                    item.severity === "HIGH" ? "bg-rose-50/20 border-rose-100" : "bg-amber-50/20 border-amber-100"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 max-w-xl">
                      <p className="text-sm font-bold text-slate-900">{item.drugPair}</p>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.description}</p>
                      <p className={`text-[11px] font-bold mt-1 ${item.severity === "HIGH" ? "text-rose-600" : "text-amber-600"}`}>
                        {item.riskAlert}
                      </p>
                    </div>
                    
                    <div className="sm:text-right shrink-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Hành động khuyến nghị</p>
                      <button 
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border shadow-sm transition-all ${
                          item.severity === "HIGH" 
                            ? "bg-rose-600 border-rose-600 text-white hover:bg-rose-700" 
                            : "bg-white border-amber-200 text-amber-700 hover:bg-amber-50"
                        }`}
                      >
                        {item.recommendation}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHỨC NĂNG THẬN & HUYẾT ÁP TRUNG BÌNH */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                <span>CHỨC NĂNG THẬN (eGFR)</span>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">72</span>
                <span className="text-[10px] font-bold text-slate-400">mL/min/1.73m²</span>
              </div>
              {/* Thanh biểu đồ nhỏ */}
              <div className="flex gap-1 mt-3">
                <div className="h-2 w-full bg-emerald-200 rounded-sm"></div>
                <div className="h-2 w-full bg-emerald-300 rounded-sm"></div>
                <div className="h-2 w-full bg-emerald-400 rounded-sm"></div>
                <div className="h-2 w-full bg-emerald-500 rounded-sm"></div>
                <div className="h-2 w-full bg-emerald-700 rounded-sm"></div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                <span>HUYẾT ÁP TRUNG BÌNH</span>
                <Activity className="h-4 w-4 text-rose-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">145/92</span>
                <span className="text-[10px] font-bold text-slate-400">mmHg</span>
              </div>
              <p className="text-[10px] text-rose-600 font-bold mt-3">Cao hơn 12% so với tuần trước</p>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: RỦI RO THEO CÁ THỂ (BIỂU ĐỒ & PHÂN TÍCH GEN) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900">Rủi ro theo cá thể</h3>
          
          {/* Nguy cơ ngã */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700">Nguy cơ ngã (Beers Criteria)</span>
              <span className="text-rose-600 uppercase">Cao</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: "85%" }}></div>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Sử dụng nhóm Benzodiazepine đồng thời với thuốc hạ huyết áp làm tăng nguy cơ hạ huyết áp tư thế.
            </p>
          </div>

          {/* Tuân thủ điều trị */}
          <div className="space-y-1.5 pt-2 border-t border-slate-50">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700">Tuân thủ điều trị</span>
              <span className="text-emerald-600 uppercase">Tốt</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "90%" }}></div>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Bệnh nhân sử dụng ứng dụng nhắc lịch uống thuốc đều đặn hàng ngày.
            </p>
          </div>

          {/* Khả năng dung nạp thuốc */}
          <div className="space-y-1.5 pt-2 border-t border-slate-50">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700">Khả năng dung nạp thuốc</span>
              <span className="text-amber-600 uppercase">Trung bình</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: "55%" }}></div>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Ghi nhận mệt mỏi nhẹ sau khi dùng liều buổi sáng. Cần điều chỉnh thời gian dùng.
            </p>
          </div>

          {/* Phân tích di truyền học */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Phân tích di truyền (Pharmacogenomics)</p>
            <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-3 flex gap-2.5 items-start">
              <Dna className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-900 font-bold text-xs">CYP2C19 *2 Allele</p>
                <p className="text-slate-500 text-[10px] mt-1 leading-normal">
                  Giảm chuyển hóa Clopidogrel. Khuyến nghị cân nhắc thuốc thay thế.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 6. BẢNG DANH MỤC THUỐC ĐANG SỬ DỤNG (DƯỚI CÙNG) */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Danh mục thuốc đang sử dụng ({drugs.length})</h3>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition-colors">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Bộ lọc</span>
            </button>
            <button className="inline-flex items-center gap-1 border border-blue-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm thuốc</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-6">Tên thuốc / Hoạt chất</th>
                <th className="py-3 px-4">Liều dùng</th>
                <th className="py-3 px-4">Tần suất</th>
                <th className="py-3 px-4">Chỉ định</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {drugs.map((drug) => (
                <tr key={drug.id} className={drug.status === "WARNING" ? "bg-rose-50/10 hover:bg-rose-50/20" : "hover:bg-slate-50/40"}>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{drug.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{drug.activeIngredient}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">{drug.dosage}</td>
                  <td className="py-4 px-4 text-slate-500 font-normal">{drug.frequency}</td>
                  <td className="py-4 px-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-medium">
                      {drug.indication}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 font-bold ${drug.status === "WARNING" ? "text-rose-600" : "text-emerald-600"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${drug.status === "WARNING" ? "bg-rose-600" : "bg-emerald-600"}`}></span>
                      {drug.statusText}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors">
                      <MoreVertical className="h-4 w-4 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
          <button 
            onClick={() => alert("Mở rộng danh sách thuốc...")}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Xem tất cả cả các loại thuốc
          </button>
        </div>
      </div>

    </div>
  );
};