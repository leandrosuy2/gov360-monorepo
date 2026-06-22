import { z } from "zod";

export const apiEnvSchema = z.object({
  DATABASE_URL: z.string().url().or(z.string().startsWith("postgresql://")),
  API_PORT: z.coerce.number().default(3001),
  API_URL: z.string().url().default("http://localhost:3001"),
  JWT_SECRET: z.string().min(8),
  JWT_EXPIRES_IN: z.string().default("7d"),
  INTEGRATION_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
  PNCP_API_URL: z.string().url().default("https://pncp.gov.br/api/consulta/v1"),
  COMPRAS_GOV_API_URL: z.string().url().default("https://dadosabertos.compras.gov.br"),
  COMPRAS_GOV_TENDERS_PATH: z.string().default("/modulo-licitacoes/1_consultarLicitacao"),
  COMPRASNET_CONTRATOS_API_URL: z.string().url().default("https://contratos.comprasnet.gov.br/api"),
  CGU_TRANSPARENCIA_API_URL: z.string().url().default("https://api.portaldatransparencia.gov.br/api-de-dados"),
  CGU_API_KEY: z.string().optional(),
  INLABS_URL: z.string().url().default("https://inlabs.in.gov.br"),
  INLABS_EMAIL: z.union([z.string().email(), z.literal("")]).optional(),
  INLABS_PASSWORD: z.string().optional(),
  DADOS_GOV_API_URL: z.string().url().default("https://dados.gov.br/dados/api/3"),
  SICAF_PUBLIC_URL: z.string().url().default("https://www3.comprasnet.gov.br/sicaf-web/index.jsf"),
});

export const webEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3001"),
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;
export type WebEnv = z.infer<typeof webEnvSchema>;

export function parseApiEnv(env: NodeJS.ProcessEnv = process.env): ApiEnv {
  return apiEnvSchema.parse(env);
}

export function parseWebEnv(env: NodeJS.ProcessEnv = process.env): WebEnv {
  return webEnvSchema.parse(env);
}
