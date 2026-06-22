import type { AxiosInstance } from "axios";
import type { PaginatedResponse } from "@gov360/types";

export function createDocumentsApi(client: AxiosInstance) {
  return {
    list: (params?: Record<string, unknown>) =>
      client.get<PaginatedResponse<unknown>>("/documents", { params }).then((r) => r.data),
    certificateStats: () => client.get("/documents/certificates/stats").then((r) => r.data),
    create: (data: unknown) => client.post("/documents", data).then((r) => r.data),
    remove: (id: string) => client.delete(`/documents/${id}`).then((r) => r.data),
  };
}

export function createTasksApi(client: AxiosInstance) {
  return {
    list: (params?: Record<string, unknown>) =>
      client.get<PaginatedResponse<unknown>>("/tasks", { params }).then((r) => r.data),
    create: (data: unknown) => client.post("/tasks", data).then((r) => r.data),
    update: (id: string, data: unknown) => client.patch(`/tasks/${id}`, data).then((r) => r.data),
  };
}

export function createContractsApi(client: AxiosInstance) {
  return {
    list: (params?: Record<string, unknown>) =>
      client.get<PaginatedResponse<unknown>>("/contracts", { params }).then((r) => r.data),
    create: (data: unknown) => client.post("/contracts", data).then((r) => r.data),
  };
}

export function createPriceRecordsApi(client: AxiosInstance) {
  return {
    list: (params?: Record<string, unknown>) =>
      client.get<PaginatedResponse<unknown>>("/price-records", { params }).then((r) => r.data),
    create: (data: unknown) => client.post("/price-records", data).then((r) => r.data),
    update: (id: string, data: unknown) => client.patch(`/price-records/${id}`, data).then((r) => r.data),
    addItem: (id: string, data: unknown) => client.post(`/price-records/${id}/items`, data).then((r) => r.data),
    updateItem: (id: string, itemId: string, data: unknown) =>
      client.patch(`/price-records/${id}/items/${itemId}`, data).then((r) => r.data),
    addCarona: (id: string, data: unknown) => client.post(`/price-records/${id}/caronas`, data).then((r) => r.data),
  };
}

export function createProposalsApi(client: AxiosInstance) {
  return {
    list: (params?: Record<string, unknown>) =>
      client.get<PaginatedResponse<unknown>>("/proposals", { params }).then((r) => r.data),
    create: (data: unknown) => client.post("/proposals", data).then((r) => r.data),
  };
}

export function createAuctionsApi(client: AxiosInstance) {
  return {
    list: (params?: Record<string, unknown>) =>
      client.get<PaginatedResponse<unknown>>("/auctions", { params }).then((r) => r.data),
    active: () => client.get("/auctions/active").then((r) => r.data),
    update: (id: string, data: unknown) => client.patch(`/auctions/${id}`, data).then((r) => r.data),
    placeBid: (id: string, amount: number) =>
      client.post(`/auctions/${id}/bids`, { amount }).then((r) => r.data),
    messages: (id: string) => client.get(`/auctions/${id}/messages`).then((r) => r.data),
    sendMessage: (id: string, data: { content: string; sender?: string }) =>
      client.post(`/auctions/${id}/messages`, { ...data, isFromUs: true }).then((r) => r.data),
  };
}

export function createCompetitorsApi(client: AxiosInstance) {
  return {
    list: (params?: Record<string, unknown>) =>
      client.get<PaginatedResponse<unknown>>("/competitors", { params }).then((r) => r.data),
    create: (data: unknown) => client.post("/competitors", data).then((r) => r.data),
    addWin: (id: string, data: unknown) => client.post(`/competitors/${id}/wins`, data).then((r) => r.data),
    ranking: () => client.get("/competitors/ranking").then((r) => r.data),
    marketStats: () => client.get("/competitors/market-stats").then((r) => r.data),
  };
}

export function createFinancialApi(client: AxiosInstance) {
  return {
    list: (params?: Record<string, unknown>) =>
      client.get<PaginatedResponse<unknown>>("/financial", { params }).then((r) => r.data),
    summary: () => client.get("/financial/summary").then((r) => r.data),
  };
}

export function createAuditApi(client: AxiosInstance) {
  return {
    list: (params?: Record<string, unknown>) =>
      client.get<PaginatedResponse<unknown>>("/audit", { params }).then((r) => r.data),
  };
}

export function createIntegrationsApi(client: AxiosInstance) {
  return {
    catalog: () => client.get("/integrations/catalog").then((r) => r.data),
    status: () => client.get("/integrations/status").then((r) => r.data),
    test: (code: string) => client.get(`/integrations/${code}/test`).then((r) => r.data),
    portals: () => client.get("/integrations/portals").then((r) => r.data),
    logs: (params?: Record<string, unknown>) =>
      client.get("/integrations/logs", { params }).then((r) => r.data),
    syncPncp: (data?: { daysBack?: number; keywords?: string; state?: string }) =>
      client.post("/integrations/pncp/sync", data ?? {}).then((r) => r.data),
    syncComprasGov: (data?: { keywords?: string; state?: string }) =>
      client.post("/integrations/compras-gov/sync", data ?? {}).then((r) => r.data),
  };
}

export function createTenderAnalysisApi(client: AxiosInstance) {
  return {
    getByTender: (tenderId: string) => client.get(`/tender-analysis/tender/${tenderId}`).then((r) => r.data),
    upload: (tenderId: string, file: File) => {
      const body = new FormData();
      body.append("file", file);
      return client.post(`/tender-analysis/tender/${tenderId}/upload`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      }).then((r) => r.data);
    },
  };
}
