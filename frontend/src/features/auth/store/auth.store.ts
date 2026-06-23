import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser } from "../../../types/auth";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  hasHydrated: boolean;
  setHydrated: (value: boolean) => void;
  setAuth: (payload: { accessToken: string; refreshToken?: string; user: AuthUser }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hasHydrated: false,
      setHydrated: (value) => set({ hasHydrated: value }),
      setAuth: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken: refreshToken ?? null, user }),
      clearAuth: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: "mediai-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
