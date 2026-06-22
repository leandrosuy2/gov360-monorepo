"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  FileCheck2,
  FileSearch,
  Files,
  Gavel,
  HandCoins,
  LayoutDashboard,
  ListTodo,
  LockKeyhole,
  PlugZap,
  MessageSquareText,
  Radar,
  ReceiptText,
  Scale,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { NAV_GROUPS, NAV_ITEMS } from "@/config/navigation";
import { cn } from "@/lib/utils";

const groupIcons: Record<string, LucideIcon> = {
  Principal: LayoutDashboard,
  Inteligência: Radar,
  Gestão: BriefcaseBusiness,
  Comercial: TrendingUp,
  Disputa: Gavel,
  Operacional: ClipboardCheck,
  "Pós-venda": Building2,
  Sistema: ShieldCheck,
};

const itemIcons: Record<string, LucideIcon> = {
  "/dashboard": BarChart3,
  "/dashboard/oportunidades": Search,
  "/dashboard/mercado": Target,
  "/dashboard/concorrentes": Users,
  "/dashboard/licitacoes": Scale,
  "/dashboard/editais": FileSearch,
  "/dashboard/documentos": Files,
  "/dashboard/certidoes": FileCheck2,
  "/dashboard/propostas": ReceiptText,
  "/dashboard/simulacao": SlidersHorizontal,
  "/dashboard/pregoes": Gavel,
  "/dashboard/robo": Bot,
  "/dashboard/chat": MessageSquareText,
  "/dashboard/workflow": ListTodo,
  "/dashboard/contratos": BriefcaseBusiness,
  "/dashboard/atas": HandCoins,
  "/dashboard/financeiro": CircleDollarSign,
  "/dashboard/auditoria": LockKeyhole,
  "/dashboard/integracoes": PlugZap,
};

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCollapse: () => void;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, mobileOpen, onCollapse, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const activeGroup = NAV_ITEMS.find((item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)))?.group;
  const [openGroups, setOpenGroups] = React.useState<string[]>(() => activeGroup ? [activeGroup] : ["Principal"]);

  React.useEffect(() => {
    if (activeGroup) setOpenGroups((current) => current.includes(activeGroup) ? current : [...current, activeGroup]);
  }, [activeGroup]);

  const toggleGroup = (group: string) => {
    if (collapsed) {
      onCollapse();
      setOpenGroups((current) => current.includes(group) ? current : [...current, group]);
      return;
    }
    setOpenGroups((current) => current.includes(group) ? current.filter((name) => name !== group) : [...current, group]);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={onMobileClose}
        className={cn("fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity lg:hidden", mobileOpen ? "opacity-100" : "pointer-events-none opacity-0")}
      />

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-800/80 bg-slate-950 text-slate-100 shadow-2xl transition-[width,transform] duration-300 ease-out lg:relative lg:z-auto lg:translate-x-0 lg:shadow-none",
        collapsed ? "lg:w-[76px]" : "lg:w-72",
        mobileOpen ? "w-[min(88vw,320px)] translate-x-0" : "w-[min(88vw,320px)] -translate-x-full",
      )}>
        <div className="relative flex h-[72px] shrink-0 items-center justify-center border-b border-slate-800 px-4">
          <Link href="/dashboard" onClick={onMobileClose} className="flex items-center justify-center" aria-label="GOV360 — Painel executivo">
            <Image
              src={collapsed ? "/favicon.png" : "/logo.png"}
              alt="GOV360"
              width={collapsed ? 42 : 200}
              height={collapsed ? 42 : 46}
              priority
              className={cn(
                "object-contain transition-all duration-300",
                collapsed ? "hidden h-10 w-10 rounded-xl lg:block" : "h-auto w-[170px]",
              )}
            />
            {collapsed && (
              <Image src="/logo.png" alt="GOV360" width={200} height={46} priority className="h-auto w-[170px] lg:hidden" />
            )}
          </Link>
          <button type="button" onClick={onMobileClose} className="absolute right-3 rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden" aria-label="Fechar navegação"><X className="h-5 w-5" /></button>
        </div>

        <nav className="sidebar-scroll flex-1 overflow-x-hidden overflow-y-auto px-3 py-4" aria-label="Navegação principal">
          <div className="space-y-1.5">
            {NAV_GROUPS.map((group) => {
              const GroupIcon = groupIcons[group] ?? LayoutDashboard;
              const groupItems = NAV_ITEMS.filter((item) => item.group === group);
              const isOpen = openGroups.includes(group);
              const hasActiveItem = group === activeGroup;

              return (
                <div key={group}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(group)}
                    title={collapsed ? group : undefined}
                    aria-expanded={isOpen}
                    className={cn(
                      "group flex w-full items-center rounded-xl border border-transparent px-3 py-2.5 text-left text-sm font-medium transition-all duration-200",
                      hasActiveItem
                        ? "border-cyan-400/10 bg-cyan-400/[0.07] text-slate-100 shadow-[inset_0_0_20px_rgba(34,211,238,0.025)]"
                        : "text-slate-400 hover:border-slate-700/60 hover:bg-slate-800/55 hover:text-slate-100",
                      collapsed && "lg:justify-center lg:px-2",
                    )}
                  >
                    <GroupIcon className={cn("h-[19px] w-[19px] shrink-0 transition-colors", hasActiveItem ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-300")} />
                    <span className={cn("ml-3 flex-1", collapsed && "lg:hidden")}>{group}</span>
                    <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform", isOpen && "rotate-180", collapsed && "lg:hidden")} />
                  </button>

                  <div className={cn("grid transition-[grid-template-rows,opacity] duration-200", isOpen && !collapsed ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0", collapsed && "lg:hidden")}>
                    <ul className="overflow-hidden py-1 pl-3">
                      {groupItems.map((item) => {
                        const ItemIcon = itemIcons[item.href] ?? ChevronRight;
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={onMobileClose}
                              className={cn(
                                "group/item relative my-0.5 flex items-center gap-3 overflow-hidden rounded-lg border border-transparent py-2.5 pl-5 pr-3 text-[13px] transition-all duration-200 before:absolute before:bottom-1.5 before:left-0 before:top-1.5 before:w-0.5 before:rounded-full",
                                isActive
                                  ? "border-cyan-400/15 bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-transparent font-medium text-cyan-50 shadow-[0_4px_18px_rgba(8,145,178,0.08)] before:bg-cyan-400 before:shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                                  : "text-slate-400 before:bg-transparent hover:translate-x-0.5 hover:border-slate-700/50 hover:bg-gradient-to-r hover:from-slate-800/90 hover:to-slate-900/40 hover:text-slate-100",
                              )}
                            >
                              <ItemIcon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-cyan-300" : "text-slate-500 group-hover/item:text-cyan-300")} />
                              <span className="truncate">{item.title}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        <div className="shrink-0 border-t border-slate-800 p-3">
          <div className={cn("flex items-center gap-3 rounded-xl bg-slate-900/80 p-3", collapsed && "lg:justify-center lg:p-2")}>
            <div className="relative shrink-0"><ShieldCheck className="h-5 w-5 text-emerald-400" /><span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" /></div>
            <div className={cn("min-w-0 flex-1", collapsed && "lg:hidden")}><p className="text-xs font-medium text-slate-200">Sistema operacional</p><p className="text-[10px] text-slate-500">Ambiente seguro · v0.1</p></div>
          </div>
        </div>

        <button
          type="button"
          onClick={onCollapse}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          className="absolute -right-3 top-[88px] hidden h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 shadow-md hover:text-white lg:flex"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>
    </>
  );
}
