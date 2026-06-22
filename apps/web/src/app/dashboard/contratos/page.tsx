"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gov360/ui";
import { formatCurrency } from "@gov360/utils";
import { api } from "@/services/api";

interface Contract {
  id: string;
  contractNumber: string;
  agency: string;
  object: string;
  totalValue: string | null;
  status: string;
}

export default function ContratosPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [form, setForm] = useState({ contractNumber: "", agency: "", object: "" });

  const load = async () => {
    const res = await api.contracts.list({ limit: 50 }) as { data: Contract[] };
    setContracts(res.data);
  };

  useEffect(() => { load().catch(console.error); }, []);

  const handleCreate = async () => {
    if (!form.contractNumber || !form.agency) return;
    await api.contracts.create({ ...form, totalValue: 0 });
    setForm({ contractNumber: "", agency: "", object: "" });
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Contratos</h2>
        <p className="text-muted-foreground">Gestão pós-homologação</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input placeholder="Nº contrato" value={form.contractNumber} onChange={(e) => setForm({ ...form, contractNumber: e.target.value })} className="w-40" />
        <Input placeholder="Órgão" value={form.agency} onChange={(e) => setForm({ ...form, agency: e.target.value })} className="w-48" />
        <Input placeholder="Objeto" value={form.object} onChange={(e) => setForm({ ...form, object: e.target.value })} className="max-w-xs" />
        <Button onClick={handleCreate}>Cadastrar</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Contratos ativos</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Órgão</TableHead>
                <TableHead>Objeto</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.contractNumber}</TableCell>
                  <TableCell>{c.agency}</TableCell>
                  <TableCell className="max-w-xs truncate">{c.object}</TableCell>
                  <TableCell>{c.totalValue ? formatCurrency(Number(c.totalValue)) : "—"}</TableCell>
                  <TableCell>{c.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
