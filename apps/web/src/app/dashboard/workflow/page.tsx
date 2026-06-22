"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gov360/ui";
import { PriorityBadge } from "@/components/status-badge";
import { api } from "@/services/api";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueAt: string | null;
  assignee?: { name: string } | null;
}

export default function WorkflowPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  const load = async () => {
    const res = await api.tasks.list({ limit: 50 }) as { data: Task[] };
    setTasks(res.data);
  };

  useEffect(() => { load().catch(console.error); }, []);

  const handleCreate = async () => {
    if (!title) return;
    await api.tasks.create({ title, priority: "MEDIUM" });
    setTitle("");
    await load();
  };

  const updateStatus = async (id: string, status: string) => {
    await api.tasks.update(id, { status });
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Workflow</h2>
        <p className="text-muted-foreground">Tarefas, aprovações e pendências</p>
      </div>

      <div className="flex gap-3">
        <Input placeholder="Nova tarefa..." value={title} onChange={(e) => setTitle(e.target.value)} className="max-w-sm" />
        <Button onClick={handleCreate}>Criar tarefa</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Tarefas</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.title}</TableCell>
                  <TableCell><PriorityBadge priority={t.priority} /></TableCell>
                  <TableCell>{t.assignee?.name ?? "—"}</TableCell>
                  <TableCell>
                    <select className="rounded border px-2 py-1 text-xs" value={t.status} onChange={(e) => updateStatus(t.id, e.target.value)}>
                      <option value="TODO">A fazer</option>
                      <option value="IN_PROGRESS">Em andamento</option>
                      <option value="BLOCKED">Bloqueada</option>
                      <option value="DONE">Concluída</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
