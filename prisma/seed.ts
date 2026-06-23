import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, PortalType } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL ?? ""),
});

const PORTALS = [
  { name: "Portal Nacional de Contratações Públicas", code: "PNCP", type: PortalType.FEDERAL, baseUrl: "https://pncp.gov.br" },
  { name: "Compras.gov.br", code: "COMPRAS_GOV", type: PortalType.FEDERAL, baseUrl: "https://compras.gov.br" },
  { name: "Diário Oficial da União", code: "DOU", type: PortalType.FEDERAL, baseUrl: "https://www.in.gov.br" },
  { name: "Comprasnet Contratos", code: "COMPRASNET_CONTRATOS", type: PortalType.FEDERAL, baseUrl: "https://contratos.comprasnet.gov.br" },
  { name: "Portal da Transparência / CGU", code: "CGU_TRANSPARENCIA", type: PortalType.FEDERAL, baseUrl: "https://portaldatransparencia.gov.br" },
  { name: "dados.gov.br", code: "DADOS_GOV", type: PortalType.FEDERAL, baseUrl: "https://dados.gov.br" },
  { name: "SICAF Público", code: "SICAF", type: PortalType.FEDERAL, baseUrl: "https://www3.comprasnet.gov.br/sicaf-web" },
  { name: "Licitações-e", code: "LICITACOES_E", type: PortalType.MARKET, baseUrl: "https://www.licitacoes-e.com.br" },
  { name: "BLL Compras", code: "BLL", type: PortalType.MARKET, baseUrl: "https://www.bllcompras.com" },
  { name: "BNC", code: "BNC", type: PortalType.MARKET, baseUrl: "https://www.bnc.org.br" },
  { name: "Portal de Compras Públicas", code: "PCP", type: PortalType.MARKET, baseUrl: "https://www.portaldecompraspublicas.com.br" },
  { name: "Licitanet", code: "LICITANET", type: PortalType.MARKET, baseUrl: "https://www.licitanet.com.br" },
  { name: "Compras BR", code: "COMPRAS_BR", type: PortalType.MARKET, baseUrl: "https://www.comprasbr.com.br" },
  { name: "BBMNet", code: "BBMNET", type: PortalType.MARKET, baseUrl: "https://www.bbmnet.com.br" },
  { name: "BEC/SP", code: "BEC_SP", type: PortalType.STATE, baseUrl: "https://www.bec.sp.gov.br" },
];

async function main() {
  console.log("Iniciando seed GOV360...");

  for (const portal of PORTALS) {
    await prisma.portal.upsert({
      where: { code: portal.code },
      update: portal,
      create: portal,
    });
  }

  const adminEmail = "admin@gov360.local";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Administrador",
        role: "ADMIN",
      },
    });
    console.log("Usuário admin criado: admin@gov360.local / admin123");
  }

  console.log(`Seed concluído: ${PORTALS.length} portais cadastrados.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
