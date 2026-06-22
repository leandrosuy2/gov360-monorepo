import type { AxiosInstance } from "axios";
import type { User } from "@gov360/types";

export function createUsersApi(client: AxiosInstance) {
  return {
    list: async () => {
      const response = await client.get<User[]>("/users");
      return response.data;
    },
    getById: async (id: string) => {
      const response = await client.get<User>(`/users/${id}`);
      return response.data;
    },
  };
}
