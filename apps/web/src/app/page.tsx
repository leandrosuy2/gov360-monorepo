import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  Bot,
  Building2,
  CheckCircle2,
  DatabaseZap,
  FileSearch,
  FileText,
  Globe2,
  Landmark,
  LineChart,
  LockKeyhole,
  MapPinned,
  Radar,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Workflow,
} from "lucide-react";
import { Button } from "@gov360/ui";
import { BrandLogo } from "@/components/brand-logo";

const modules = [
  { icon: Radar, title: "Radar de oportunidades", text: "PNCP, Compras.gov, DOU e portais públicos em uma consulta estratégica por perfil, região, valor e modalidade." },
  { icon: FileSearch, title: "Análise de editais", text: "Extração de exigências, documentos, prazos, riscos, checklist automático e resumo executivo." },
  { icon: Workflow, title: "Gestão do processo", text: "Responsáveis, etapas, tarefas, aprovações, pendências, histórico e anexos em uma linha operacional clara." },
  { icon: Bot, title: "Pregões e lances", text: "Central de disputas, alertas operacionais, estratégias de lance e monitoramento em tempo real." },
  { icon: Trophy, title: "Contratos e financeiro", text: "Homologações, atas, contratos, aditivos, empenhos, faturamento, recebimentos e rentabilidade." },
  { icon: BarChart3, title: "BI e mercado", text: "Órgãos compradores, fornecedores vencedores, preços públicos, concorrentes e tendências por segmento." },
];

const stats = [
  ["128", "licitações abertas hoje"],
  ["R$ 42,8 mi", "valor estimado monitorado"],
  ["37", "oportunidades com alto score"],
  ["94%", "documentos válidos"],
];

const sources = ["PNCP", "Compras.gov.br", "Comprasnet Contratos", "CGU / CEIS / CNEP", "INLABS / DOU", "dados.gov.br", "Portais estaduais", "Portais municipais"];

const journey = [
  { icon: Globe2, title: "Captar", text: "Busca automática em fontes oficiais e privadas." },
  { icon: Target, title: "Priorizar", text: "Score por aderência, valor, prazo, órgão e histórico." },
  { icon: FileText, title: "Preparar", text: "Edital, certidões, documentos, tarefas e proposta." },
  { icon: LineChart, title: "Medir", text: "Resultado, contrato, financeiro, concorrência e BI." },
];

const security = [
  { icon: ShieldCheck, title: "Auditoria", text: "Registro de ações, alterações, acessos e integrações." },
  { icon: LockKeyhole, title: "Controle de acesso", text: "Perfis, permissões granulares e sessões seguras." },
  { icon: Building2, title: "Multiempresa", text: "Vários CNPJs com operação centralizada." },
  { icon: Scale, title: "Lei 14.133/2021", text: "Rotina alinhada ao ciclo moderno de compras públicas." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7fbff] text-slate-950">
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(20,184,166,0.18),transparent_30%),radial-gradient(circle_at_85%_0%,rgba(59,130,246,0.16),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f7fbff_48%,#eef7ff_100%)]" />
        <div className="absolute inset-x-0 top-0 -z-10 h-24 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl" />

        <header className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link href="/" aria-label="GOV360" className="flex items-center">
            <BrandLogo priority className="mx-0 max-w-[132px] sm:max-w-[156px]" />
          </Link>

          <nav className="hidden items-center gap-8 rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur lg:flex">
            <a href="#plataforma" className="hover:text-emerald-700">Plataforma</a>
            <a href="#fontes" className="hover:text-emerald-700">Fontes</a>
            <a href="#inteligencia" className="hover:text-emerald-700">Inteligência</a>
            <a href="#seguranca" className="hover:text-emerald-700">Segurança</a>
          </nav>

          <Button asChild className="rounded-full bg-slate-950 px-5 font-bold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800">
            <Link href="/login">Entrar</Link>
          </Button>
        </header>

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-24 lg:pt-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Inteligência, gestão e automação para vender ao governo
            </div>

            <h1 className="mt-7 max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
              Licitações públicas com clareza, controle e inteligência de mercado.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-xl">
              O GOV360 centraliza oportunidades, editais, propostas, documentos, pregões, contratos,
              concorrentes e indicadores em uma plataforma proprietária para operação corporativa.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-full bg-emerald-600 px-7 font-black text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-700">
                <Link href="/login">
                  Acessar plataforma
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-slate-300 bg-white px-7 font-bold text-slate-800 shadow-sm hover:bg-slate-50">
                <Link href="/dashboard/oportunidades">Ver oportunidades</Link>
              </Button>
            </div>

            <div className="mt-9 grid grid-cols-2 gap-3 sm:max-w-2xl lg:grid-cols-4">
              {stats.map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-sm shadow-slate-200/60 backdrop-blur">
                  <div className="text-2xl font-black tracking-tight text-slate-950">{value}</div>
                  <div className="mt-1 text-xs font-medium leading-5 text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-emerald-300/35 via-blue-300/20 to-white blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-2xl shadow-slate-300/60">
              <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50">
                <div className="flex flex-col gap-4 border-b border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">Painel GOV360</p>
                    <h2 className="mt-1 text-xl font-black text-slate-950">Radar nacional de oportunidades</h2>
                  </div>
                  <span className="w-fit rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700 ring-1 ring-red-100">Fervendo</span>
                </div>

                <div className="grid gap-4 p-4 sm:p-5">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ["Alta aderência", "37", "bg-emerald-50 text-emerald-700"],
                      ["Prazo crítico", "12", "bg-amber-50 text-amber-700"],
                      ["Valor forte", "R$ 8,9 mi", "bg-blue-50 text-blue-700"],
                    ].map(([label, value, color]) => (
                      <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-semibold text-slate-500">{label}</p>
                        <p className={`mt-2 rounded-xl px-3 py-2 text-lg font-black ${color}`}>{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <div className="mb-4 flex items-center gap-2 text-sm font-black text-slate-800">
                        <MapPinned className="h-4 w-4 text-emerald-600" />
                        Mapa por UF
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs font-black sm:grid-cols-5">
                        {["AM", "PA", "CE", "BA", "GO", "MG", "SP", "RJ", "PR", "RS"].map((uf, index) => (
                          <div
                            key={uf}
                            className={`flex h-11 items-center justify-center rounded-2xl ${
                              index % 4 === 0
                                ? "bg-red-100 text-red-700"
                                : index % 3 === 0
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {uf}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        ["PNCP", "Pregão eletrônico", "R$ 2.177.000,00"],
                        ["Compras.gov", "Registro de preço", "R$ 860.400,00"],
                        ["DOU", "Publicação nova", "Monitorar edital"],
                      ].map(([source, mode, value]) => (
                        <div key={`${source}-${mode}`} className="rounded-3xl border border-slate-200 bg-white p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-black text-slate-950">{mode}</p>
                              <p className="mt-1 text-xs font-semibold text-slate-500">{source} · {value}</p>
                            </div>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Score alto</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="plataforma" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-700">Plataforma completa</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Tudo que a equipe precisa antes, durante e depois da disputa.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Uma operação mais visual, menos manual e muito mais segura para transformar dados públicos em receita.</p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <div key={module.title} className="group rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-black">{module.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{module.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="fontes" className="bg-[#eef7ff] py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-700">Dados oficiais</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Fontes públicas organizadas para decisão comercial.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              O GOV360 foi pensado para conectar APIs, dados abertos, diários oficiais, contratos, sanções e histórico de compras.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {sources.map((source) => (
              <div key={source} className="flex items-center gap-3 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <DatabaseZap className="h-5 w-5" />
                </div>
                <span className="font-black text-slate-800">{source}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="inteligencia" className="bg-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-700">Jornada operacional</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Menos improviso. Mais método, prioridade e previsibilidade.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {journey.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <Icon className="h-6 w-6 text-emerald-700" />
                    <h3 className="mt-4 text-lg font-black">{step.title}</h3>
                    <p className="mt-2 leading-7 text-slate-600">{step.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/70">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">BI Executivo</p>
            <h3 className="mt-3 text-3xl font-black">Indicadores vivos para diretoria.</h3>
            <div className="mt-8 space-y-5">
              {[
                ["Taxa de sucesso", "68%", "w-[68%]", "bg-emerald-400"],
                ["Valor homologado", "R$ 18,4 mi", "w-[82%]", "bg-blue-400"],
                ["Documentos válidos", "94%", "w-[94%]", "bg-amber-300"],
                ["Prazos críticos tratados", "31", "w-[56%]", "bg-red-400"],
              ].map(([label, value, width, color]) => (
                <div key={label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-300">{label}</span>
                    <span className="font-black">{value}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full rounded-full ${color} ${width}`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5">
              <p className="leading-7 text-emerald-50">
                Mapa de oportunidades, ranking de órgãos, fornecedores vencedores, preços públicos, contratos ativos e produtividade da equipe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="seguranca" className="bg-slate-950 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-300">Sistema proprietário</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Controle total sobre dados, acesso e operação.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                O GOV360 não é um SaaS genérico: é uma base operacional para a organização controlar integrações, rotinas, segurança e inteligência.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {security.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <Icon className="h-6 w-6 text-emerald-300" />
                    <h3 className="mt-4 font-black">{item.title}</h3>
                    <p className="mt-2 leading-7 text-slate-400">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 to-blue-700 p-1 shadow-2xl shadow-blue-200">
          <div className="rounded-[1.8rem] bg-white/95 p-8 text-center backdrop-blur sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Landmark className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-5xl">Transforme licitação pública em operação previsível e lucrativa.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Capte antes, analise melhor, participe com controle, acompanhe contratos e decida com dados reais.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-full bg-slate-950 px-8 font-black text-white hover:bg-slate-800">
                <Link href="/login">Entrar no GOV360</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-slate-300 px-8 font-black">
                <Link href="/dashboard">Ver dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-5 py-8 text-sm text-slate-500 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <BrandLogo className="mx-0 max-w-[118px]" />
          <p>GOV360 — inteligência, gestão e automação para licitações públicas.</p>
        </div>
      </footer>
    </main>
  );
}
