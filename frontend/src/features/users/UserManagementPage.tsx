import React, { useEffect, useState } from "react";
import { UserPlus, Search, Trash2, Edit2 } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useUsers } from "@/hooks/useUsers";
import { User } from "@/types/user";

export const UserManagementPage = () => {
  const { users, loading, fetchUsers, deleteUser } = useUsers();
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetchUsers({ keyword });
  }, [keyword]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-slate-800">Quản lý Người dùng</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
          <UserPlus className="h-4 w-4" /> Thêm người dùng
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 border-b text-left">
              <th className="pb-3">Họ tên</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Vai trò</th>
              <th className="pb-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr key={user.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                <td className="py-4 font-bold text-slate-900">{user.fullName}</td>
                <td className="py-4 text-slate-600">{user.email}</td>
                <td className="py-4 text-slate-600">{user.roleName}</td>
                <td className="py-4 text-right space-x-2">
                  <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Edit2 className="h-4 w-4" /></button>
                  <button 
                    onClick={() => deleteUser(user.id)} 
                    className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};