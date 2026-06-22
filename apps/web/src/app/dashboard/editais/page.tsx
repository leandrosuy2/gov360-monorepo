"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CalendarClock, CheckCircle2, FileSearch, Loader2, ShieldAlert, UploadCloud } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@gov360/ui";
import { api } from "@/services/api";

interface Tender { id: string; noticeNumber: string; agency: string; object: string; status: string }
interface Analysis {
  summary?: string;
  requirements?: string[];
  checklist?: { id: number; title: string; completed: boolean }[];
  deadlines?: { id: number; description: string }[];
  riskMap?: { severity: string; title: string; status: string }[];
  analyzedAt?: string;
  extractedCharacters?: number;
  fileName?: string;
}

export default function EditaisPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [tenderId, setTenderId] = useState("");
  const [file, setFile] = useState<File>();
  const [analysis, setAnalysis] = useState<Analysis>();
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.tenders.list({ limit: 100 }).then((response) => {
      const data = (response as { data: Tender[] }).data;
      setTenders(data);
      setTenderId(data[0]?.id ?? "");
    }).catch(() => setError("Não foi possível carregar as licitações."));
  }, []);

  useEffect(() => {
    if (!tenderId) return;
    api.tenderAnalysis.getByTender(tenderId).then(setAnalysis).catch(() => setAnalysis(undefined));
  }, [tenderId]);

  const upload = async () => {
    if (!tenderId || !file) return;
    setAnalyzing(true); setError("");
    try { setAnalysis(await api.tenderAnalysis.upload(tenderId, file) as Analysis); setFile(undefined); }
    catch (requestError: unknown) {
      const message = (requestError as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || "Não foi possível analisar o PDF.");
    } finally { setAnalyzing(false); }
  };

  return <div className="space-y-6">
    <div><h2 className="text-2xl font-bold">Análise de Editais</h2><p className="text-muted-foreground">Envie o PDF para extrair resumo, exigências, prazos, checklist e riscos</p></div>
    {error && <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertTriangle className="h-4 w-4 shrink-0" />{error}</div>}

    <Card><CardHeader><CardTitle className="text-base">Novo edital para análise</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
      <select className="h-11 rounded-md border bg-white px-3 text-sm" value={tenderId} onChange={(event) => setTenderId(event.target.value)}><option value="">Selecione a licitação</option>{tenders.map((tender) => <option key={tender.id} value={tender.id}>{tender.noticeNumber} · {tender.agency}</option>)}</select>
      <label className="flex h-11 cursor-pointer items-center gap-3 rounded-md border border-dashed px-3 text-sm hover:border-cyan-400 hover:bg-cyan-50/40"><UploadCloud className="h-5 w-5 text-cyan-600" /><span className="min-w-0 truncate">{file?.name ?? "Selecionar arquivo PDF (máx. 25 MB)"}</span><input type="file" accept="application/pdf,.pdf" className="hidden" onChange={(event) => setFile(event.target.files?.[0])} /></label>
      <Button onClick={upload} disabled={!tenderId || !file || analyzing} className="h-11 gap-2">{analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSearch className="h-4 w-4" />}{analyzing ? "Analisando..." : "Analisar PDF"}</Button>
    </CardContent></Card>

    {!analysis ? <Card><CardContent className="py-16 text-center"><FileSearch className="mx-auto mb-3 h-10 w-10 text-slate-300" /><p className="text-sm text-muted-foreground">Selecione uma licitação e envie o edital em PDF.</p></CardContent></Card> : <>
      <div className="grid gap-4 sm:grid-cols-3"><Stat icon={CheckCircle2} value={analysis.checklist?.length ?? 0} label="Exigências identificadas" color="text-emerald-600 bg-emerald-50" /><Stat icon={CalendarClock} value={analysis.deadlines?.length ?? 0} label="Prazos localizados" color="text-blue-600 bg-blue-50" /><Stat icon={ShieldAlert} value={analysis.riskMap?.length ?? 0} label="Riscos mapeados" color="text-amber-600 bg-amber-50" /></div>
      <Card><CardHeader><CardTitle className="text-base">Resumo executivo</CardTitle></CardHeader><CardContent><p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{analysis.summary}</p>{analysis.fileName && <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">Arquivo: {analysis.fileName} · {analysis.extractedCharacters?.toLocaleString("pt-BR")} caracteres extraídos</p>}</CardContent></Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-base">Checklist automático</CardTitle></CardHeader><CardContent className="space-y-2">{analysis.checklist?.map((item) => <div key={item.id} className="flex gap-3 rounded-lg border p-3 text-sm"><span className="mt-0.5 h-4 w-4 shrink-0 rounded border-2 border-slate-300" /><span>{item.title}</span></div>) || <p className="text-sm text-muted-foreground">Nenhuma exigência explícita encontrada.</p>}</CardContent></Card>
        <div className="space-y-6"><Card><CardHeader><CardTitle className="text-base">Mapa de riscos</CardTitle></CardHeader><CardContent className="space-y-2">{analysis.riskMap?.map((risk) => <div key={risk.title} className="flex items-center justify-between rounded-lg border p-3 text-sm"><span>{risk.title}</span><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${risk.severity === "ALTO" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{risk.severity}</span></div>) || <p className="text-sm text-muted-foreground">Nenhum risco padronizado detectado.</p>}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Prazos encontrados</CardTitle></CardHeader><CardContent className="space-y-2">{analysis.deadlines?.map((deadline) => <p key={deadline.id} className="rounded-lg bg-slate-50 p-3 text-sm">{deadline.description}</p>) || <p className="text-sm text-muted-foreground">Nenhum prazo reconhecido.</p>}</CardContent></Card></div>
      </div>
    </>}
  </div>;
}

function Stat({ icon: Icon, value, label, color }: { icon: typeof FileSearch; value: number; label: string; color: string }) { return <Card><CardContent className="flex items-center gap-4 p-4"><span className={`grid h-11 w-11 place-items-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></span><div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div></CardContent></Card>; }
