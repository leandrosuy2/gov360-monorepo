import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { serializeDates } from "@/common/utils/serialize";
import { env } from "@/env";

interface PncpItem {
  numeroControlePNCP?: string;
  orgaoEntidade?: { razaoSocial?: string; poderId?: string };
  unidadeOrgao?: { ufSigla?: string; municipioNome?: string };
  objetoCompra?: string;
  valorTotalEstimado?: number;
  dataAberturaProposta?: string;
  dataPublicacaoPncp?: string;
  linkSistemaOrigem?: string;
  modalidadeNome?: string;
}

interface PncpResponse {
  data?: PncpItem[];
  totalRegistros?: number;
  totalPaginas?: number;
}

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);
  private readonly PNCP_BASE = env.PNCP_API_URL;

  private readonly connectors = [
    { code: "PNCP", name: "Portal Nacional de Contratações Públicas", area: "Oportunidades e licitações", baseUrl: env.PNCP_API_URL, auth: "PÚBLICA", mode: "API", configured: true, credentialEnv: [], capabilities: ["contratações", "editais", "atas", "contratos", "órgãos", "itens", "documentos"] },
    { code: "COMPRAS_GOV", name: "Compras.gov.br Dados Abertos", area: "Compras federais", baseUrl: env.COMPRAS_GOV_API_URL, auth: "PÚBLICA", mode: "API", configured: true, credentialEnv: [], capabilities: ["licitações", "pregões", "itens", "dispensas", "CATMAT", "CATSER"] },
    { code: "COMPRASNET_CONTRATOS", name: "Comprasnet Contratos", area: "Contratos federais", baseUrl: env.COMPRASNET_CONTRATOS_API_URL, auth: "PÚBLICA", mode: "API", configured: true, credentialEnv: [], capabilities: ["contratos", "órgãos", "fornecedores", "itens", "atas", "empenhos"] },
    { code: "CGU_TRANSPARENCIA", name: "Portal da Transparência / CGU", area: "Sanções de empresas", baseUrl: env.CGU_TRANSPARENCIA_API_URL, auth: "CHAVE", mode: "API", configured: Boolean(env.CGU_API_KEY), credentialEnv: ["CGU_API_KEY"], capabilities: ["CEIS", "CNEP", "inidôneos", "impedimentos"] },
    { code: "INLABS", name: "INLABS / Imprensa Nacional", area: "Diário Oficial da União", baseUrl: env.INLABS_URL, auth: "CONTA", mode: "DOWNLOAD", configured: Boolean(env.INLABS_EMAIL && env.INLABS_PASSWORD), credentialEnv: ["INLABS_EMAIL", "INLABS_PASSWORD"], capabilities: ["edições DOU", "PDF", "XML", "clipping"] },
    { code: "DADOS_GOV", name: "dados.gov.br", area: "Dados governamentais", baseUrl: env.DADOS_GOV_API_URL, auth: "PÚBLICA", mode: "CATÁLOGO", configured: true, credentialEnv: [], capabilities: ["datasets", "organizações", "recursos", "busca"] },
    { code: "SICAF", name: "SICAF Público", area: "Regularidade de fornecedor", baseUrl: env.SICAF_PUBLIC_URL, auth: "CONSULTA WEB", mode: "ASSISTIDA", configured: true, credentialEnv: [], capabilities: ["restrições para contratar", "consulta de fornecedor"] },
  ] as const;

  constructor(private readonly prisma: PrismaService) {}

  getCatalog() {
    return this.connectors.map((connector) => ({ ...connector, credentialEnv: [...connector.credentialEnv], capabilities: [...connector.capabilities] }));
  }

  async testConnector(code: string) {
    const connector = this.connectors.find((item) => item.code === code.toUpperCase());
    if (!connector) throw new NotFoundException("Conector não encontrado");
    if (!connector.configured) return { code: connector.code, status: "NOT_CONFIGURED", checkedAt: new Date().toISOString(), latencyMs: null };
    const startedAt = Date.now();
    const headers: Record<string, string> = { Accept: "application/json,text/html;q=0.9", "User-Agent": "GOV360/0.1" };
    if (connector.code === "CGU_TRANSPARENCIA" && env.CGU_API_KEY) headers["chave-api-dados"] = env.CGU_API_KEY;
    try {
      const response = await fetch(connector.baseUrl, { method: "GET", headers, signal: AbortSignal.timeout(env.INTEGRATION_TIMEOUT_MS), redirect: "follow" });
      return { code: connector.code, status: response.status < 500 ? "ONLINE" : "DEGRADED", httpStatus: response.status, latencyMs: Date.now() - startedAt, checkedAt: new Date().toISOString() };
    } catch (error) {
      return { code: connector.code, status: "OFFLINE", latencyMs: Date.now() - startedAt, checkedAt: new Date().toISOString(), message: error instanceof Error ? error.message : "Falha de conexão" };
    }
  }

  async getConnectorStatus() {
    return Promise.all(this.connectors.map((connector) => this.testConnector(connector.code)));
  }

  async listPortals() {
    const portals = await this.prisma.portal.findMany({ orderBy: { name: "asc" } });
    return portals.map((p) => serializeDates(p));
  }

  async listIntegrationLogs(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.integrationLog.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } }),
      this.prisma.integrationLog.count(),
    ]);
    return { data: data.map((l) => serializeDates(l)), total, page, limit };
  }

  async syncPncp(params: { daysBack?: number; keywords?: string; state?: string }) {
    const daysBack = params.daysBack ?? 7;
    const end = new Date();
    const start = new Date(end.getTime() - daysBack * 24 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, "");

    let imported = 0;
    let skipped = 0;
    const modalityCodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const maxPagesPerModality = 5;
    const processedIds = new Set<string>();
    const sourceErrors: { modality: number; status: number; message: string }[] = [];

    try {
      for (const modalityCode of modalityCodes) {
        let page = 1;
        while (page <= maxPagesPerModality) {
          const query = new URLSearchParams({
            dataInicial: fmt(start),
            dataFinal: fmt(end),
            codigoModalidadeContratacao: String(modalityCode),
            pagina: String(page),
            tamanhoPagina: "50",
          });
          const url = `${this.PNCP_BASE.replace(/\/$/, "")}/contratacoes/publicacao?${query.toString()}`;
          const res = await fetch(url, {
            headers: { Accept: "application/json", "User-Agent": "GOV360/0.1" },
            signal: AbortSignal.timeout(env.INTEGRATION_TIMEOUT_MS),
          });

          if (!res.ok) {
            const responseBody = (await res.text()).slice(0, 500);
            sourceErrors.push({ modality: modalityCode, status: res.status, message: responseBody || res.statusText });
            this.logger.warn(`PNCP modalidade ${modalityCode} retornou ${res.status}: ${responseBody}`);
            break;
          }

          const json = (await res.json()) as PncpResponse;
          const items = json.data ?? [];

          if (items.length === 0) break;

          for (const item of items) {
            const title = item.objetoCompra?.slice(0, 200) ?? "Sem título";
            const object = item.objetoCompra ?? "";
            const agency = item.orgaoEntidade?.razaoSocial ?? "Órgão não informado";
            const externalId = item.numeroControlePNCP ?? `${agency}-${modalityCode}-${page}-${imported}`;

            if (processedIds.has(externalId)) { skipped++; continue; }
            processedIds.add(externalId);

            if (params.keywords) {
              const kw = params.keywords.toLowerCase();
              if (!title.toLowerCase().includes(kw) && !object.toLowerCase().includes(kw)) {
                skipped++;
                continue;
              }
            }

            if (params.state && item.unidadeOrgao?.ufSigla !== params.state) {
              skipped++;
              continue;
            }

            try {
              await this.prisma.opportunity.upsert({
              where: { source_externalId: { source: "PNCP", externalId } },
              create: {
                externalId,
                title,
                object,
                agency,
                source: "PNCP",
                modality: item.modalidadeNome,
                state: item.unidadeOrgao?.ufSigla,
                city: item.unidadeOrgao?.municipioNome,
                estimatedValue: item.valorTotalEstimado,
                publishedAt: item.dataPublicacaoPncp ? new Date(item.dataPublicacaoPncp) : undefined,
                openingAt: item.dataAberturaProposta ? new Date(item.dataAberturaProposta) : undefined,
                sourceUrl: item.linkSistemaOrigem,
              },
              update: {
                title,
                object,
                estimatedValue: item.valorTotalEstimado,
                openingAt: item.dataAberturaProposta ? new Date(item.dataAberturaProposta) : undefined,
              },
              });
              imported++;
            } catch {
              skipped++;
            }
          }

          if (json.totalPaginas && page >= json.totalPaginas) break;
          page++;
        }
      }

      if (sourceErrors.length === modalityCodes.length) {
        throw new Error(`Todas as modalidades do PNCP falharam. Primeiro erro: HTTP ${sourceErrors[0]?.status} ${sourceErrors[0]?.message}`);
      }

      await this.prisma.portal.update({ where: { code: "PNCP" }, data: { lastSyncAt: new Date() } });

      await this.prisma.integrationLog.create({
        data: {
          portal: "PNCP",
          action: "SYNC",
          status: "SUCCESS",
          message: `Importadas ${imported} oportunidades, ${skipped} ignoradas, ${sourceErrors.length} modalidades com erro`,
          metadata: { daysBack, keywords: params.keywords, state: params.state, modalityCodes, sourceErrors },
        },
      });

      return { imported, skipped, daysBack, modalitiesProcessed: modalityCodes.length - sourceErrors.length, modalityErrors: sourceErrors };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      this.logger.error(`Falha sync PNCP: ${message}`);

      await this.prisma.integrationLog.create({
        data: { portal: "PNCP", action: "SYNC", status: "ERROR", message },
      });

      throw error;
    }
  }

  async syncComprasGov(params: { keywords?: string; state?: string }) {
    let imported = 0;
    let skipped = 0;
    let page = 1;
    const maxPages = 5;
    const processedIds = new Set<string>();
    const text = (value: unknown) => typeof value === "string" ? value : undefined;
    const numeric = (value: unknown) => typeof value === "number" ? value : typeof value === "string" ? Number(value.replace(",", ".")) || undefined : undefined;
    const nested = (record: Record<string, unknown>, key: string, child: string) => {
      const parent = record[key];
      return parent && typeof parent === "object" ? text((parent as Record<string, unknown>)[child]) : undefined;
    };

    try {
      while (page <= maxPages) {
        const base = env.COMPRAS_GOV_API_URL.replace(/\/$/, "");
        const path = env.COMPRAS_GOV_TENDERS_PATH.startsWith("/") ? env.COMPRAS_GOV_TENDERS_PATH : `/${env.COMPRAS_GOV_TENDERS_PATH}`;
        const query = new URLSearchParams({ pagina: String(page), tamanhoPagina: "50" });
        const response = await fetch(`${base}${path}?${query}`, {
          headers: { Accept: "application/json", "User-Agent": "GOV360/0.1" },
          signal: AbortSignal.timeout(env.INTEGRATION_TIMEOUT_MS),
        });
        if (!response.ok) {
          const body = (await response.text()).slice(0, 500);
          throw new Error(`Compras.gov retornou HTTP ${response.status}: ${body || response.statusText}`);
        }
        const payload = await response.json() as Record<string, unknown>;
        const candidates = payload.resultado ?? payload.data ?? payload.results;
        const items = Array.isArray(candidates) ? candidates as Record<string, unknown>[] : [];
        if (!items.length) break;

        for (const item of items) {
          const object = text(item.objetoCompra) ?? text(item.objeto) ?? text(item.descricaoObjeto) ?? "Objeto não informado";
          const agency = nested(item, "orgaoEntidade", "razaoSocial") ?? text(item.nomeOrgao) ?? text(item.orgao) ?? "Órgão não informado";
          const externalId = text(item.numeroControlePNCP) ?? text(item.numeroCompra) ?? text(item.idCompra) ?? text(item.id);
          if (!externalId || processedIds.has(externalId)) { skipped++; continue; }
          processedIds.add(externalId);
          const state = nested(item, "unidadeOrgao", "ufSigla") ?? text(item.uf) ?? text(item.siglaUf);
          if (params.keywords && !object.toLowerCase().includes(params.keywords.toLowerCase())) { skipped++; continue; }
          if (params.state && state !== params.state) { skipped++; continue; }

          const published = text(item.dataPublicacaoPncp) ?? text(item.dataPublicacao);
          const opening = text(item.dataAberturaProposta) ?? text(item.dataAbertura);
          await this.prisma.opportunity.upsert({
            where: { source_externalId: { source: "COMPRAS_GOV", externalId } },
            create: {
              externalId,
              title: object.slice(0, 200),
              object,
              agency,
              source: "COMPRAS_GOV",
              modality: text(item.modalidadeNome) ?? text(item.nomeModalidade),
              state,
              city: nested(item, "unidadeOrgao", "municipioNome") ?? text(item.municipio),
              estimatedValue: numeric(item.valorTotalEstimado) ?? numeric(item.valorEstimado),
              publishedAt: published && !Number.isNaN(Date.parse(published)) ? new Date(published) : undefined,
              openingAt: opening && !Number.isNaN(Date.parse(opening)) ? new Date(opening) : undefined,
              sourceUrl: text(item.linkSistemaOrigem) ?? text(item.url),
            },
            update: { title: object.slice(0, 200), object, agency, state },
          });
          imported++;
        }
        const totalPages = numeric(payload.totalPaginas);
        if (totalPages && page >= totalPages) break;
        page++;
      }

      await this.prisma.portal.updateMany({ where: { code: "COMPRAS_GOV" }, data: { lastSyncAt: new Date() } });
      await this.prisma.integrationLog.create({ data: { portal: "COMPRAS_GOV", action: "SYNC", status: "SUCCESS", message: `Importadas ${imported} oportunidades, ${skipped} ignoradas`, metadata: params } });
      return { imported, skipped, pagesProcessed: page };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      this.logger.error(`Falha sync Compras.gov: ${message}`);
      await this.prisma.integrationLog.create({ data: { portal: "COMPRAS_GOV", action: "SYNC", status: "ERROR", message } });
      throw error;
    }
  }
}
