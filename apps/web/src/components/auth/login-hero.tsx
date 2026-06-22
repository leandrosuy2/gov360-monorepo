import { BarChart3, FileSearch, Gavel, Shield } from "lucide-react";

const FEATURES = [
  { icon: FileSearch, text: "Inteligência de oportunidades em portais públicos" },
  { icon: Gavel, text: "Gestão completa de licitações e pregões" },
  { icon: BarChart3, text: "Indicadores estratégicos para a diretoria" },
  { icon: Shield, text: "Sistema proprietário com controle total dos dados" },
];

export function LoginHero() {
  return (
    <section className="relative hidden overflow-hidden bg-[#001233] lg:flex lg:w-[48%] lg:flex-col lg:justify-between xl:w-[52%]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60" />
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#009c3b]/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#002776]/40 blur-3xl" />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-8 xl:px-16">
        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#4ade80]">Gov360</p>

        <h2 className="max-w-lg text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl xl:text-4xl">
          Inteligência, gestão e automação de{" "}
          <span className="text-[#4ade80]">licitações públicas</span>
        </h2>

        <p className="mt-4 max-w-md text-base leading-relaxed text-slate-300">
          Centralize oportunidades, editais, propostas, pregões e contratos em um único ambiente corporativo.
        </p>

        <ul className="mt-10 space-y-4">
          {FEATURES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-slate-200">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#4ade80]">
                <Icon className="h-4 w-4" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 border-t border-white/10 px-12 py-6 xl:px-16">
        <p className="text-xs text-slate-400">
          © 2026 Gov360 · Plataforma proprietária de gestão governamental
        </p>
      </div>
    </section>
  );
}
