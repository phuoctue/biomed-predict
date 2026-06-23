import React, { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { EditUserModal } from '@/components/SystemAdministration/EditUserModal';

// 1. Định nghĩa kiểu dữ liệu User để TypeScript hiểu cấu trúc
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export const UserTable = () => {
  // 2. Áp dụng kiểu User[] vào useState
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "BS. Trần Hoàng", email: "hoang.tran@medeval.vn", role: "Bác sĩ", status: "Hoạt động" },
    { id: 2, name: "DS. Lê Minh", email: "minh.le@medeval.vn", role: "Dược sĩ", status: "Hoạt động" },
    { id: 3, name: "Phạm Thu", email: "thu.pham@medeval.vn", role: "Quản trị", status: "Ngoại tuyến" },
  ]);

  // 3. Khai báo rõ ràng kiểu cho editingUser là User hoặc null
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
    setOpenMenuId(null);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-6 text-base">Danh sách Người dùng</h3>
      <table className="w-full text-sm">
        <thead className="text-slate-500 text-[11px] uppercase font-bold tracking-wider">
          <tr className="border-b border-slate-100">
            <th className="pb-4 text-left">Người dùng</th>
            <th className="pb-4 text-left">Vai trò</th>
            <th className="pb-4 text-left">Trạng thái</th>
            <th className="pb-4 text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="py-4">
                <div className="font-bold text-slate-900">{u.name}</div>
                <div className="text-[11px] text-slate-400">{u.email}</div>
              </td>
              <td className="py-4 text-slate-700 font-medium">{u.role}</td>
              <td className="py-4">
                <span className={`flex items-center gap-1.5 text-xs font-medium ${u.status === 'Hoạt động' ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${u.status === 'Hoạt động' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span> 
                  {u.status}
                </span>
              </td>
              <td className="py-4 relative">
                <button 
                  onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)} 
                  className="text-slate-400 hover:text-slate-600"
                >
                  <MoreHorizontal size={20} />
                </button>
                {openMenuId === u.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-slate-100 z-10 py-1">
                    <button 
                      onClick={() => { setEditingUser(u); setOpenMenuId(null); }} 
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-50 text-slate-700 text-left"
                    >
                      <Pencil size={14} /> Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(u.id)} 
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-50 text-red-600 text-left"
                    >
                      <Trash2 size={14} /> Xóa
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Sửa */}
      <EditUserModal 
        isOpen={!!editingUser} 
        user={editingUser} 
        onClose={() => setEditingUser(null)} 
        onSuccess={() => setEditingUser(null)} 
      />
    </div>
  );
};