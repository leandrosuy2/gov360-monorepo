"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gov360/ui";
import { formatCurrency, formatDate } from "@gov360/utils";
import { api } from "@/services/api";

type Contract = { id: string; contractNumber: string; agency: string; object: string; priceRecord?: unknown };
type PriceRecordItem = { id: string; itemNumber?: string; description: string; unit?: string; registeredQty?: string; balanceQty?: string; unitPrice?: string };
type Carona = { id: string; agency: string; object?: string; value?: string; requestedAt?: string };
type PriceRecord = {
  id: string;
  ataNumber: string;
  startsAt?: string;
  endsAt?: string;
  contract: Contract;
  items: PriceRecordItem[];
  caronas: Carona[];
};

const emptyAta = { contractId: "", ataNumber: "", startsAt: "", endsAt: "" };
const emptyItem = { itemNumber: "", description: "", unit: "", registeredQty: "", unitPrice: "" };
const emptyCarona = { agency: "", object: "", value: "", requestedAt: "" };

export default function AtasPage() {
  const [records, setRecords] = useState<PriceRecord[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [ataForm, setAtaForm] = useState(emptyAta);
  const [itemForm, setItemForm] = useState(emptyItem);
  const [caronaForm, setCaronaForm] = useState(emptyCarona);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const [ataResponse, contractResponse] = await Promise.all([
      api.priceRecords.list({ search: search || undefined, limit: 50 }) as Promise<{ data: PriceRecord[] }>,
      api.contracts.list({ limit: 100 }) as Promise<{ data: Contract[] }>,
    ]);
    setRecords(ataResponse.data);
    setContracts(contractResponse.data);
    setSelectedId((current) => current || ataResponse.data[0]?.id || "");
  }, [search]);

  useEffect(() => { load().catch(() => setError("Não foi possível carregar as atas.")); }, [load]);

  const selected = useMemo(() => records.find((record) => record.id === selectedId), [records, selectedId]);
  const availableContracts = contracts.filter((contract) => !records.some((record) => record.contract.id === contract.id));

  const createAta = async () => {
    if (!ataForm.contractId || !ataForm.ataNumber.trim()) return;
    setError("");
    try {
      await api.priceRecords.create({
        ...ataForm,
        startsAt: ataForm.startsAt || undefined,
        endsAt: ataForm.endsAt || undefined,
      });
      setAtaForm(emptyAta);
      await load();
    } catch { setError("Não foi possível cadastrar a ata. Verifique se o contrato já possui uma ata."); }
  };

  const addItem = async () => {
    if (!selected || !itemForm.description.trim()) return;
    await api.priceRecords.addItem(selected.id, {
      ...itemForm,
      registeredQty: itemForm.registeredQty ? Number(itemForm.registeredQty) : undefined,
      balanceQty: itemForm.registeredQty ? Number(itemForm.registeredQty) : undefined,
      unitPrice: itemForm.unitPrice ? Number(itemForm.unitPrice) : undefined,
    });
    setItemForm(emptyItem);
    await load();
  };

  const addCarona = async () => {
    if (!selected || !caronaForm.agency.trim()) return;
    await api.priceRecords.addCarona(selected.id, {
      ...caronaForm,
      value: caronaForm.value ? Number(caronaForm.value) : undefined,
      requestedAt: caronaForm.requestedAt || undefined,
    });
    setCaronaForm(emptyCarona);
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Atas de Registro de Preço</h2>
        <p className="text-muted-foreground">{records.length} atas com controle de itens, saldos, vigência e caronas</p>
      </div>

      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <Card>
        <CardHeader><CardTitle className="text-base">Cadastrar ata</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-5">
          <select className="h-10 rounded-md border bg-background px-3 text-sm" value={ataForm.contractId} onChange={(event) => setAtaForm({ ...ataForm, contractId: event.target.value })}>
            <option value="">Selecione o contrato</option>
            {availableContracts.map((contract) => <option key={contract.id} value={contract.id}>{contract.contractNumber} · {contract.agency}</option>)}
          </select>
          <Input placeholder="Número da ata" value={ataForm.ataNumber} onChange={(event) => setAtaForm({ ...ataForm, ataNumber: event.target.value })} />
          <Input type="date" title="Início da vigência" value={ataForm.startsAt} onChange={(event) => setAtaForm({ ...ataForm, startsAt: event.target.value })} />
          <Input type="date" title="Fim da vigência" value={ataForm.endsAt} onChange={(event) => setAtaForm({ ...ataForm, endsAt: event.target.value })} />
          <Button onClick={createAta} disabled={!ataForm.contractId || !ataForm.ataNumber.trim()}>Cadastrar ata</Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardHeader className="space-y-3">
            <CardTitle className="text-base">Atas cadastradas</CardTitle>
            <div className="flex gap-2"><Input placeholder="Número, órgão ou objeto" value={search} onChange={(event) => setSearch(event.target.value)} /><Button variant="outline" onClick={load}>Buscar</Button></div>
          </CardHeader>
          <CardContent>
            {!records.length ? <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma ata cadastrada.</p> : (
              <div className="space-y-2">
                {records.map((record) => (
                  <button key={record.id} type="button" onClick={() => setSelectedId(record.id)} className={`w-full rounded-md border p-3 text-left text-sm transition-colors ${selectedId === record.id ? "border-primary bg-muted" : "hover:bg-muted/60"}`}>
                    <span className="font-semibold">Ata {record.ataNumber}</span>
                    <span className="mt-1 block text-muted-foreground">{record.contract.agency} · Contrato {record.contract.contractNumber}</span>
                    <span className="mt-1 block text-xs">Vigência até {record.endsAt ? formatDate(record.endsAt) : "não informada"} · {record.items.length} itens</span>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {!selected ? <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">Selecione uma ata para gerenciar seus itens e caronas.</CardContent></Card> : <>
            <Card>
              <CardHeader><CardTitle className="text-base">Itens da ata {selected.ataNumber}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 md:grid-cols-6">
                  <Input placeholder="Item" value={itemForm.itemNumber} onChange={(event) => setItemForm({ ...itemForm, itemNumber: event.target.value })} />
                  <Input placeholder="Descrição" className="md:col-span-2" value={itemForm.description} onChange={(event) => setItemForm({ ...itemForm, description: event.target.value })} />
                  <Input placeholder="Unidade" value={itemForm.unit} onChange={(event) => setItemForm({ ...itemForm, unit: event.target.value })} />
                  <Input type="number" min="0" step="0.0001" placeholder="Quantidade" value={itemForm.registeredQty} onChange={(event) => setItemForm({ ...itemForm, registeredQty: event.target.value })} />
                  <Input type="number" min="0" step="0.01" placeholder="Valor unit." value={itemForm.unitPrice} onChange={(event) => setItemForm({ ...itemForm, unitPrice: event.target.value })} />
                </div>
                <Button size="sm" onClick={addItem} disabled={!itemForm.description.trim()}>Adicionar item</Button>
                <Table>
                  <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Descrição</TableHead><TableHead>Registrado</TableHead><TableHead>Saldo</TableHead><TableHead>Valor unit.</TableHead></TableRow></TableHeader>
                  <TableBody>{selected.items.map((item) => <TableRow key={item.id}><TableCell>{item.itemNumber || "—"}</TableCell><TableCell>{item.description}</TableCell><TableCell>{item.registeredQty ?? "—"} {item.unit}</TableCell><TableCell>{item.balanceQty ?? "—"} {item.unit}</TableCell><TableCell>{item.unitPrice ? formatCurrency(Number(item.unitPrice)) : "—"}</TableCell></TableRow>)}</TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Caronas</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 md:grid-cols-4">
                  <Input placeholder="Órgão solicitante" value={caronaForm.agency} onChange={(event) => setCaronaForm({ ...caronaForm, agency: event.target.value })} />
                  <Input placeholder="Objeto" value={caronaForm.object} onChange={(event) => setCaronaForm({ ...caronaForm, object: event.target.value })} />
                  <Input type="number" min="0" step="0.01" placeholder="Valor" value={caronaForm.value} onChange={(event) => setCaronaForm({ ...caronaForm, value: event.target.value })} />
                  <Input type="date" title="Data da solicitação" value={caronaForm.requestedAt} onChange={(event) => setCaronaForm({ ...caronaForm, requestedAt: event.target.value })} />
                </div>
                <Button size="sm" onClick={addCarona} disabled={!caronaForm.agency.trim()}>Registrar carona</Button>
                {selected.caronas.map((carona) => <div key={carona.id} className="flex flex-wrap justify-between gap-2 rounded-md border p-3 text-sm"><span><strong>{carona.agency}</strong>{carona.object ? ` · ${carona.object}` : ""}</span><span>{carona.value ? formatCurrency(Number(carona.value)) : "Valor não informado"}</span></div>)}
              </CardContent>
            </Card>
          </>}
        </div>
      </div>
    </div>
  );
}
