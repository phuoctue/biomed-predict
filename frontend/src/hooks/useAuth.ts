// src/features/auth/hooks/useAuth.ts
export const useAuth = () => {
  // Logic lấy user từ localStorage hoặc Context/Zustand
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return { user, isAuthenticated: !!user.fullName };
};