import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Bike, Users, Instagram, BarChart3, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";

const TABS = [
  { to: "/admin", label: "Modelos", icon: Bike },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/instagram", label: "Instagram", icon: Instagram },
  { to: "/analytics", label: "Conversões", icon: BarChart3 },
] as const;

export function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-neutral-950/80 border-b border-neutral-800/80">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight truncate">{title}</h1>
              {subtitle && (
                <p className="text-[11px] text-neutral-500 mt-0.5 truncate">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex gap-1.5 items-center">
            {actions}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-100 px-2.5 py-1.5 rounded-md hover:bg-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
              aria-label="Abrir site em nova aba"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Ver site
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              aria-label="Sair"
              className="text-neutral-400 hover:text-neutral-100"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <nav
          className="px-2 sm:px-4 pb-2 flex gap-1 overflow-x-auto scrollbar-none"
          aria-label="Navegação do painel"
        >
          {TABS.map((t) => {
            const active = pathname === t.to;
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 ${
                  active
                    ? "bg-neutral-100 text-neutral-950"
                    : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="px-4 sm:px-6 py-6 animate-fade-in">{children}</main>
    </div>
  );
}

export function CardSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-neutral-800/70 bg-neutral-900/40 overflow-hidden"
        >
          <div className="aspect-[4/3] bg-neutral-800/60 animate-pulse" />
          <div className="p-2 space-y-2">
            <div className="h-3 rounded bg-neutral-800/70 animate-pulse" />
            <div className="h-2.5 w-2/3 rounded bg-neutral-800/50 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RowSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="border border-neutral-800 rounded-xl overflow-hidden">
      <div className="divide-y divide-neutral-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-3 p-3">
            {Array.from({ length: cols }).map((_, j) => (
              <div
                key={j}
                className="h-3 rounded bg-neutral-800/70 animate-pulse"
                style={{ width: `${100 / cols - 2}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-dashed border-neutral-800 rounded-xl p-10 flex flex-col items-center text-center animate-fade-in">
      <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-neutral-500" />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && <p className="text-xs text-neutral-500 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="group border border-neutral-800 rounded-xl p-4 bg-gradient-to-br from-neutral-900/70 to-neutral-950 hover:border-neutral-700 transition-colors">
      <div className="text-[10px] uppercase tracking-widest text-neutral-500">{label}</div>
      <div className="text-3xl font-bold mt-1 tabular-nums">{value}</div>
      {hint && <div className="text-[11px] text-neutral-500 mt-1">{hint}</div>}
    </div>
  );
}
