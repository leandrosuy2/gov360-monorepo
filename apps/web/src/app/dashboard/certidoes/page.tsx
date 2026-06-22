"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gov360/ui";
import { formatDate } from "@gov360/utils";
import { StatusBadge } from "@/components/status-badge";
import { api } from "@/services/api";

interface CertStats { valid: number; expiring: number; expired: number; total: number }
interface Doc { id: string; name: string; expiresAt: string | null; status: string }

export default function CertidoesPage() {
  const [stats, setStats] = useState<CertStats | null>(null);
  const [certs, setCerts] = useState<Doc[]>([]);
  const [name, setName] = useState("");

  const load = async () => {
    const [s, list] = await Promise.all([
      api.documents.certificateStats() as Promise<CertStats>,
      api.documents.list({ certificatesOnly: true, limit: 50 }) as Promise<{ data: Doc[] }>,
    ]);
    setStats(s);
    setCerts(list.data);
  };

  useEffect(() => { load().catch(console.error); }, []);

  const handleCreate = async () => {
    if (!name) return;
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 6);
    await api.documents.create({
      name,
      category: "CERTIDAO",
      fileName: `${name}.pdf`,
      storageKey: `certidoes/${Date.now()}.pdf`,
      expiresAt: expires.toISOString(),
    });
    setName("");
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Certidões</h2>
        <p className="text-muted-foreground">Controle de regularidade fiscal e jurídica</p>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Válidas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{stats.valid}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Vencendo</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-amber-600">{stats.expiring}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Vencidas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">{stats.expired}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
        </div>
      )}

      <div className="flex gap-3">
        <Input placeholder="Nome da certidão" value={name} onChange={(e) => setName(e.target.value)} className="max-w-sm" />
        <Button onClick={handleCreate}>Cadastrar certidão</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Certidões cadastradas</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certs.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.expiresAt ? formatDate(c.expiresAt) : "—"}</TableCell>
                  <TableCell><StatusBadge status={c.status} type="document" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
