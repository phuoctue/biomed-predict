import { useState } from "react";
import Pagination from "@/components/ui/Pagination";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { EditUserModal } from "@/components/SystemAdministration/EditUserModal";
import type { EditableUser } from "@/components/SystemAdministration/EditUserModal";
import { useDeleteUser, useUsers } from "@/hooks/useUsers";

const roleLabel: Record<string, string> = {
  DOCTOR: "Bác sĩ",
  PHARMACIST: "Dược sĩ",
  ADMIN: "Quản trị",
  MEDICAL_STAFF: "Nhân viên y tế",
};

export const UserTable = () => {
  const [editingUser, setEditingUser] = useState<EditableUser | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const query = useUsers({ page: 0, size: 20 });
  const deleteUser = useDeleteUser();

  const users = query.data ?? [];

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    await deleteUser.mutateAsync(id);
    setOpenMenuId(null);
  };

  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Tính toán dữ liệu hiển thị cho phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-base font-bold text-slate-900">Danh sách Người dùng</h3>
      {query.isLoading ? (
        <p className="py-6 text-center text-sm text-slate-400">Đang tải...</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            <tr className="border-b border-slate-100">
              <th className="pb-4 text-left">Người dùng</th>
              <th className="pb-4 text-left">Vai trò</th>
              <th className="pb-4 text-left">Phòng ban</th>
              <th className="pb-4 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-sm italic text-slate-400">
                  Chưa có người dùng
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="py-4">
                    <div className="font-bold text-slate-900">{u.fullName}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-4 font-medium text-slate-700">{roleLabel[u.role] ?? u.role}</td>
                  <td className="py-4 text-xs text-slate-500">{u.department || "—"}</td>
                  <td className="relative py-4">
                    <button onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)} className="text-slate-400 hover:text-slate-600">
                      <MoreHorizontal size={20} />
                    </button>
                    {openMenuId === u.id ? (
                      <div className="absolute right-0 z-10 mt-2 w-32 rounded-lg border border-slate-100 bg-white py-1 shadow-lg">
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setOpenMenuId(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil size={14} /> Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-slate-50"
                        >
                          <Trash2 size={14} /> Xóa
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      <EditUserModal
        isOpen={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSuccess={() => {
          setEditingUser(null);
          query.refetch();
        }}
      />
    </div>
  );
};
