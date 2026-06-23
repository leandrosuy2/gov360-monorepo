import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  Bot,
  Building2,
  CalendarClock,
  CheckCircle2,
  Database,
  FileCheck2,
  FileSearch,
  FileText,
  Landmark,
  LockKeyhole,
  MapPinned,
  Radar,
  Scale,
  ShieldCheck,
  Target,
  Trophy,
  Workflow,
} from "lucide-react";
import { Button } from "@gov360/ui";
import { BrandLogo } from "@/components/brand-logo";

const indicators = [
  { label: "Oportunidades monitoradas", value: "1.284" },
  { label: "Valor estimado no radar", value: "R$ 42,8 mi" },
  { label: "Licitações em análise", value: "86" },
  { label: "Prazos críticos", value: "12" },
];

const opportunities = [
  {
    source: "PNCP",
    title: "Aquisição de equipamentos e serviços técnicos",
    agency: "Ministério da Gestão e Inovação",
    modality: "Pregão eletrônico",
    date: "16/07/2026",
    value: "R$ 2.177.000,00",
    score: "92%",
    tone: "emerald",
  },
  {
    source: "Compras.gov.br",
    title: "Registro de preços para fornecimento continuado",
    agency: "Universidade Federal",
    modality: "SRP",
    date: "09/07/2026",
    value: "R$ 860.400,00",
    score: "81%",
    tone: "blue",
  },
  {
    source: "DOU",
    title: "Publicação com alteração de edital",
    agency: "Autarquia Federal",
    modality: "Clipping oficial",
    date: "Hoje",
    value: "Monitorar",
    score: "Atenção",
    tone: "amber",
  },
];

const modules = [
  { icon: Radar, title: "Oportunidades", text: "Busca por palavra-chave, CNAE, CATMAT, CATSER, estado, município, órgão, modalidade e valor." },
  { icon: FileSearch, title: "Editais", text: "Leitura de PDF, exigências, documentos obrigatórios, prazos, checklist e mapa de riscos." },
  { icon: FileCheck2, title: "Documentos", text: "Certidões, vencimentos, versionamento, histórico, categorias e alertas de regularidade." },
  { icon: Workflow, title: "Gestão de licitações", text: "Etapas, status, responsáveis, tarefas, pendências, observações, arquivos e timeline." },
  { icon: Bot, title: "Pregões e lances", text: "Central de pregões ativos, alertas operacionais, histórico e estratégia de disputa." },
  { icon: Trophy, title: "Contratos e financeiro", text: "Contratos, atas, aditivos, empenhos, faturamento, recebimentos e rentabilidade." },
  { icon: BarChart3, title: "BI executivo", text: "Taxa de sucesso, valor disputado, homologado, contratado, recebido e produtividade." },
  { icon: Building2, title: "Mercado e concorrentes", text: "Órgãos compradores, fornecedores vencedores, preços praticados e ranking de concorrentes." },
];

const sources = [
  "PNCP",
  "Compras.gov.br",
  "Comprasnet Contratos",
  "Portal da Transparência / CGU",
  "INLABS / DOU",
  "dados.gov.br",
  "Portais estaduais",
  "Portais municipais",
];

const workflow = [
  ["01", "Captar", "Monitoramento automático nas fontes públicas."],
  ["02", "Analisar", "Score, aderência, risco, prazo e valor estimado."],
  ["03", "Organizar", "Responsáveis, tarefas, documentos e aprovações."],
  ["04", "Participar", "Proposta, pregão, recursos e homologação."],
  ["05", "Executar", "Contrato, ata, financeiro, fiscalização e BI."],
];

const security = [
  { icon: ShieldCheck, title: "Auditoria completa", text: "Registro de ações, alterações, acessos e integrações." },
  { icon: LockKeyhole, title: "Permissões granulares", text: "Controle por perfil, módulo, operação e empresa." },
  { icon: BellRing, title: "Alertas operacionais", text: "Prazos, certidões, mensagens, documentos e movimentações." },
  { icon: Scale, title: "Base para Lei 14.133/2021", text: "Organização do ciclo de contratação pública de ponta a ponta." },
];

function scoreClass(tone: string) {
  if (tone === "blue") return "bg-blue-50 text-blue-700 ring-blue-100";
  if (tone === "amber") return "bg-amber-50 text-amber-700 ring-amber-100";
  return "bg-emerald-50 text-emerald-700 ring-emerald-100";
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="GOV360">
            <BrandLogo priority className="mx-0 max-w-[128px] sm:max-w-[150px]" />
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex">
            <a href="#modulos" className="hover:text-emerald-700">Módulos</a>
            <a href="#fontes" className="hover:text-emerald-700">Fontes</a>
            <a href="#fluxo" className="hover:text-emerald-700">Operação</a>
            <a href="#seguranca" className="hover:text-emerald-700">Segurança</a>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="hidden rounded-full border-slate-300 bg-white font-semibold sm:inline-flex">
              <Link href="/dashboard/oportunidades">Oportunidades</Link>
            </Button>
            <Button asChild className="rounded-full bg-emerald-700 font-semibold text-white hover:bg-emerald-800">
              <Link href="/login">Acessar</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_55%,#eef7f4_100%)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
          <div className="flex min-w-0 flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-800">
              <Landmark className="h-4 w-4" />
              Plataforma corporativa de licitações públicas
            </div>

            <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Gestão inteligente para captar, analisar e vencer licitações com controle.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              O GOV360 organiza oportunidades, editais, documentos, propostas, pregões, contratos,
              financeiro, mercado e concorrentes em um ambiente único, proprietário e seguro.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-emerald-700 px-6 font-bold text-white hover:bg-emerald-800">
                <Link href="/login">
                  Entrar na plataforma
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-slate-300 bg-white px-6 font-bold text-slate-800">
                <Link href="/dashboard">Ver dashboard</Link>
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-2xl lg:grid-cols-4">
              {indicators.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xl font-black text-slate-950">{item.value}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/70 sm:p-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-950 p-4 text-white sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Consulta de licitações</p>
                  <h2 className="mt-1 text-base font-black sm:text-lg">Oportunidades priorizadas por aderência</h2>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                  <MapPinned className="h-4 w-4 text-emerald-300" />
                  Mapa nacional ativo
                </div>
              </div>

              <div className="grid gap-3 bg-slate-50 p-3 sm:p-4">
                {opportunities.map((item) => (
                  <article key={`${item.source}-${item.title}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{item.source}</span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{item.modality}</span>
                        </div>
                        <h3 className="mt-3 text-sm font-black leading-6 text-slate-950 sm:text-base">{item.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{item.agency}</p>
                      </div>
                      <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ring-1 ${scoreClass(item.tone)}`}>{item.score}</span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-semibold text-slate-500">Abertura</p>
                        <p className="mt-1 font-bold text-slate-900">{item.date}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
                        <p className="text-xs font-semibold text-slate-500">Valor estimado</p>
                        <p className="mt-1 font-bold text-slate-900">{item.value}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="modulos" className="bg-white py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Módulos principais</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
              Uma plataforma para a rotina real de quem vende para o governo.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Nada solto: oportunidade, edital, documento, proposta, disputa, contrato e financeiro conectados no mesmo processo.
            </p>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <div key={module.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-black text-slate-950">{module.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{module.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="fontes" className="border-y border-slate-200 bg-slate-50 py-14 sm:py-18 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-700">Integrações e dados públicos</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
              Dados oficiais organizados para análise rápida.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              A base do GOV360 foi desenhada para consumir oportunidades, contratos, sanções, publicações oficiais e histórico de compras.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {sources.map((source) => (
              <div key={source} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Database className="h-5 w-5" />
                </div>
                <span className="text-sm font-black text-slate-800">{source}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="fluxo" className="bg-white py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Operação guiada</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                Do radar ao contrato, cada etapa tem dono, prazo e evidência.
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                O time acompanha o ciclo licitatório em uma linha simples, com alertas e histórico completo.
              </p>
            </div>

            <div className="grid gap-3">
              {workflow.map(([number, title, text]) => (
                <div key={number} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">{number}</div>
                  <div>
                    <h3 className="font-black text-slate-950">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="seguranca" className="bg-slate-950 py-14 text-white sm:py-18 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Governança</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
              Sistema proprietário, seguro e preparado para operação corporativa.
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              Controle de acesso, auditoria, alertas, multiempresa e segurança para dados sensíveis da operação pública.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {security.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <Icon className="h-5 w-5 text-emerald-300" />
                  <h3 className="mt-4 font-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-6 text-center shadow-sm sm:p-10">
          <CalendarClock className="mx-auto h-9 w-9 text-emerald-700" />
          <h2 className="mx-auto mt-4 max-w-3xl text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
            Menos perda de prazo, mais controle e decisões comerciais melhores.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Transforme dados públicos em uma operação previsível para participar, vencer, contratar e medir resultado.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full bg-emerald-700 px-7 font-bold text-white hover:bg-emerald-800">
              <Link href="/login">Acessar GOV360</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-slate-300 bg-white px-7 font-bold">
              <Link href="/dashboard/oportunidades">Abrir oportunidades</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <BrandLogo className="mx-0 max-w-[112px]" />
          <p>GOV360 — inteligência, gestão e automação para licitações públicas.</p>
        </div>
      </footer>
    </main>
  );
}
