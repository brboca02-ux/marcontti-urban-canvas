import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, RefreshCw, BarChart3 } from "lucide-react";
import { AdminShell, StatCard, EmptyState, RowSkeleton } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [
      { title: "Conversões — Klug Motors" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AnalyticsPage,
});

type Ev = {
  id: string;
  event_name: string;
  source: string | null;
  page: string | null;
  model_slug: string | null;
  created_at: string;
};

function AnalyticsPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [events, setEvents] = useState<Ev[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: u }) => {
      if (!u.user) return;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
      setIsAdmin(!!roles?.some((r: any) => r.role === "admin"));
    });
  }, []);

  async function load() {
    setLoading(true);
    const since = new Date(Date.now() - range * 86400000).toISOString();
    const { data, error } = await supabase
      .from("analytics_events")
      .select("id,event_name,source,page,model_slug,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(1000);
    setLoading(false);
    if (error) return toast.error(error.message);
    setEvents((data ?? []) as Ev[]);
  }

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, range]);

  async function clearAll() {
    if (!confirm(`Apagar TODOS os eventos dos últimos ${range} dias?`)) return;
    const since = new Date(Date.now() - range * 86400000).toISOString();
    const { error } = await supabase.from("analytics_events").delete().gte("created_at", since);
    if (error) return toast.error(error.message);
    toast.success("Eventos apagados");
    load();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of events) map.set(e.event_name, (map.get(e.event_name) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [events]);

  const bySource = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of events) {
      const k = `${e.event_name} · ${e.source ?? "—"}`;
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
  }, [events]);

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100 p-8 text-center">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Sem permissão</h1>
          <Button variant="outline" onClick={handleSignOut}>Sair</Button>
        </div>
      </div>
    );
  }

  return (
    <AdminShell
      title="Conversões"
      subtitle={`${events.length} eventos nos últimos ${range} dias`}
      actions={
        <div className="flex gap-1 items-center">
          <div className="flex bg-neutral-900 rounded-md p-0.5 border border-neutral-800">
            {[7, 30, 90].map((n) => (
              <button
                key={n}
                onClick={() => setRange(n as 7 | 30 | 90)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 ${
                  range === n
                    ? "bg-neutral-100 text-neutral-950"
                    : "text-neutral-400 hover:text-neutral-100"
                }`}
                aria-pressed={range === n}
              >
                {n}d
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={load}
            aria-label="Recarregar"
            className="text-neutral-400 hover:text-neutral-100"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            title="Apagar período"
            aria-label="Apagar eventos do período"
            className="hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </Button>
        </div>
      }
    >
      {loading ? (
        <div className="space-y-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl border border-neutral-800 bg-neutral-900/40 animate-pulse"
              />
            ))}
          </div>
          <RowSkeleton rows={6} cols={4} />
        </div>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="text-[11px] uppercase tracking-widest text-neutral-400 mb-3">Totais por evento</h2>
            {counts.length === 0 ? (
              <EmptyState
                icon={BarChart3}
                title="Sem eventos no período"
                description="Ainda não recebemos cliques rastreáveis nesta janela. Aumente o período ou aguarde novas interações."
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {counts.map(([name, n]) => (
                  <StatCard key={name} label={name} value={n} />
                ))}
              </div>
            )}
          </section>

          {counts.length > 0 && (
            <>
              <section>
                <h2 className="text-[11px] uppercase tracking-widest text-neutral-400 mb-3">Top origens</h2>
                <div className="border border-neutral-800 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-neutral-900/80 text-neutral-400">
                      <tr>
                        <th className="text-left p-3 font-medium">Evento · Origem</th>
                        <th className="text-right p-3 font-medium">Cliques</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bySource.map(([k, n]) => (
                        <tr key={k} className="border-t border-neutral-800 hover:bg-neutral-900/60 transition-colors">
                          <td className="p-3 text-xs">{k}</td>
                          <td className="p-3 text-right font-medium tabular-nums">{n}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-[11px] uppercase tracking-widest text-neutral-400 mb-3">Últimos eventos</h2>
                <div className="border border-neutral-800 rounded-xl overflow-x-auto">
                  <table className="w-full text-sm min-w-[720px]">
                    <thead className="bg-neutral-900/80 text-neutral-400">
                      <tr>
                        <th className="text-left p-3 font-medium">Data</th>
                        <th className="text-left p-3 font-medium">Evento</th>
                        <th className="text-left p-3 font-medium">Origem</th>
                        <th className="text-left p-3 font-medium">Modelo</th>
                        <th className="text-left p-3 font-medium">Página</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.slice(0, 200).map((e) => (
                        <tr key={e.id} className="border-t border-neutral-800 hover:bg-neutral-900/60 transition-colors">
                          <td className="p-3 text-xs text-neutral-400 whitespace-nowrap tabular-nums">{new Date(e.created_at).toLocaleString("pt-BR")}</td>
                          <td className="p-3 text-xs uppercase">{e.event_name}</td>
                          <td className="p-3 text-xs text-neutral-400">{e.source ?? "—"}</td>
                          <td className="p-3 text-xs text-neutral-400">{e.model_slug ?? "—"}</td>
                          <td className="p-3 text-xs text-neutral-400 truncate max-w-xs">{e.page ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      )}
    </AdminShell>
  );
}
