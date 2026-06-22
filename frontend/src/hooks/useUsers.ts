import { useState } from 'react';
import { User } from '@/types/user';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (params: { keyword?: string }) => {
    setLoading(true);
    try {
      // Gọi API theo tài liệu: GET /api/users [cite: 77]
      const response = await fetch(`/api/users?keyword=${params.keyword || ''}`);
      const result = await response.json();
      setUsers(result.data);
    } catch (error) {
      console.error("Lỗi tải người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    // Gọi API theo tài liệu: DELETE /api/users/{id} [cite: 96]
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    setUsers(users.filter(u => u.id !== id));
  };

  return { users, loading, fetchUsers, deleteUser };
};