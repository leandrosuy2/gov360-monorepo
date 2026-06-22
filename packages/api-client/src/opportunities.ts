import type { AxiosInstance } from "axios";
import type { PaginatedResponse } from "@gov360/types";

export function createOpportunitiesApi(client: AxiosInstance) {
  return {
    list: (params?: Record<string, unknown>) =>
      client.get<PaginatedResponse<unknown>>("/opportunities", { params }).then((r) => r.data),
    get: (id: string) => client.get(`/opportunities/${id}`).then((r) => r.data),
    create: (data: unknown) => client.post("/opportunities", data).then((r) => r.data),
    update: (id: string, data: unknown) => client.patch(`/opportunities/${id}`, data).then((r) => r.data),
    remove: (id: string) => client.delete(`/opportunities/${id}`).then((r) => r.data),
  };
}
