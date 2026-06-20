import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pill,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Layers
} from "lucide-react";

// 1. Khai báo Interface cấu trúc dữ liệu Thuốc nhận từ API Backend
interface Drug {
  id: number;
  name: string;
  packageInfo: string; // Ví dụ: HỘP 100 VIÊN, BÚT TIÊM 3ML
  code: string; // Ví dụ: MED-77291-AMX
  ingredients: string; // Thành phần (Ví dụ: Amoxicillin trihydrate)
  stockQuantity: number; // Số lượng tồn kho
  unit: string; // Đơn vị tính (đv, viên, hộp)
}

export const DrugsPage = () => {
  // 2. Quản lý các State cho bộ lọc và dữ liệu hiển thị
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Các State hỗ trợ phân trang đồng bộ API chung của hệ thống
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);

  // 3. Hàm gọi API lấy danh sách thuốc thực tế
  const fetchDrugs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/drugs", {
        params: {
          keyword: keyword || undefined,
          category: activeCategory !== "all" ? activeCategory : undefined,
          page: page,
          size: size,
          sort: "id,desc"
        }
      });

      if (response.data && response.data.success) {
        setDrugs(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalElements(response.data.totalElements || 0);
      }
    } catch (error) {
      console.error("Lỗi khi kết nối đến API /api/drugs:", error);
      // Fallback data giả lập nếu Backend chưa sẵn sàng endpoint
      setDrugs([]);
      setTotalElements(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Tự động kích hoạt lại hàm gọi API khi người dùng đổi trang, gõ từ khóa hoặc đổi tab
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDrugs();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [page, keyword, activeCategory]);

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans antialiased text-slate-600">
      {/* 4. THANH TIÊU ĐỀ & ĐIỀU HƯỚNG PHỤ (BREADCRUMB) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
            Kho dược <ChevronRight className="h-3 w-3" />{" "}
            <span className="text-blue-600 font-semibold">Quản lý thuốc</span>
          </p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Quản Lý Danh Mục Thuốc
          </h1>
        </div>
        <button
          onClick={() => alert("Mở form thêm thuốc mới")}
          className="inline-flex items-center justify-center gap-2 bg-[#0061f2] hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm thuốc mới</span>
        </button>
      </div>

      {/* 5. KHỐI THẺ THỐNG KÊ TRẠNG THÁI KHO (KPI CARDS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Card Trạng Thái Kho Hàng */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-500" /> Trạng Thái Kho Hàng
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
              Đầy đủ
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <p className="text-[11px] font-medium text-slate-400 uppercase">
                Tổng mặt hàng
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {totalElements.toLocaleString() || "1,284"}
              </p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> +12% tháng này
              </p>
            </div>
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <p className="text-[11px] font-medium text-slate-400 uppercase">
                Sắp hết hàng
              </p>
              <p className="text-2xl font-black text-rose-600 mt-1">24</p>
              <p className="text-[10px] text-rose-500 font-medium mt-1">
                Cần nhập thêm ngay
              </p>
            </div>
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <p className="text-[11px] font-medium text-slate-400 uppercase">
                Sắp hết hạn
              </p>
              <p className="text-2xl font-black text-amber-600 mt-1">08</p>
              <p className="text-[10px] text-amber-500 font-medium mt-1">
                Hạn dùng &lt; 30 ngày
              </p>
            </div>
          </div>
        </div>

        {/* Card Xu Hướng Cấp Phát */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-blue-500" /> Xu Hướng Cấp Phát
            </h3>
            <div className="flex items-end justify-between h-20 px-2 gap-2">
              <div className="w-full bg-blue-100 h-[40%] rounded-sm"></div>
              <div className="w-full bg-blue-100 h-[55%] rounded-sm"></div>
              <div className="w-full bg-blue-100 h-[30%] rounded-sm"></div>
              <div className="w-full bg-blue-100 h-[65%] rounded-sm"></div>
              <div className="w-full bg-blue-100 h-[60%] rounded-sm"></div>
              <div className="w-full bg-blue-600 h-[85%] rounded-sm"></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-2 px-1">
              <span>Thứ 2</span>
              <span>Hôm nay</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium border-t border-slate-50 pt-2.5 mt-2">
            Tăng 8.4% so với tuần trước. Nhu cầu thuốc kháng sinh cao nhất.
          </p>
        </div>
      </div>

      {/* 6. BẢNG DANH MỤC CHI TIẾT VÀ BỘ LỌC TÌM KIẾM */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Bộ lọc Tabs phân loại & Ô Search */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-slate-900">
              Danh mục thuốc chi tiết
            </h2>
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl w-fit">
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setPage(0);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeCategory === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                Tất cả
              </button>
              <button
                onClick={() => {
                  setActiveCategory("khang-sinh");
                  setPage(0);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeCategory === "khang-sinh" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                Kháng sinh
              </button>
              <button
                onClick={() => {
                  setActiveCategory("giam-dau");
                  setPage(0);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeCategory === "giam-dau" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                Giảm đau
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 w-full md:w-64">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(0);
                }}
                className="w-full bg-transparent text-xs font-medium outline-none text-slate-800"
                placeholder="Tìm kiếm tên thuốc, mã số..."
              />
            </div>
            <button className="inline-flex items-center gap-1.5 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition-colors">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Lọc nâng cao</span>
            </button>
          </div>
        </div>

        {/* Khối Bảng (Table) hiển thị danh sách thuốc */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-6">Tên thuốc</th>
                <th className="py-3 px-4">Mã số</th>
                <th className="py-3 px-4">Thành phần</th>
                <th className="py-3 px-4">Tỉ n kho</th>
                <th className="py-3 px-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-blue-600 mb-1" />
                    <span>Đang tải danh mục kho thuốc...</span>
                  </td>
                </tr>
              ) : drugs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Pill className="h-6 w-6 mx-auto text-slate-300 mb-1" />
                    <span>Không tìm thấy loại thuốc nào trong hệ thống.</span>
                  </td>
                </tr>
              ) : (
                drugs.map((drug) => (
                  <tr
                    key={drug.id}
                    className="hover:bg-slate-50/40 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                          <Pill className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {drug.name}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase font-medium mt-0.5">
                            {drug.packageInfo}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-500 font-medium text-[11px]">
                      {drug.code}
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-normal">
                      {drug.ingredients}
                    </td>
                    <td className="py-4 px-4 w-48">
                      <div className="flex items-center justify-between gap-3">
                        <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${drug.stockQuantity < 150 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{
                              width: `${Math.min(100, (drug.stockQuantity / 1000) * 100)}%`
                            }}
                          ></div>
                        </div>
                        <span
                          className={`font-bold ${drug.stockQuantity < 150 ? "text-amber-600" : "text-emerald-600"}`}
                        >
                          {drug.stockQuantity}{" "}
                          <span className="text-[10px] font-normal text-slate-400">
                            {drug.unit || "đv"}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
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

        {/* 7. THANH PHÂN TRANG (PAGINATION) */}
        {!loading && totalElements > 0 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <div>
              Hiển thị{" "}
              <span className="text-slate-800 font-semibold">
                {page * size + 1}
              </span>{" "}
              -{" "}
              <span className="text-slate-800 font-semibold">
                {Math.min((page + 1) * size, totalElements)}
              </span>{" "}
              trong số{" "}
              <span className="text-slate-800 font-semibold">
                {totalElements.toLocaleString()}
              </span>{" "}
              thuốc
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1 border border-slate-200 rounded-lg bg-white disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index)}
                  className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${page === index ? "bg-blue-600 text-white" : "border border-slate-200 bg-white hover:bg-slate-50"}`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="p-1 border border-slate-200 rounded-lg bg-white disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 8. KHU VỰC TIỆN ÍCH CHÂN TRANG (FOOTER CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Hệ thống Kho lạnh GSP */}
        <div className="rounded-2xl overflow-hidden relative border border-slate-100 shadow-sm min-h-[140px] flex flex-col justify-end p-5 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent">
          <img
            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop"
            alt="GSP Cold Storage"
            className="absolute inset-0 w-full h-full object-cover -z-10 mix-blend-overlay opacity-40"
          />
          <h4 className="text-white font-bold text-sm">
            Hệ Thống Kho Lạnh GSP
          </h4>
          <p className="text-slate-300 text-[11px] mt-0.5">
            Theo dõi nhiệt độ thời gian thực cho vaccine và dược phẩm nhạy cảm.
          </p>
        </div>

        {/* Ghi chú vận hành hệ thống */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h4 className="text-slate-900 font-bold text-sm mb-3">
            Ghi chú vận hành
          </h4>
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2.5 items-start">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 font-bold text-xs">
                  Cảnh báo tồn kho!
                </p>
                <p className="text-amber-700 text-[11px] mt-0.5">
                  Lô hàng Paracetamol (Lot #221) dự kiến hết vào Thứ Tư tới. Đã
                  tạo yêu cầu nhập kho tự động.
                </p>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex gap-2.5 items-start">
              <Calendar className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-emerald-800 font-bold text-xs">
                  Kiểm kê định kỳ
                </p>
                <p className="text-emerald-700 text-[11px] mt-0.5">
                  Lần kiểm kê tiếp theo vào ngày 30/10/2023. Vui lòng chuẩn bị
                  danh sách thuốc độc hại.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
