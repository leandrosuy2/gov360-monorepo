"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CircleDashed, ExternalLink, KeyRound, PlugZap, RefreshCw, ServerOff, ShieldAlert } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@gov360/ui";
import { api } from "@/services/api";

interface Connector {
  code: string; name: string; area: string; baseUrl: string; auth: string; mode: string;
  configured: boolean; credentialEnv: string[]; capabilities: string[];
}
interface ConnectorStatus { code: string; status: string; httpStatus?: number; latencyMs: number | null; checkedAt: string; message?: string }

export default function IntegracoesPage() {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [statuses, setStatuses] = useState<Record<string, ConnectorStatus>>({});
  const [testing, setTesting] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.integrations.catalog().then((data) => setConnectors(data as Connector[])).finally(() => setLoading(false));
  }, []);

  const test = async (code: string) => {
    setTesting(code);
    try { const result = await api.integrations.test(code) as ConnectorStatus; setStatuses((current) => ({ ...current, [code]: result })); }
    finally { setTesting(undefined); }
  };

  const testAll = async () => {
    setTesting("ALL");
    try {
      const results = await api.integrations.status() as ConnectorStatus[];
      setStatuses(Object.fromEntries(results.map((result) => [result.code, result])));
    } finally { setTesting(undefined); }
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-bold">Integrações Oficiais</h2><p className="text-muted-foreground">Configuração e disponibilidade das APIs e fontes governamentais</p></div><Button onClick={testAll} disabled={Boolean(testing)} className="gap-2"><RefreshCw className={`h-4 w-4 ${testing === "ALL" ? "animate-spin" : ""}`} />Testar todas</Button></div>

    <div className="grid gap-4 sm:grid-cols-3"><Summary label="Fontes cadastradas" value={connectors.length} icon={PlugZap} color="bg-blue-50 text-blue-700" /><Summary label="Configuradas" value={connectors.filter((item) => item.configured).length} icon={CheckCircle2} color="bg-emerald-50 text-emerald-700" /><Summary label="Aguardando credencial" value={connectors.filter((item) => !item.configured).length} icon={KeyRound} color="bg-amber-50 text-amber-700" /></div>

    {loading ? <Card><CardContent className="py-16 text-center text-sm text-muted-foreground">Carregando catálogo...</CardContent></Card> : <div className="grid gap-4 lg:grid-cols-2">{connectors.map((connector) => {
      const status = statuses[connector.code];
      return <Card key={connector.code} className="overflow-hidden"><CardHeader className="border-b bg-slate-50/60 pb-4"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><CardTitle className="text-base">{connector.name}</CardTitle><span className="rounded-full border bg-white px-2 py-0.5 text-[9px] font-bold text-slate-500">{connector.mode}</span></div><p className="mt-1 text-xs text-muted-foreground">{connector.area}</p></div><StatusBadge configured={connector.configured} status={status} /></div></CardHeader>
      <CardContent className="space-y-4 p-5"><div className="flex flex-wrap gap-1.5">{connector.capabilities.map((capability) => <span key={capability} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-600">{capability}</span>)}</div><div className="space-y-2 rounded-lg border bg-slate-50/50 p-3 text-xs"><div className="flex justify-between gap-3"><span className="text-muted-foreground">Autenticação</span><strong>{connector.auth}</strong></div><div className="flex justify-between gap-3"><span className="text-muted-foreground">Endpoint</span><a href={connector.baseUrl} target="_blank" rel="noreferrer" className="flex max-w-[70%] items-center gap-1 truncate font-medium text-blue-700 hover:underline">{connector.baseUrl}<ExternalLink className="h-3 w-3 shrink-0" /></a></div>{connector.credentialEnv.length > 0 && <div className="flex items-start justify-between gap-3"><span className="text-muted-foreground">Variáveis</span><div className="text-right">{connector.credentialEnv.map((name) => <code key={name} className="mb-1 block rounded bg-slate-200 px-1.5 py-0.5">{name}</code>)}</div></div>}{status && <div className="flex justify-between gap-3 border-t pt-2"><span className="text-muted-foreground">Último teste</span><span>{status.latencyMs !== null ? `${status.latencyMs} ms` : "—"}{status.httpStatus ? ` · HTTP ${status.httpStatus}` : ""}</span></div>}</div><div className="flex justify-end"><Button variant="outline" size="sm" onClick={() => test(connector.code)} disabled={Boolean(testing) || !connector.configured} className="gap-2"><RefreshCw className={`h-3.5 w-3.5 ${testing === connector.code ? "animate-spin" : ""}`} />Testar conexão</Button></div></CardContent></Card>;
    })}</div>}
  </div>;
}

function StatusBadge({ configured, status }: { configured: boolean; status?: ConnectorStatus }) {
  if (!configured) return <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-700"><ShieldAlert className="h-3 w-3" />CREDENCIAL PENDENTE</span>;
  if (!status) return <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600"><CircleDashed className="h-3 w-3" />NÃO TESTADO</span>;
  if (status.status === "ONLINE") return <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700"><CheckCircle2 className="h-3 w-3" />ONLINE</span>;
  return <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700"><ServerOff className="h-3 w-3" />{status.status}</span>;
}
function Summary({ label, value, icon: Icon, color }: { label: string; value: number; icon: typeof PlugZap; color: string }) { return <Card><CardContent className="flex items-center gap-4 p-4"><span className={`grid h-11 w-11 place-items-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></span><div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div></CardContent></Card>; }
