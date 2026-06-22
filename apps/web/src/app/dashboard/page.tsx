"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, BarChart3, BriefcaseBusiness, CalendarClock, FileWarning, Landmark, Radar, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gov360/ui";
import { formatCurrency, formatDate } from "@gov360/utils";
import type { DashboardStats } from "@gov360/types";
import { api } from "@/services/api";

function StatCard({ icon: Icon, title, value, description, tone }: { icon: typeof Radar; title: string; value: string | number; description?: string; tone: "cyan" | "emerald" | "amber" | "violet" | "red" }) {
  const colors = {
    cyan: "bg-cyan-50 text-cyan-700 ring-cyan-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    red: "bg-red-50 text-red-700 ring-red-100",
  };
  return <Card className="overflow-hidden"><CardContent className="flex items-center gap-4 p-5"><span className={`grid h-12 w-12 place-items-center rounded-2xl ring-1 ${colors[tone]}`}><Icon className="h-5 w-5" /></span><div className="min-w-0"><p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p><p className="truncate text-2xl font-black text-slate-900">{value}</p>{description && <p className="truncate text-xs text-muted-foreground">{description}</p>}</div></CardContent></Card>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.dashboard.stats().then(setStats).catch(() => setError("Erro ao carregar indicadores. Verifique a API e o banco de dados."));
  }, []);

  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  if (!stats) return <p className="text-muted-foreground">Carregando indicadores...</p>;

  const successBase = stats.tenders.awarded + stats.tenders.lost;
  const successRate = successBase > 0 ? Math.round((stats.tenders.awarded / successBase) * 100) : 0;
  const opportunityValue = Number(stats.opportunities.estimatedValue ?? 0);
  const conversionRate = stats.opportunities.total > 0 ? Math.round((stats.tenders.total / stats.opportunities.total) * 100) : 0;

  return <div className="space-y-6">
    <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-900 p-6 text-white shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-cyan-200"><Radar className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-[.22em]">GOV360 Executivo</span></div>
          <h2 className="text-2xl font-black tracking-tight md:text-3xl">Painel estratégico de licitações</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-200">Visão operacional e comercial com oportunidades, licitações, documentos, contratos e financeiro em tempo real.</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-4 text-right ring-1 ring-white/15">
          <p className="text-xs text-cyan-100">Taxa de sucesso</p>
          <p className="text-3xl font-black">{successRate}%</p>
          <p className="text-[11px] text-slate-300">{stats.tenders.awarded} vencidas · {stats.tenders.lost} perdidas</p>
        </div>
      </div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard icon={Target} title="Oportunidades" value={stats.opportunities.total} description={`${stats.opportunities.new} novas · ${formatCurrency(opportunityValue)}`} tone="cyan" />
      <StatCard icon={BriefcaseBusiness} title="Licitações ativas" value={stats.tenders.active} description={`${stats.tenders.participating} em participação`} tone="violet" />
      <StatCard icon={TrendingUp} title="Conversão" value={`${conversionRate}%`} description={`${stats.tenders.total} processos criados`} tone="emerald" />
      <StatCard icon={CalendarClock} title="Contratos ativos" value={stats.contracts.active} description={`${stats.contracts.expiringSoon} vencendo em 30 dias`} tone="amber" />
      <StatCard icon={FileWarning} title="Documentos vencendo" value={stats.documents.expiring + stats.documents.expired} description={`${stats.documents.expired} vencidos`} tone={stats.documents.expired ? "red" : "emerald"} />
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
      <Card>
        <CardHeader><CardTitle className="text-base">Órgãos com maior volume de oportunidades</CardTitle><CardDescription>Baseado nas oportunidades importadas das fontes oficiais</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          {(stats.intelligence?.topAgencies ?? []).slice(0, 7).map((item, index) => <div key={item.agency} className="grid gap-3 rounded-2xl border bg-white p-3 sm:grid-cols-[36px_1fr_auto] sm:items-center"><span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-xs font-black text-white">#{index + 1}</span><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{item.agency}</p><p className="text-xs text-muted-foreground">{item.count} oportunidades encontradas</p></div><p className="text-sm font-bold text-emerald-700">{formatCurrency(Number(item.totalValue))}</p></div>)}
          {!stats.intelligence?.topAgencies?.length && <Empty text="Sem oportunidades importadas para ranquear órgãos." />}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Distribuição por UF</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {(stats.intelligence?.opportunitiesByState ?? []).slice(0, 8).map((item) => <div key={item.state ?? "NA"} className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><span className="font-bold">{item.state ?? "Nacional"}</span><span className="text-sm text-muted-foreground">{item.count} · {formatCurrency(Number(item.totalValue))}</span></div>)}
            {!stats.intelligence?.opportunitiesByState?.length && <Empty text="Sem UF informada nas oportunidades." />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Alertas executivos</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Alert text={`${stats.tasks.overdue} tarefas em atraso`} active={stats.tasks.overdue > 0} />
            <Alert text={`${stats.documents.expired} documentos vencidos`} active={stats.documents.expired > 0} />
            <Alert text={`${stats.contracts.expiringSoon} contratos vencendo`} active={stats.contracts.expiringSoon > 0} />
          </CardContent>
        </Card>
      </div>
    </div>

    <div className="grid gap-6 lg:grid-cols-3">
      <Card><CardHeader><CardTitle className="text-base">Próximas oportunidades</CardTitle></CardHeader><CardContent className="space-y-3">{stats.recent?.opportunities.map((item) => <MiniItem key={item.id} title={item.object} subtitle={`${item.agency} · ${item.state ?? "BR"} · ${item.openingAt ? formatDate(item.openingAt) : "sem data"}`} value={item.estimatedValue ? formatCurrency(Number(item.estimatedValue)) : "—"} />)}{!stats.recent?.opportunities.length && <Empty text="Nenhuma oportunidade encontrada." />}</CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Licitações em andamento</CardTitle></CardHeader><CardContent className="space-y-3">{stats.recent?.tenders.map((item) => <MiniItem key={item.id} title={item.noticeNumber} subtitle={`${item.agency} · ${item.status}`} value={item.openingAt ? formatDate(item.openingAt) : "—"} />)}{!stats.recent?.tenders.length && <Empty text="Nenhuma licitação cadastrada." />}</CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Documentos próximos do vencimento</CardTitle></CardHeader><CardContent className="space-y-3">{stats.recent?.expiringDocuments.map((item) => <MiniItem key={item.id} title={item.name} subtitle={`${item.category} · ${item.status}`} value={item.expiresAt ? formatDate(item.expiresAt) : "—"} />)}{!stats.recent?.expiringDocuments.length && <Empty text="Nenhum vencimento próximo." />}</CardContent></Card>
    </div>

    <Card>
      <CardHeader><CardTitle className="text-base">Financeiro contratado</CardTitle></CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <Money label="Contratado" value={stats.financial.totalContracted} />
        <Money label="Recebido" value={stats.financial.totalReceived} />
        <Money label="A receber" value={stats.financial.totalPending} />
      </CardContent>
    </Card>
  </div>;
}

function Alert({ text, active }: { text: string; active: boolean }) {
  return <div className={`flex items-center gap-2 rounded-xl p-3 ${active ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}><AlertTriangle className="h-4 w-4" />{text}</div>;
}
function MiniItem({ title, subtitle, value }: { title: string; subtitle: string; value: string }) {
  return <div className="flex items-start justify-between gap-3 rounded-2xl border bg-white p-3"><div className="min-w-0"><p className="line-clamp-1 text-sm font-semibold text-slate-900">{title}</p><p className="line-clamp-1 text-xs text-muted-foreground">{subtitle}</p></div><span className="shrink-0 text-xs font-bold text-slate-700">{value}</span></div>;
}
function Money({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="text-xl font-black text-slate-900">{formatCurrency(Number(value))}</p></div>;
}
function Empty({ text }: { text: string }) {
  return <p className="rounded-2xl bg-slate-50 p-4 text-center text-sm text-muted-foreground">{text}</p>;
}
