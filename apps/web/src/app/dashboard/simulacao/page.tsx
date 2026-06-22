"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Calculator, CheckCircle2, ShieldCheck, Target, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Input } from "@gov360/ui";
import { formatCurrency } from "@gov360/utils";

type FormState = {
  referenceValue: string;
  directCost: string;
  taxRate: string;
  freight: string;
  operationalCost: string;
  desiredMargin: string;
  expectedDiscount: string;
  competitors: string;
  bidStep: string;
};

const initialForm: FormState = {
  referenceValue: "100000",
  directCost: "62000",
  taxRate: "12",
  freight: "3000",
  operationalCost: "2500",
  desiredMargin: "15",
  expectedDiscount: "8",
  competitors: "5",
  bidStep: "500",
};

const numberValue = (value: string) => Number(value.replace(",", ".")) || 0;

export default function SimulacaoPage() {
  const [form, setForm] = useState(initialForm);

  const result = useMemo(() => {
    const reference = numberValue(form.referenceValue);
    const directCost = numberValue(form.directCost);
    const taxRate = numberValue(form.taxRate) / 100;
    const freight = numberValue(form.freight);
    const operational = numberValue(form.operationalCost);
    const desiredMargin = numberValue(form.desiredMargin) / 100;
    const expectedDiscount = numberValue(form.expectedDiscount) / 100;
    const bidStep = numberValue(form.bidStep);
    const competitors = Math.max(1, numberValue(form.competitors));

    const totalFixedCost = directCost + freight + operational;
    const simulatedPrice = reference * (1 - expectedDiscount);
    const taxes = simulatedPrice * taxRate;
    const profit = simulatedPrice - totalFixedCost - taxes;
    const actualMargin = simulatedPrice > 0 ? profit / simulatedPrice : 0;
    const breakEven = taxRate < 1 ? totalFixedCost / (1 - taxRate) : 0;
    const targetPrice = taxRate + desiredMargin < 1 ? totalFixedCost / (1 - taxRate - desiredMargin) : 0;
    const maxSafeDiscount = reference > 0 ? Math.max(0, 1 - targetPrice / reference) : 0;
    const possibleBids = bidStep > 0 ? Math.max(0, Math.floor((simulatedPrice - breakEven) / bidStep)) : 0;
    const pressure = Math.min(1, competitors / 12);

    const scenarios = [
      { name: "Conservador", discount: Math.max(0, expectedDiscount - 0.03), color: "emerald" },
      { name: "Moderado", discount: expectedDiscount, color: "blue" },
      { name: "Agressivo", discount: expectedDiscount + 0.05 + pressure * 0.02, color: "amber" },
    ].map((scenario) => {
      const price = reference * (1 - scenario.discount);
      const scenarioProfit = price - totalFixedCost - price * taxRate;
      return { ...scenario, price, profit: scenarioProfit, margin: price > 0 ? scenarioProfit / price : 0 };
    });

    return { reference, simulatedPrice, taxes, profit, actualMargin, breakEven, targetPrice, maxSafeDiscount, possibleBids, scenarios };
  }, [form]);

  const update = (field: keyof FormState, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const healthy = result.actualMargin >= numberValue(form.desiredMargin) / 100;

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold">Simulação Estratégica</h2><p className="text-muted-foreground">Teste descontos, margens e cenários antes de entrar na disputa</p></div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card className="h-fit">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Calculator className="h-5 w-5 text-cyan-600" />Parâmetros financeiros</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            {[
              ["referenceValue", "Valor estimado do edital", "R$"],
              ["directCost", "Custo direto", "R$"],
              ["freight", "Frete e logística", "R$"],
              ["operationalCost", "Custo operacional", "R$"],
              ["taxRate", "Impostos", "%"],
              ["desiredMargin", "Margem mínima desejada", "%"],
              ["expectedDiscount", "Desconto pretendido", "%"],
              ["competitors", "Concorrentes estimados", "qtd."],
              ["bidStep", "Intervalo entre lances", "R$"],
            ].map(([field, label, suffix]) => (
              <label key={field} className="space-y-1.5"><span className="text-xs font-medium text-slate-600">{label}</span><div className="relative"><Input type="number" min="0" step="0.01" value={form[field as keyof FormState]} onChange={(event) => update(field as keyof FormState, event.target.value)} className="pr-12" /><span className="pointer-events-none absolute right-3 top-2.5 text-xs text-slate-400">{suffix}</span></div></label>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric title="Preço simulado" value={formatCurrency(result.simulatedPrice)} detail={`${form.expectedDiscount}% abaixo do estimado`} icon={TrendingDown} tone="blue" />
            <Metric title="Margem projetada" value={`${(result.actualMargin * 100).toFixed(2)}%`} detail={healthy ? "Acima da margem mínima" : "Abaixo da margem mínima"} icon={healthy ? CheckCircle2 : AlertTriangle} tone={healthy ? "emerald" : "red"} />
            <Metric title="Lucro projetado" value={formatCurrency(result.profit)} detail={`Impostos: ${formatCurrency(result.taxes)}`} icon={Target} tone={result.profit >= 0 ? "emerald" : "red"} />
            <Metric title="Lances possíveis" value={String(result.possibleBids)} detail="Até atingir o ponto de equilíbrio" icon={ShieldCheck} tone="slate" />
          </div>

          <Card className={healthy ? "border-emerald-200 bg-emerald-50/30" : "border-red-200 bg-red-50/40"}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="flex items-start gap-3">{healthy ? <CheckCircle2 className="mt-0.5 h-6 w-6 text-emerald-600" /> : <AlertTriangle className="mt-0.5 h-6 w-6 text-red-600" />}<div><p className="font-semibold">{healthy ? "Cenário financeiramente saudável" : "Atenção: margem abaixo do limite"}</p><p className="text-sm text-muted-foreground">O desconto máximo recomendado para preservar a margem é <strong>{(result.maxSafeDiscount * 100).toFixed(2)}%</strong>.</p></div></div>
              <div className="text-right"><p className="text-xs text-muted-foreground">Preço-alvo mínimo</p><p className="text-xl font-bold">{formatCurrency(result.targetPrice)}</p></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Comparação de cenários</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {result.scenarios.map((scenario) => {
                const viable = scenario.price >= result.breakEven;
                return <div key={scenario.name} className="rounded-xl border bg-slate-50/60 p-4"><div className="flex items-center justify-between"><p className="font-semibold">{scenario.name}</p><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${viable ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{viable ? "VIÁVEL" : "PREJUÍZO"}</span></div><p className="mt-4 text-2xl font-bold">{formatCurrency(scenario.price)}</p><p className="text-xs text-muted-foreground">Desconto de {(scenario.discount * 100).toFixed(1)}%</p><div className="mt-4 space-y-2 border-t pt-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Margem</span><strong className={scenario.margin >= 0 ? "text-emerald-700" : "text-red-700"}>{(scenario.margin * 100).toFixed(2)}%</strong></div><div className="flex justify-between"><span className="text-muted-foreground">Resultado</span><strong>{formatCurrency(scenario.profit)}</strong></div></div></div>;
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Faixa segura para disputa</CardTitle></CardHeader>
            <CardContent><div className="relative h-3 overflow-hidden rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-emerald-500"><span className="absolute -top-1 h-5 w-1 rounded bg-slate-950" style={{ left: `${Math.min(100, Math.max(0, result.reference ? (result.simulatedPrice / result.reference) * 100 : 0))}%` }} /></div><div className="mt-3 flex justify-between text-xs"><span>Ponto de equilíbrio<br /><strong>{formatCurrency(result.breakEven)}</strong></span><span className="text-center">Preço atual<br /><strong>{formatCurrency(result.simulatedPrice)}</strong></span><span className="text-right">Valor estimado<br /><strong>{formatCurrency(result.reference)}</strong></span></div></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Metric({ title, value, detail, icon: Icon, tone }: { title: string; value: string; detail: string; icon: typeof Calculator; tone: "blue" | "emerald" | "red" | "slate" }) {
  const tones = { blue: "bg-blue-100 text-blue-700", emerald: "bg-emerald-100 text-emerald-700", red: "bg-red-100 text-red-700", slate: "bg-slate-200 text-slate-700" };
  return <Card><CardContent className="p-4"><div className={`mb-3 grid h-9 w-9 place-items-center rounded-lg ${tones[tone]}`}><Icon className="h-4 w-4" /></div><p className="text-xs text-muted-foreground">{title}</p><p className="mt-1 text-xl font-bold tracking-tight">{value}</p><p className="mt-1 text-[11px] text-muted-foreground">{detail}</p></CardContent></Card>;
}
