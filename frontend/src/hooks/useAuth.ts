// src/hooks/useAuth.ts
// Thin wrapper around the Zustand auth store so components don't need to
// import the store directly.
import { useAuthStore } from "../features/auth/store/auth.store";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return {
    user,
    accessToken,
    isAuthenticated: !!accessToken && !!user,
    setAuth,
    clearAuth,
  };
};
