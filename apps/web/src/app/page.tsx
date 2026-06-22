import Link from "next/link";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gov360/ui";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 p-8">
      <Card className="w-full max-w-2xl border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">GOV360</CardTitle>
          <CardDescription className="text-slate-400">
            Plataforma completa de inteligência, gestão e automação de licitações públicas.
            Sistema proprietário instalado e operado pela sua organização.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
            <span>• Inteligência de oportunidades</span>
            <span>• Gestão de licitações</span>
            <span>• Pregão eletrônico e robô de lances</span>
            <span>• Contratos e financeiro</span>
          </div>
          <div className="flex gap-3 pt-2">
            <Button asChild>
              <Link href="/login">Acessar plataforma</Link>
            </Button>
            <Button variant="outline" asChild className="border-slate-700 text-slate-200 hover:bg-slate-800">
              <Link href="/dashboard/oportunidades">Ver oportunidades</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
