"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCheck, MessageSquareText, RefreshCw, Send } from "lucide-react";
import { Button, Card, CardContent, Input } from "@gov360/ui";
import { api } from "@/services/api";
import { useAuth } from "@/lib/auth-context";

interface Auction {
  id: string;
  status: string;
  tender?: { noticeNumber: string; agency: string; object?: string };
  _count?: { messages: number };
}

interface Message {
  id: string;
  sender: string;
  content: string;
  isFromUs: boolean;
  createdAt: string;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Auction[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const loadSessions = useCallback(async () => {
    const response = await api.auctions.list({ limit: 100 }) as { data: Auction[] };
    const relevant = response.data.filter((session) => ["SCHEDULED", "ACTIVE", "PAUSED"].includes(session.status));
    setSessions(relevant);
    setSelectedId((current) => current || relevant[0]?.id || "");
  }, []);

  const loadMessages = useCallback(async (sessionId: string) => {
    if (!sessionId) { setMessages([]); return; }
    try {
      setMessages(await api.auctions.messages(sessionId) as Message[]);
      setError("");
    } catch { setError("Não foi possível atualizar as mensagens desta sessão."); }
  }, []);

  useEffect(() => {
    loadSessions().catch(() => setError("Não foi possível carregar os pregões.")).finally(() => setLoading(false));
  }, [loadSessions]);

  useEffect(() => {
    loadMessages(selectedId);
    const timer = window.setInterval(() => loadMessages(selectedId), 8000);
    return () => window.clearInterval(timer);
  }, [selectedId, loadMessages]);

  const selected = useMemo(() => sessions.find((session) => session.id === selectedId), [sessions, selectedId]);

  const sendMessage = async () => {
    const text = content.trim();
    if (!selectedId || !text || sending) return;
    setSending(true);
    try {
      await api.auctions.sendMessage(selectedId, { content: text, sender: user?.name || "Equipe GOV360" });
      setContent("");
      await loadMessages(selectedId);
    } catch { setError("A mensagem não pôde ser registrada."); }
    finally { setSending(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-2xl font-bold">Chat do Pregoeiro</h2><p className="text-muted-foreground">Comunicações e histórico das sessões em andamento</p></div>
        <Button variant="outline" size="sm" onClick={() => selectedId && loadMessages(selectedId)} className="gap-2"><RefreshCw className="h-4 w-4" />Atualizar</Button>
      </div>

      {error && <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"><AlertCircle className="h-4 w-4" />{error}</div>}

      <div className="grid min-h-[620px] overflow-hidden rounded-xl border bg-white shadow-sm lg:grid-cols-[320px_1fr]">
        <aside className="border-b bg-slate-50/80 lg:border-b-0 lg:border-r">
          <div className="border-b p-4"><p className="text-sm font-semibold">Sessões disponíveis</p><p className="text-xs text-muted-foreground">{sessions.length} em acompanhamento</p></div>
          <div className="max-h-56 overflow-y-auto p-2 lg:max-h-[550px]">
            {loading ? <p className="p-4 text-sm text-muted-foreground">Carregando...</p> : !sessions.length ? <p className="p-4 text-sm text-muted-foreground">Nenhuma sessão ativa ou agendada.</p> : sessions.map((session) => (
              <button key={session.id} type="button" onClick={() => setSelectedId(session.id)} className={`mb-1 w-full rounded-lg border p-3 text-left transition-colors ${selectedId === session.id ? "border-cyan-300 bg-cyan-50" : "border-transparent hover:bg-white"}`}>
                <div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold">Edital {session.tender?.noticeNumber ?? "—"}</span><span className={`h-2 w-2 rounded-full ${session.status === "ACTIVE" ? "animate-pulse bg-emerald-500" : "bg-amber-400"}`} /></div>
                <p className="mt-1 truncate text-xs text-slate-500">{session.tender?.agency}</p>
                <p className="mt-2 text-[11px] uppercase tracking-wide text-slate-400">{session.status} · {session._count?.messages ?? 0} mensagens</p>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex min-h-0 flex-col">
          <div className="flex h-[70px] shrink-0 items-center gap-3 border-b px-5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-cyan-100 text-cyan-700"><MessageSquareText className="h-5 w-5" /></span>
            <div className="min-w-0"><p className="truncate text-sm font-semibold">{selected ? `Edital ${selected.tender?.noticeNumber}` : "Selecione uma sessão"}</p><p className="truncate text-xs text-muted-foreground">{selected?.tender?.agency ?? "As mensagens ficarão registradas no histórico"}</p></div>
          </div>

          <div className="content-scroll flex-1 space-y-3 overflow-y-auto bg-slate-50/50 p-4 md:p-6">
            {!selected ? <p className="py-20 text-center text-sm text-muted-foreground">Selecione um pregão para abrir a conversa.</p> : !messages.length ? <p className="py-20 text-center text-sm text-muted-foreground">Nenhuma mensagem registrada nesta sessão.</p> : messages.map((message) => (
              <div key={message.id} className={`flex ${message.isFromUs ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm md:max-w-[70%] ${message.isFromUs ? "rounded-br-md bg-slate-900 text-white" : "rounded-bl-md border bg-white text-slate-700"}`}>
                  <p className={`mb-1 text-[11px] font-semibold ${message.isFromUs ? "text-cyan-300" : "text-cyan-700"}`}>{message.sender}</p>
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${message.isFromUs ? "text-slate-400" : "text-slate-400"}`}><span>{new Date(message.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>{message.isFromUs && <CheckCheck className="h-3 w-3 text-cyan-400" />}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="shrink-0 border-t bg-white p-3 md:p-4">
            <div className="flex gap-2"><Input placeholder={selected ? "Registrar resposta ou comunicação..." : "Selecione uma sessão"} value={content} disabled={!selected} onChange={(event) => setContent(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} /><Button onClick={sendMessage} disabled={!selected || !content.trim() || sending} className="gap-2"><Send className="h-4 w-4" /><span className="hidden sm:inline">Enviar</span></Button></div>
            <p className="mt-2 text-[11px] text-slate-400">O envio registra a comunicação no GOV360. A integração direta com o portal depende do conector correspondente.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
