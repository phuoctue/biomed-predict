import { useEffect, useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { EditUserModal } from "@/components/SystemAdministration/EditUserModal";
import type { EditableUser } from "@/components/SystemAdministration/EditUserModal";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  department?: string;
}

const roleLabel: Record<string, string> = {
  DOCTOR: "Bác sĩ", PHARMACIST: "Dược sĩ",
  ADMIN: "Quản trị", MEDICAL_STAFF: "Nhân viên y tế",
};

export const UserTable = () => {
  const [users, setUsers]       = useState<User[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editingUser, setEditingUser] = useState<EditableUser | null>(null);
  const [openMenuId, setOpenMenuId]   = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    apiClient.get("/users?page=0&size=20&sort=createdAt,desc")
      .then((res) => {
        const items: any[] = res.data.content ?? res.data.data ?? [];
        setUsers(items.map((u) => ({
          id: String(u.id),
          fullName: u.fullName ?? u.full_name ?? "—",
          email: u.email ?? "—",
          role: u.role ?? "MEDICAL_STAFF",
          department: u.department ?? "",
        })));
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await apiClient.delete(`/users/${id}`);
      fetchUsers();
    } catch {
      alert("Không thể xóa người dùng này");
    }
    setOpenMenuId(null);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-6 text-base">Danh sách Người dùng</h3>
      {loading ? (
        <p className="text-sm text-slate-400 text-center py-6">Đang tải...</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-slate-500 text-[11px] uppercase font-bold tracking-wider">
            <tr className="border-b border-slate-100">
              <th className="pb-4 text-left">Người dùng</th>
              <th className="pb-4 text-left">Vai trò</th>
              <th className="pb-4 text-left">Phòng ban</th>
              <th className="pb-4 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.length === 0 ? (
              <tr><td colSpan={4} className="py-6 text-center text-slate-400 text-sm italic">Chưa có người dùng</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4">
                  <div className="font-bold text-slate-900">{u.fullName}</div>
                  <div className="text-[11px] text-slate-400">{u.email}</div>
                </td>
                <td className="py-4 text-slate-700 font-medium">{roleLabel[u.role] ?? u.role}</td>
                <td className="py-4 text-slate-500 text-xs">{u.department || "—"}</td>
                <td className="py-4 relative">
                  <button onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
                    className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal size={20} />
                  </button>
                  {openMenuId === u.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-slate-100 z-10 py-1">
                      <button onClick={() => { setEditingUser(u); setOpenMenuId(null); }}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-50 text-slate-700 text-left">
                        <Pencil size={14} /> Sửa
                      </button>
                      <button onClick={() => handleDelete(u.id)}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-50 text-red-600 text-left">
                        <Trash2 size={14} /> Xóa
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <EditUserModal
        isOpen={!!editingUser} user={editingUser}
        onClose={() => setEditingUser(null)}
        onSuccess={() => { setEditingUser(null); fetchUsers(); }}
      />
    </div>
  );
};
