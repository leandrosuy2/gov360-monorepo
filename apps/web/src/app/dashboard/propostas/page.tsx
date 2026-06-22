"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gov360/ui";
import { api } from "@/services/api";

interface Proposal {
  id: string;
  title: string;
  status: string;
  totalValue: string | null;
  margin: string | null;
  tender?: { noticeNumber: string; agency: string };
}

export default function PropostasPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [title, setTitle] = useState("");

  const load = async () => {
    const res = await api.proposals.list({ limit: 50 }) as { data: Proposal[] };
    setProposals(res.data);
  };

  useEffect(() => { load().catch(console.error); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Propostas Comerciais</h2>
        <p className="text-muted-foreground">{proposals.length} propostas cadastradas</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Propostas</CardTitle></CardHeader>
        <CardContent>
          {proposals.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma proposta. Crie a partir de uma licitação em andamento.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Licitação</TableHead>
                  <TableHead>Órgão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Margem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell>{p.tender?.noticeNumber ?? "—"}</TableCell>
                    <TableCell>{p.tender?.agency ?? "—"}</TableCell>
                    <TableCell>{p.status}</TableCell>
                    <TableCell>{p.margin ? `${p.margin}%` : "—"}</TableCell>
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
