"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gov360/ui";
import { formatDateTime } from "@gov360/utils";
import { api } from "@/services/api";

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  createdAt: string;
  user?: { name: string; email: string } | null;
}

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    api.audit.list({ limit: 50 }).then((res) => setLogs((res as { data: AuditLog[] }).data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Auditoria</h2>
        <p className="text-muted-foreground">Logs de operações e rastreabilidade</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Registros recentes</CardTitle></CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Nenhum log registrado ainda.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Entidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{formatDateTime(l.createdAt)}</TableCell>
                    <TableCell>{l.user?.name ?? "Sistema"}</TableCell>
                    <TableCell>{l.action}</TableCell>
                    <TableCell>{l.entity}{l.entityId ? ` #${l.entityId.slice(0, 8)}` : ""}</TableCell>
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
