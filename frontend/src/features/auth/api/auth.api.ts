import { apiClient } from "../../../lib/api-client";
import type { AuthUser } from "../../../types/auth";

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export const loginApi = async (input: LoginInput) => {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", input);
  return data;
};

