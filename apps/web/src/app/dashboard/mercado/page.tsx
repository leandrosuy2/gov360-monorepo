"use client";

import { useEffect, useState } from "react";
import { BarChart3, Building2, Flame, Globe2, Landmark, Radar, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gov360/ui";
import { formatCurrency, formatDate } from "@gov360/utils";
import { api } from "@/services/api";

interface MarketStats {
  topAgencies: { agency: string; count: number; totalValue: string }[];
  totalWins: number;
  totalHomologatedValue: string;
  opportunityMarket?: {
    totalOpportunities: number;
    totalEstimatedValue: string;
    topAgencies: { agency: string; count: number; totalValue: string }[];
    byState: { state: string | null; count: number; totalValue: string }[];
    byModality: { modality: string | null; count: number; totalValue: string }[];
    recentOpportunities: { id: string; object: string; agency: string; state: string | null; modality: string | null; source: string; estimatedValue: string | null; publishedAt: string | null; openingAt: string | null; score: number | null }[];
  };
}

export default function MercadoPage() {
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.competitors.marketStats().then((data) => setStats(data as MarketStats)).catch(() => setError("Não foi possível carregar inteligência de mercado."));
  }, []);

  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  if (!stats) return <p className="text-muted-foreground">Carregando inteligência de mercado...</p>;

  const market = stats.opportunityMarket;

  return <div className="space-y-6">
    <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-cyan-950 to-emerald-800 p-6 text-white shadow-xl">
      <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20"><Radar className="h-6 w-6" /></span><div><h2 className="text-2xl font-black">Inteligência de Mercado</h2><p className="text-sm text-cyan-100">Leitura estratégica do mercado público com base nas oportunidades importadas e resultados de concorrentes.</p></div></div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric icon={Globe2} label="Oportunidades mapeadas" value={String(market?.totalOpportunities ?? 0)} helper="base oficial importada" />
      <Metric icon={BarChart3} label="Valor estimado" value={formatCurrency(Number(market?.totalEstimatedValue ?? 0))} helper="potencial de mercado" />
      <Metric icon={Trophy} label="Vitórias registradas" value={String(stats.totalWins)} helper="base de concorrentes" />
      <Metric icon={Flame} label="Valor homologado" value={formatCurrency(Number(stats.totalHomologatedValue))} helper="histórico competitivo" />
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
      <Card>
        <CardHeader><CardTitle className="text-base">Órgãos que mais publicam oportunidades</CardTitle><CardDescription>Ranking calculado a partir das oportunidades no banco GOV360</CardDescription></CardHeader>
        <CardContent>
          {!market?.topAgencies.length ? <Empty text="Sem oportunidades importadas. Sincronize PNCP/Compras.gov para alimentar o mercado." /> : <Table>
            <TableHeader><TableRow><TableHead>Órgão</TableHead><TableHead>Oportunidades</TableHead><TableHead>Valor estimado</TableHead></TableRow></TableHeader>
            <TableBody>{market.topAgencies.map((item) => <TableRow key={item.agency}><TableCell className="font-medium">{item.agency}</TableCell><TableCell>{item.count}</TableCell><TableCell>{formatCurrency(Number(item.totalValue))}</TableCell></TableRow>)}</TableBody>
          </Table>}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card><CardHeader><CardTitle className="text-base">Regiões mais aquecidas</CardTitle></CardHeader><CardContent className="space-y-2">{market?.byState.slice(0, 8).map((item) => <RankLine key={item.state ?? "BR"} label={item.state ?? "Nacional"} count={item.count} value={item.totalValue} />)}{!market?.byState.length && <Empty text="Sem UF informada." />}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Modalidades em destaque</CardTitle></CardHeader><CardContent className="space-y-2">{market?.byModality.slice(0, 8).map((item) => <RankLine key={item.modality ?? "NA"} label={item.modality ?? "Não informada"} count={item.count} value={item.totalValue} />)}{!market?.byModality.length && <Empty text="Sem modalidade informada." />}</CardContent></Card>
      </div>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="text-base">Oportunidades recentes do mercado</CardTitle></CardHeader>
        <CardContent className="space-y-3">{market?.recentOpportunities.map((item) => <div key={item.id} className="rounded-2xl border p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="line-clamp-2 text-sm font-semibold">{item.object}</p><p className="mt-1 text-xs text-muted-foreground">{item.agency} · {item.state ?? "BR"} · {item.modality ?? "modalidade não informada"}</p></div><span className="rounded-full bg-slate-950 px-2 py-1 text-[10px] font-bold text-white">{item.source}</span></div><div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground"><span>Valor: <strong className="text-slate-800">{item.estimatedValue ? formatCurrency(Number(item.estimatedValue)) : "—"}</strong></span><span>Abertura: <strong className="text-slate-800">{item.openingAt ? formatDate(item.openingAt) : "—"}</strong></span><span>Score: <strong className="text-slate-800">{item.score ?? 0}%</strong></span></div></div>)}{!market?.recentOpportunities.length && <Empty text="Nenhuma oportunidade recente." />}</CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Órgãos com contratações vencidas por concorrentes</CardTitle><CardDescription>Use para comparar histórico competitivo com oportunidades atuais</CardDescription></CardHeader>
        <CardContent>
          {!stats.topAgencies.length ? <Empty text="Sem vitórias de concorrentes registradas." /> : <Table>
            <TableHeader><TableRow><TableHead>Órgão</TableHead><TableHead>Vitórias</TableHead><TableHead>Homologado</TableHead></TableRow></TableHeader>
            <TableBody>{stats.topAgencies.map((item) => <TableRow key={item.agency}><TableCell>{item.agency}</TableCell><TableCell>{item.count}</TableCell><TableCell>{formatCurrency(Number(item.totalValue))}</TableCell></TableRow>)}</TableBody>
          </Table>}
        </CardContent>
      </Card>
    </div>
  </div>;
}

function Metric({ icon: Icon, label, value, helper }: { icon: typeof Landmark; label: string; value: string; helper: string }) {
  return <Card><CardContent className="flex items-center gap-4 p-5"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-50 text-cyan-700"><Icon className="h-5 w-5" /></span><div className="min-w-0"><p className="truncate text-xs text-muted-foreground">{label}</p><p className="truncate text-xl font-black">{value}</p><p className="truncate text-[11px] text-muted-foreground">{helper}</p></div></CardContent></Card>;
}
function RankLine({ label, count, value }: { label: string; count: number; value: string }) {
  return <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"><div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-cyan-700" /><span className="text-sm font-semibold">{label}</span></div><span className="text-xs text-muted-foreground">{count} · {formatCurrency(Number(value))}</span></div>;
}
function Empty({ text }: { text: string }) {
  return <p className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-muted-foreground">{text}</p>;
}
