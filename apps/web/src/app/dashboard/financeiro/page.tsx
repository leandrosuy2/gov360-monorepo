"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gov360/ui";
import { formatCurrency } from "@gov360/utils";
import { api } from "@/services/api";

export default function FinanceiroPage() {
  const [summary, setSummary] = useState<{ received: string; pending: string; overdue: string; revenueByAgency: { agency: string; value: string }[] } | null>(null);
  const [records, setRecords] = useState<{ id: string; type: string; amount: string; status: string; contract?: { contractNumber: string } }[]>([]);

  useEffect(() => {
    Promise.all([
      api.financial.summary(),
      api.financial.list({ limit: 30 }),
    ]).then(([s, list]) => {
      setSummary(s as typeof summary);
      setRecords((list as { data: typeof records }).data);
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Financeiro</h2>
        <p className="text-muted-foreground">Empenhos, faturamento e recebimentos</p>
      </div>

      {summary && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Recebido</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{formatCurrency(Number(summary.received))}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">A receber</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{formatCurrency(Number(summary.pending))}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Em atraso</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">{formatCurrency(Number(summary.overdue))}</p></CardContent></Card>
        </div>
      )}

      {summary && summary.revenueByAgency.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Receita por órgão</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Órgão</TableHead><TableHead>Receita</TableHead></TableRow></TableHeader>
              <TableBody>
                {summary.revenueByAgency.map((r) => (
                  <TableRow key={r.agency}><TableCell>{r.agency}</TableCell><TableCell>{formatCurrency(Number(r.value))}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Lançamentos</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Contrato</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{r.contract?.contractNumber ?? "—"}</TableCell>
                  <TableCell>{formatCurrency(Number(r.amount))}</TableCell>
                  <TableCell>{r.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
