"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gov360/ui";
import { api } from "@/services/api";

interface Auction {
  id: string;
  status: string;
  strategy: string | null;
  autoBid: boolean;
  minBid: string | null;
  minMargin: string | null;
  tender?: { noticeNumber: string };
}

export default function RoboPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [bidAmount, setBidAmount] = useState("");
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    api.auctions.list({ status: "ACTIVE", limit: 20 }).then((res) => {
      const data = (res as { data: Auction[] }).data;
      setAuctions(data);
      if (data[0]) setSelectedId(data[0].id);
    }).catch(console.error);
  }, []);

  const placeBid = async () => {
    if (!selectedId || !bidAmount) return;
    await api.auctions.placeBid(selectedId, Number(bidAmount));
    setBidAmount("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Robô de Lances</h2>
        <p className="text-muted-foreground">Automação de disputas eletrônicas</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Sessões configuradas</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Edital</TableHead>
                <TableHead>Estratégia</TableHead>
                <TableHead>Robô</TableHead>
                <TableHead>Lance mín.</TableHead>
                <TableHead>Margem mín.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auctions.map((a) => (
                <TableRow key={a.id} onClick={() => setSelectedId(a.id)} className="cursor-pointer">
                  <TableCell>{a.tender?.noticeNumber ?? a.id.slice(0, 8)}</TableCell>
                  <TableCell>{a.strategy ?? "MODERATE"}</TableCell>
                  <TableCell>{a.autoBid ? "Ativo" : "Inativo"}</TableCell>
                  <TableCell>{a.minBid ?? "—"}</TableCell>
                  <TableCell>{a.minMargin ? `${a.minMargin}%` : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Input placeholder="Valor do lance" type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} className="w-40" />
        <Button onClick={placeBid} disabled={!selectedId}>Registrar lance manual</Button>
      </div>
    </div>
  );
}
