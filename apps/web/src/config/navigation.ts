export interface NavItem {
  title: string;
  href: string;
  description?: string;
  group: string;
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Painel Executivo", href: "/dashboard", group: "Principal", description: "Indicadores estratégicos" },
  { title: "Oportunidades", href: "/dashboard/oportunidades", group: "Inteligência", description: "Busca e monitoramento" },
  { title: "Licitações", href: "/dashboard/licitacoes", group: "Gestão", description: "Processos licitatórios" },
  { title: "Análise de Editais", href: "/dashboard/editais", group: "Gestão", description: "Interpretação de editais" },
  { title: "Documentos", href: "/dashboard/documentos", group: "Gestão", description: "Gestão documental" },
  { title: "Certidões", href: "/dashboard/certidoes", group: "Gestão", description: "Regularidade fiscal" },
  { title: "Propostas", href: "/dashboard/propostas", group: "Comercial", description: "Elaboração de propostas" },
  { title: "Simulação", href: "/dashboard/simulacao", group: "Comercial", description: "Estratégia comercial" },
  { title: "Pregões", href: "/dashboard/pregoes", group: "Disputa", description: "Pregões eletrônicos" },
  { title: "Robô de Lances", href: "/dashboard/robo", group: "Disputa", description: "Automação de lances" },
  { title: "Chat Pregoeiro", href: "/dashboard/chat", group: "Disputa", description: "Comunicações" },
  { title: "Workflow", href: "/dashboard/workflow", group: "Operacional", description: "Tarefas e aprovações" },
  { title: "Contratos", href: "/dashboard/contratos", group: "Pós-venda", description: "Gestão contratual" },
  { title: "Atas de Preço", href: "/dashboard/atas", group: "Pós-venda", description: "Registro de preços" },
  { title: "Financeiro", href: "/dashboard/financeiro", group: "Pós-venda", description: "Empenhos e recebimentos" },
  { title: "Mercado", href: "/dashboard/mercado", group: "Inteligência", description: "Análise de mercado" },
  { title: "Concorrentes", href: "/dashboard/concorrentes", group: "Inteligência", description: "Monitoramento" },
  { title: "Auditoria", href: "/dashboard/auditoria", group: "Sistema", description: "Logs e rastreabilidade" },
  { title: "Integrações", href: "/dashboard/integracoes", group: "Sistema", description: "APIs e fontes oficiais" },
];

export const NAV_GROUPS = [...new Set(NAV_ITEMS.map((item) => item.group))];

export const TENDER_STATUS_LABELS: Record<string, string> = {
  NEW: "Nova",
  ANALYZING: "Em análise",
  APPROVED: "Aprovada",
  REJECTED: "Reprovada",
  DOCUMENTATION_PENDING: "Documentação pendente",
  PROPOSAL: "Em proposta",
  PARTICIPATING: "Participando",
  DISPUTE: "Em disputa",
  QUALIFICATION: "Habilitação",
  APPEAL: "Recurso",
  AWARDED: "Homologada",
  LOST: "Perdida",
  CONTRACTED: "Contratada",
  CLOSED: "Encerrada",
};

export const OPPORTUNITY_STATUS_LABELS: Record<string, string> = {
  NEW: "Nova",
  ANALYZING: "Em análise",
  APPROVED: "Aprovada",
  REJECTED: "Reprovada",
  IGNORED: "Ignorada",
  FAVORITED: "Favorita",
  CONVERTED: "Convertida",
};

export const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
};
