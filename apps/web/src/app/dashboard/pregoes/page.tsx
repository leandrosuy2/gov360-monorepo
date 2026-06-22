"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Bot, Clock3, MessageSquareText, Radio, RefreshCw } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gov360/ui";
import { api } from "@/services/api";

interface Auction {
  id: string;
  status: string;
  strategy: string | null;
  autoBid: boolean;
  startedAt?: string;
  tender?: { noticeNumber: string; agency: string; object?: string };
  _count?: { bids: number; messages: number };
  bids?: { amount: string; createdAt: string }[];
  messages?: { content: string; createdAt: string }[];
}

const statusLabels: Record<string, string> = { SCHEDULED: "Agendado", ACTIVE: "Em disputa", PAUSED: "Pausado", FINISHED: "Finalizado", CANCELED: "Cancelado" };
const strategyLabels: Record<string, string> = { AGGRESSIVE: "Agressiva", MODERATE: "Moderada", CONSERVATIVE: "Conservadora" };

export default function PregoesPage() {
  const [active, setActive] = useState<Auction[]>([]);
  const [all, setAll] = useState<Auction[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const [activeSessions, list] = await Promise.all([
        api.auctions.active() as Promise<Auction[]>,
        api.auctions.list({ limit: 50 }) as Promise<{ data: Auction[] }>,
      ]);
      setActive(activeSessions);
      setAll(list.data);
      setLastUpdated(new Date());
      setError("");
    } catch { setError("Falha ao atualizar a central de pregões."); }
    finally { setRefreshing(false); }
  }, []);

  useEffect(() => {
    load();
    const timer = window.setInterval(() => load(true), 10000);
    return () => window.clearInterval(timer);
  }, [load]);

  const alerts = useMemo(() => active.flatMap((session) => {
    const items: string[] = [];
    if (session.status === "ACTIVE" && !session.strategy) items.push(`Edital ${session.tender?.noticeNumber}: estratégia não definida`);
    if (session.status === "ACTIVE" && !session.autoBid) items.push(`Edital ${session.tender?.noticeNumber}: automação de lances desativada`);
    return items;
  }), [active]);

  const updateStatus = async (id: string, status: string) => {
    await api.auctions.update(id, { status });
    await load(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><div className="flex items-center gap-2"><h2 className="text-2xl font-bold">Central de Pregões</h2>{active.some((item) => item.status === "ACTIVE") && <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700"><Radio className="h-3 w-3 animate-pulse" />AO VIVO</span>}</div><p className="text-muted-foreground">{active.length} sessões monitoradas · atualização automática a cada 10 segundos</p></div>
        <div className="flex items-center gap-3"><span className="hidden text-xs text-slate-400 sm:inline">{lastUpdated ? `Atualizado às ${lastUpdated.toLocaleTimeString("pt-BR")}` : "Sincronizando..."}</span><Button variant="outline" size="sm" onClick={() => load()} disabled={refreshing} className="gap-2"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />Atualizar</Button></div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {!!alerts.length && <Card className="border-amber-200 bg-amber-50/50"><CardContent className="p-4"><div className="flex gap-3"><AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" /><div><p className="text-sm font-semibold text-amber-900">{alerts.length} alertas operacionais</p>{alerts.map((alert) => <p key={alert} className="mt-1 text-xs text-amber-800">• {alert}</p>)}</div></div></CardContent></Card>}

      <div className="grid gap-4 sm:grid-cols-3">
        <Summary label="Em disputa" value={active.filter((item) => item.status === "ACTIVE").length} icon={Radio} color="text-red-600 bg-red-50" />
        <Summary label="Lances registrados" value={active.reduce((sum, item) => sum + (item._count?.bids ?? 0), 0)} icon={Bot} color="text-blue-600 bg-blue-50" />
        <Summary label="Mensagens" value={active.reduce((sum, item) => sum + (item._count?.messages ?? 0), 0)} icon={MessageSquareText} color="text-cyan-600 bg-cyan-50" />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Sessões em acompanhamento</CardTitle></CardHeader>
        <CardContent>
          {!active.length ? <p className="py-8 text-center text-sm text-muted-foreground">Nenhum pregão ativo ou agendado.</p> : <div className="grid gap-4 lg:grid-cols-2">{active.map((session) => (
            <div key={session.id} className={`rounded-xl border p-4 ${session.status === "ACTIVE" ? "border-red-200 bg-gradient-to-br from-red-50/60 to-white" : "bg-white"}`}>
              <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-semibold">Edital {session.tender?.noticeNumber ?? "—"}</p><p className="truncate text-sm text-muted-foreground">{session.tender?.agency}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${session.status === "ACTIVE" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{statusLabels[session.status] ?? session.status}</span></div>
              <p className="mt-3 line-clamp-2 text-xs text-slate-500">{session.tender?.object}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 border-y py-3 text-center"><div><p className="text-lg font-bold">{session._count?.bids ?? 0}</p><p className="text-[10px] text-muted-foreground">Lances</p></div><div><p className="text-lg font-bold">{session._count?.messages ?? 0}</p><p className="text-[10px] text-muted-foreground">Mensagens</p></div><div><p className="text-sm font-bold">{strategyLabels[session.strategy ?? ""] ?? "—"}</p><p className="text-[10px] text-muted-foreground">Estratégia</p></div></div>
              <div className="mt-4 flex flex-wrap items-center gap-2"><select className="h-9 rounded-md border bg-white px-2 text-xs" value={session.status} onChange={(event) => updateStatus(session.id, event.target.value)}><option value="SCHEDULED">Agendado</option><option value="ACTIVE">Em disputa</option><option value="PAUSED">Pausado</option><option value="FINISHED">Finalizado</option><option value="CANCELED">Cancelado</option></select><Link href="/dashboard/chat" className="inline-flex h-9 items-center gap-2 rounded-md border bg-white px-3 text-xs font-medium hover:bg-slate-50"><MessageSquareText className="h-3.5 w-3.5" />Abrir chat</Link><Link href="/dashboard/robo" className="inline-flex h-9 items-center gap-2 rounded-md border bg-white px-3 text-xs font-medium hover:bg-slate-50"><Bot className="h-3.5 w-3.5" />Lances</Link></div>
            </div>
          ))}</div>}
        </CardContent>
      </Card>

      <Card><CardHeader><CardTitle className="text-base">Histórico de participação</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Edital</TableHead><TableHead>Órgão</TableHead><TableHead>Status</TableHead><TableHead>Estratégia</TableHead></TableRow></TableHeader><TableBody>{all.map((session) => <TableRow key={session.id}><TableCell className="font-medium">{session.tender?.noticeNumber ?? session.id.slice(0, 8)}</TableCell><TableCell>{session.tender?.agency ?? "—"}</TableCell><TableCell>{statusLabels[session.status] ?? session.status}</TableCell><TableCell>{strategyLabels[session.strategy ?? ""] ?? "—"}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
    </div>
  );
}

function Summary({ label, value, icon: Icon, color }: { label: string; value: number; icon: typeof Clock3; color: string }) {
  return <Card><CardContent className="flex items-center gap-4 p-4"><span className={`grid h-11 w-11 place-items-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></span><div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div></CardContent></Card>;
}
