import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, RefreshCw, Users, Search } from "lucide-react";
import { AdminShell, RowSkeleton, EmptyState } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/_authenticated/leads")({
  head: () => ({
    meta: [
      { title: "Leads — Klug Motors" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LeadsPage,
});

type Lead = {
  id: string;
  name: string;
  phone: string;
  model: string | null;
  entry: string | null;
  term: string | null;
  message: string | null;
  source: string;
  created_at: string;
};

function LeadsPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: u }) => {
      if (!u.user) return;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
      setIsAdmin(!!roles?.some((r: any) => r.role === "admin"));
    });
  }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    setLoading(false);
    if (error) return toast.error(error.message);
    setLeads((data ?? []) as Lead[]);
  }

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  async function handleDelete(l: Lead) {
    if (!confirm(`Excluir lead de "${l.name}"?`)) return;
    const { error } = await supabase.from("leads").delete().eq("id", l.id);
    if (error) return toast.error(error.message);
    toast.success("Lead removido");
    load();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const rows = leads.filter((l) => {
    if (!filter) return true;
    const f = filter.toLowerCase();
    return (
      l.name.toLowerCase().includes(f) ||
      l.phone.toLowerCase().includes(f) ||
      (l.model ?? "").toLowerCase().includes(f)
    );
  });

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
      title="Leads recebidos"
      subtitle={`${leads.length} solicitações`}
      actions={
        <Button
          variant="ghost"
          size="sm"
          onClick={load}
          aria-label="Recarregar leads"
          className="text-neutral-400 hover:text-neutral-100"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
          <Input
            placeholder="Buscar por nome, telefone ou modelo..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9"
            aria-label="Buscar leads"
          />
        </div>

        {loading ? (
          <RowSkeleton rows={6} cols={6} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Users}
            title={filter ? "Nada encontrado" : "Nenhum lead ainda"}
            description={
              filter
                ? "Tente ajustar sua busca."
                : "As solicitações de financiamento e consórcio aparecem aqui em tempo real."
            }
          />
        ) : (
          <div className="border border-neutral-800 rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-neutral-900/80 text-neutral-400 sticky top-0">
                <tr>
                  <th className="text-left p-3 font-medium">Data</th>
                  <th className="text-left p-3 font-medium">Nome</th>
                  <th className="text-left p-3 font-medium">WhatsApp</th>
                  <th className="text-left p-3 font-medium">Modelo</th>
                  <th className="text-left p-3 font-medium">Entrada</th>
                  <th className="text-left p-3 font-medium">Prazo</th>
                  <th className="text-left p-3 font-medium">Origem</th>
                  <th className="text-right p-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((l) => (
                  <tr
                    key={l.id}
                    className="border-t border-neutral-800 hover:bg-neutral-900/60 align-top transition-colors"
                  >
                    <td className="p-3 text-xs text-neutral-400 whitespace-nowrap tabular-nums">
                      {new Date(l.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{l.name}</div>
                      {l.message && <div className="text-xs text-neutral-500 mt-1 max-w-xs">{l.message}</div>}
                    </td>
                    <td className="p-3">
                      <a
                        href={`https://wa.me/55${l.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                      >
                        {l.phone}
                      </a>
                    </td>
                    <td className="p-3">{l.model ?? "—"}</td>
                    <td className="p-3 text-xs">{l.entry ?? "—"}</td>
                    <td className="p-3 text-xs">{l.term ?? "—"}</td>
                    <td className="p-3 text-xs uppercase text-neutral-400">{l.source}</td>
                    <td className="p-3 text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(l)}
                        aria-label={`Excluir lead ${l.name}`}
                        className="h-8 w-8 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
