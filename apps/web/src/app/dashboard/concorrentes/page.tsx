"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, Building2, Plus, Search, Trophy, UsersRound } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gov360/ui";
import { formatCurrency, formatDate } from "@gov360/utils";
import { api } from "@/services/api";

interface Competitor {
  id: string;
  name: string;
  cnpj: string | null;
  _count?: { wins: number };
}
interface RankingItem {
  id: string;
  name: string;
  cnpj: string | null;
  winCount: number;
  lastWin?: { agency: string; value: string | null; wonAt: string | null } | null;
}

export default function ConcorrentesPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [win, setWin] = useState({ agency: "", object: "", modality: "", value: "", wonAt: "", source: "" });
  const [message, setMessage] = useState("");

  const load = async () => {
    const [list, rank] = await Promise.all([
      api.competitors.list({ search: search || undefined, limit: 100 }) as Promise<{ data: Competitor[] }>,
      api.competitors.ranking() as Promise<RankingItem[]>,
    ]);
    setCompetitors(list.data);
    setRanking(rank);
    setSelectedId((current) => current || list.data[0]?.id || "");
  };

  useEffect(() => { load().catch(() => setMessage("Não foi possível carregar concorrentes.")); }, []);

  const totals = useMemo(() => ({
    competitors: competitors.length,
    wins: ranking.reduce((sum, item) => sum + item.winCount, 0),
    top: ranking[0]?.name ?? "—",
  }), [competitors, ranking]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    await api.competitors.create({ name: name.trim(), cnpj: cnpj.trim() || undefined });
    setName(""); setCnpj(""); setMessage("Concorrente cadastrado.");
    await load();
  };

  const handleAddWin = async () => {
    if (!selectedId || !win.agency.trim()) return;
    await api.competitors.addWin(selectedId, {
      agency: win.agency.trim(),
      object: win.object.trim() || undefined,
      modality: win.modality.trim() || undefined,
      value: win.value ? Number(win.value) : undefined,
      wonAt: win.wonAt || undefined,
      source: win.source.trim() || "Manual",
    });
    setWin({ agency: "", object: "", modality: "", value: "", wonAt: "", source: "" });
    setMessage("Vitória registrada no histórico competitivo.");
    await load();
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h2 className="text-2xl font-bold">Concorrentes</h2><p className="text-muted-foreground">Ranking, histórico de vitórias e inteligência competitiva real.</p></div>
      <div className="relative min-w-[260px]"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input className="pl-9" placeholder="Buscar concorrente ou CNPJ" value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && load()} /></div>
    </div>

    {message && <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-800">{message}</div>}

    <div className="grid gap-4 sm:grid-cols-3">
      <Metric icon={UsersRound} label="Concorrentes monitorados" value={String(totals.competitors)} />
      <Metric icon={Trophy} label="Vitórias registradas" value={String(totals.wins)} />
      <Metric icon={BarChart3} label="Líder do ranking" value={totals.top} />
    </div>

    <div className="grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
      <Card>
        <CardHeader><CardTitle className="text-base">Cadastrar concorrente</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Nome da empresa" value={name} onChange={(event) => setName(event.target.value)} />
          <Input placeholder="CNPJ (opcional)" value={cnpj} onChange={(event) => setCnpj(event.target.value)} />
          <Button onClick={handleCreate} className="w-full gap-2"><Plus className="h-4 w-4" />Cadastrar</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Registrar vitória / homologação</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <select className="h-10 rounded-md border bg-white px-3 text-sm" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}><option value="">Selecione o concorrente</option>{competitors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
          <Input placeholder="Órgão comprador" value={win.agency} onChange={(event) => setWin({ ...win, agency: event.target.value })} />
          <Input placeholder="Objeto / item vencido" value={win.object} onChange={(event) => setWin({ ...win, object: event.target.value })} />
          <Input placeholder="Modalidade" value={win.modality} onChange={(event) => setWin({ ...win, modality: event.target.value })} />
          <Input type="number" placeholder="Valor homologado" value={win.value} onChange={(event) => setWin({ ...win, value: event.target.value })} />
          <Input type="date" value={win.wonAt} onChange={(event) => setWin({ ...win, wonAt: event.target.value })} />
          <Input placeholder="Fonte (PNCP, Compras.gov...)" value={win.source} onChange={(event) => setWin({ ...win, source: event.target.value })} />
          <Button onClick={handleAddWin} className="gap-2 md:col-span-2"><Trophy className="h-4 w-4" />Registrar vitória</Button>
        </CardContent>
      </Card>
    </div>

    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="text-base">Ranking competitivo</CardTitle></CardHeader>
        <CardContent>
          <Table><TableHeader><TableRow><TableHead>Empresa</TableHead><TableHead>Vitórias</TableHead><TableHead>Última vitória</TableHead></TableRow></TableHeader><TableBody>
            {ranking.map((item) => <TableRow key={item.id}><TableCell><p className="font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.cnpj ?? "CNPJ não informado"}</p></TableCell><TableCell>{item.winCount}</TableCell><TableCell>{item.lastWin ? <div><p className="text-xs">{item.lastWin.agency}</p><p className="text-xs text-muted-foreground">{item.lastWin.wonAt ? formatDate(item.lastWin.wonAt) : "sem data"} · {item.lastWin.value ? formatCurrency(Number(item.lastWin.value)) : "—"}</p></div> : "—"}</TableCell></TableRow>)}
          </TableBody></Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Concorrentes cadastrados</CardTitle></CardHeader>
        <CardContent>
          <Table><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>CNPJ</TableHead><TableHead>Histórico</TableHead></TableRow></TableHeader><TableBody>
            {competitors.map((item) => <TableRow key={item.id}><TableCell className="font-medium">{item.name}</TableCell><TableCell>{item.cnpj ?? "—"}</TableCell><TableCell>{item._count?.wins ?? 0} vitórias</TableCell></TableRow>)}
          </TableBody></Table>
        </CardContent>
      </Card>
    </div>
  </div>;
}

function Metric({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return <Card><CardContent className="flex items-center gap-4 p-5"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-violet-700"><Icon className="h-5 w-5" /></span><div className="min-w-0"><p className="truncate text-xs text-muted-foreground">{label}</p><p className="truncate text-xl font-black">{value}</p></div></CardContent></Card>;
}
