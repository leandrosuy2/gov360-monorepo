"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, UserRound } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@gov360/ui";
import { NAV_ITEMS } from "@/config/navigation";
import { useAuth } from "@/lib/auth-context";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("gov360-sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      window.localStorage.setItem("gov360-sidebar-collapsed", String(!current));
      return !current;
    });
  };

  const currentPage = NAV_ITEMS.find((item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)));
  const initials = user?.name?.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50">
      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onCollapse={toggleCollapsed} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-30 flex h-[72px] shrink-0 items-center justify-between border-b bg-white/95 px-4 shadow-sm backdrop-blur md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(true)} aria-label="Abrir menu" className="rounded-lg border p-2 text-slate-600 hover:bg-slate-100 lg:hidden"><Menu className="h-5 w-5" /></button>
            <button type="button" onClick={toggleCollapsed} aria-label={collapsed ? "Expandir menu" : "Recolher menu"} className="hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:block">
              {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-400"><span className="hidden sm:inline">{currentPage?.group ?? "GOV360"}</span><span className="hidden sm:inline">/</span><span className="truncate text-slate-600">{currentPage?.title ?? "Painel"}</span></div>
              <h1 className="truncate text-base font-semibold text-slate-900 md:text-lg">{currentPage?.title ?? "Painel Executivo"}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden text-right sm:block"><p className="max-w-40 truncate text-sm font-medium text-slate-700">{user?.name}</p><p className="text-[11px] text-slate-400">Ambiente corporativo</p></div>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700" title={user?.name}><span className="hidden sm:inline">{initials}</span><UserRound className="h-4 w-4 sm:hidden" /></div>
            <Button variant="outline" size="sm" onClick={logout} className="gap-2"><LogOut className="h-4 w-4" /><span className="hidden md:inline">Sair</span></Button>
          </div>
        </header>
        <main className="content-scroll flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
