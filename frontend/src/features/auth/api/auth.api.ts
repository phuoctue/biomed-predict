import { apiClient } from "../../../lib/api-client";
import type { AuthUser } from "../../../types/auth";

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiredAt: string;
  user: AuthUser;
};

export type RefreshTokenInput = {
  refreshToken: string;
};

export const loginApi = async (input: LoginInput): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", input);
  return data;
};

export const refreshTokenApi = async (input: RefreshTokenInput): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>("/auth/refresh", input);
  return data;
};

export const currentUserApi = async (): Promise<AuthUser> => {
  const { data } = await apiClient.get<AuthUser>("/auth/me");
  return data;
};
