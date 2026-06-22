"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gov360/ui";
import { formatDate } from "@gov360/utils";
import { StatusBadge } from "@/components/status-badge";
import { api } from "@/services/api";

interface Doc {
  id: string;
  name: string;
  category: string;
  fileName: string;
  status: string;
  expiresAt: string | null;
}

export default function DocumentosPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [name, setName] = useState("");

  const load = async () => {
    const res = await api.documents.list({ limit: 50 }) as { data: Doc[] };
    setDocs(res.data);
  };

  useEffect(() => { load().catch(console.error); }, []);

  const handleCreate = async () => {
    if (!name) return;
    await api.documents.create({
      name,
      category: "OUTRO",
      fileName: `${name}.pdf`,
      storageKey: `uploads/${Date.now()}-${name}.pdf`,
    });
    setName("");
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gestão Documental</h2>
        <p className="text-muted-foreground">{docs.length} documentos cadastrados</p>
      </div>

      <div className="flex gap-3">
        <Input placeholder="Nome do documento" value={name} onChange={(e) => setName(e.target.value)} className="max-w-sm" />
        <Button onClick={handleCreate}>Cadastrar</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Documentos</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Arquivo</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>{d.category}</TableCell>
                  <TableCell>{d.fileName}</TableCell>
                  <TableCell>{d.expiresAt ? formatDate(d.expiresAt) : "—"}</TableCell>
                  <TableCell><StatusBadge status={d.status} type="document" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
