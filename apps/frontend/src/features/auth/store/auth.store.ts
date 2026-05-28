import { create } from "zustand";

type User = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "DOCTOR" | "PHARMACIST";
};

type AuthState = {
  accessToken: string | null;
  user: User | null;
  setAuth: (accessToken: string, user: User) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (accessToken, user) => set({ accessToken, user }),
  setAccessToken: (accessToken) => set((state) => ({ ...state, accessToken })),
  clearAuth: () => set({ accessToken: null, user: null })
}));
