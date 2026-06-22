import type { AxiosInstance } from "axios";
import type { AuthResponse, LoginRequest, RegisterRequest } from "@gov360/types";

export function createAuthApi(client: AxiosInstance) {
  return {
    login: async (data: LoginRequest) => {
      const response = await client.post<AuthResponse>("/auth/login", data);
      return response.data;
    },
    register: async (data: RegisterRequest) => {
      const response = await client.post<AuthResponse>("/auth/register", data);
      return response.data;
    },
    me: async () => {
      const response = await client.get<AuthResponse["user"]>("/auth/me");
      return response.data;
    },
  };
}
