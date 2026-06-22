import type { AxiosInstance } from "axios";
import type { DashboardStats, PaginatedResponse } from "@gov360/types";

export function createTendersApi(client: AxiosInstance) {
  return {
    list: (params?: Record<string, unknown>) =>
      client.get<PaginatedResponse<unknown>>("/tenders", { params }).then((r) => r.data),
    get: (id: string) => client.get(`/tenders/${id}`).then((r) => r.data),
    create: (data: unknown) => client.post("/tenders", data).then((r) => r.data),
    update: (id: string, data: unknown) => client.patch(`/tenders/${id}`, data).then((r) => r.data),
    updateStatus: (id: string, status: string) =>
      client.patch(`/tenders/${id}/status`, { status }).then((r) => r.data),
  };
}

export function createDashboardApi(client: AxiosInstance) {
  return {
    stats: () => client.get<DashboardStats>("/dashboard/stats").then((r) => r.data),
  };
}
