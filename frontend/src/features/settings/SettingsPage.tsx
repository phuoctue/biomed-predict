import { useState } from "react";
import { AddUserModal } from "@/components/SystemAdministration/AddUserModal";
import { RoleDistributionChart } from "@/components/SystemAdministration/StatsCard";
import { RuleCard } from "@/components/SystemAdministration/RuleCard";
import { SystemLogs } from "@/components/SystemAdministration/SystemLogs";
import { UserTable } from "@/components/SystemAdministration/UserTable";

export const SettingsPage = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Quản trị Hệ thống</h1>
          <p className="text-sm text-slate-500">Quản lý người dùng, phân quyền vai trò và giám sát hoạt động hệ thống.</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50">
            Xuất báo cáo
          </button>
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-blue-200 hover:bg-blue-700"
          >
            + Thêm người dùng
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <UserTable />
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-800">Cấu hình Quy tắc Đánh giá</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <RuleCard title="Tương tác Thuốc" desc="Tự động chặn đơn thuốc nếu phát hiện tương tác..." />
              <RuleCard title="Cảnh báo Suy thận" desc="Yêu cầu điều chỉnh liều nếu độ thanh thải..." />
              <RuleCard title="Phân tầng Phê duyệt" desc="Đơn thuốc có giá trị trên 50 triệu cần phê duyệt..." />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <RoleDistributionChart />
          <SystemLogs />
        </div>
      </div>

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onSuccess={() => setIsAddUserOpen(false)}
      />
    </div>
  );
};
