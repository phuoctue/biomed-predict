import { apiClient } from "../../../lib/api-client";

export const loginApi = async (payload: { email: string; password: string }) => {
  const { data } = await apiClient.post("/auth/login", payload);
  return data as {
    accessToken: string;
    user: { id: string; email: string; name: string; role: "ADMIN" | "DOCTOR" | "PHARMACIST" };
  };
};
