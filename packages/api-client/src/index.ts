import { createApiClient, type ApiClientConfig } from "./axios";
import { createAuthApi } from "./auth";
import { createUsersApi } from "./users";
import { createOpportunitiesApi } from "./opportunities";
import { createDashboardApi, createTendersApi } from "./tenders";
import {
  createAuctionsApi,
  createAuditApi,
  createCompetitorsApi,
  createContractsApi,
  createDocumentsApi,
  createFinancialApi,
  createIntegrationsApi,
  createProposalsApi,
  createPriceRecordsApi,
  createTasksApi,
  createTenderAnalysisApi,
} from "./modules";

export * from "./axios";
export * from "./auth";
export * from "./users";
export * from "./opportunities";
export * from "./tenders";
export * from "./modules";

export function createGov360Client(config: ApiClientConfig) {
  const client = createApiClient(config);

  return {
    client,
    auth: createAuthApi(client),
    users: createUsersApi(client),
    opportunities: createOpportunitiesApi(client),
    tenders: createTendersApi(client),
    dashboard: createDashboardApi(client),
    documents: createDocumentsApi(client),
    tasks: createTasksApi(client),
    contracts: createContractsApi(client),
    proposals: createProposalsApi(client),
    priceRecords: createPriceRecordsApi(client),
    auctions: createAuctionsApi(client),
    competitors: createCompetitorsApi(client),
    financial: createFinancialApi(client),
    audit: createAuditApi(client),
    integrations: createIntegrationsApi(client),
    tenderAnalysis: createTenderAnalysisApi(client),
  };
}
