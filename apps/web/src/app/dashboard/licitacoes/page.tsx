"use client";

import { useCallback, useEffect, useState } from "react";
import type { PaginatedResponse, Tender } from "@gov360/types";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gov360/ui";
import { formatCurrency, formatDate } from "@gov360/utils";
import { StatusBadge } from "@/components/status-badge";
import { TENDER_STATUS_LABELS } from "@/config/navigation";
import { api } from "@/services/api";

export default function LicitacoesPage() {
  const [data, setData] = useState<PaginatedResponse<Tender> | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const res = await api.tenders.list({ search: search || undefined, limit: 50 });
    setData(res as PaginatedResponse<Tender>);
  }, [search]);

  useEffect(() => { load().catch(console.error); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await api.tenders.updateStatus(id, status);
    await load();
  };

  const statusCounts = Object.keys(TENDER_STATUS_LABELS).reduce((acc, key) => {
    acc[key] = data?.data.filter((t) => t.status === key).length ?? 0;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gestão de Licitações</h2>
        <p className="text-muted-foreground">{data?.total ?? 0} processos cadastrados</p>
      </div>

      <div className="flex gap-3">
        <Input placeholder="Buscar edital, órgão..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <Button variant="outline" onClick={load}>Buscar</Button>
      </div>

      <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {Object.entries(TENDER_STATUS_LABELS).slice(0, 7).map(([key, label]) => (
          <Card key={key}>
            <CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-normal text-muted-foreground">{label}</CardTitle></CardHeader>
            <CardContent className="p-3 pt-0"><p className="text-lg font-bold">{statusCounts[key]}</p></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Licitações</CardTitle></CardHeader>
        <CardContent>
          {!data?.data.length ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma licitação. Converta uma oportunidade.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Edital</TableHead>
                  <TableHead>Órgão</TableHead>
                  <TableHead>Modalidade</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Abertura</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.noticeNumber}</TableCell>
                    <TableCell>{t.agency}</TableCell>
                    <TableCell>{t.modality}</TableCell>
                    <TableCell>{t.estimatedValue ? formatCurrency(Number(t.estimatedValue)) : "—"}</TableCell>
                    <TableCell>{t.openingAt ? formatDate(t.openingAt) : "—"}</TableCell>
                    <TableCell><StatusBadge status={t.status} type="tender" /></TableCell>
                    <TableCell>
                      <select
                        className="rounded border px-2 py-1 text-xs"
                        value={t.status}
                        onChange={(e) => updateStatus(t.id, e.target.value)}
                      >
                        {Object.entries(TENDER_STATUS_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
