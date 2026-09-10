import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { X, Plus } from "lucide-react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { PageLayout } from "@/components/PageLayout";
import { usePublicModels } from "@/hooks/useDbModels";

const BASE_URL = "https://klugmotors.com.br";

const searchSchema = z.object({
  a: fallback(z.string().optional(), undefined),
  b: fallback(z.string().optional(), undefined),
  c: fallback(z.string().optional(), undefined),
});

export const Route = createFileRoute("/comparar")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Comparar Scooters e Motos Elétricas | Klug Motors" },
      { name: "description", content: "Compare motos e scooters lado a lado: ficha técnica completa, autonomia, velocidade, potência, bateria e preço. Escolha o modelo ideal." },
      { property: "og:title", content: "Comparar Modelos — Klug Motors" },
      { property: "og:description", content: "Tabela comparativa com ficha técnica completa. Compare até 3 modelos ao mesmo tempo." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE_URL}/comparar` },
      { property: "og:image", content: `${BASE_URL}/__l5e/assets-v1/dd3bf9a3-ca4b-4ea0-9c53-8898983e7768/og-comparar.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${BASE_URL}/__l5e/assets-v1/dd3bf9a3-ca4b-4ea0-9c53-8898983e7768/og-comparar.jpg` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/comparar` }],
  }),
  component: CompararPage,
});

/** Categoriza labels da ficha técnica no mesmo padrão da página de produto. */
function categoryOf(label: string): { id: string; label: string } {
  const l = label.toLowerCase();
  if (/(bateria|carreg|autonom|células|voltage|tens[aã]o|amp|kwh)/.test(l))
    return { id: "bateria", label: "Bateria & Autonomia" };
  if (/(motor|pot[eê]ncia|torque|rpm|kw\b|cv\b|hp\b|cilindr|combust)/.test(l))
    return { id: "motor", label: "Motor" };
  if (/(freio|abs|disco|tambor)/.test(l)) return { id: "freios", label: "Freios" };
  if (/(suspens|garfo|amortec)/.test(l)) return { id: "suspensao", label: "Suspensão" };
  if (/(pneu|roda|aro)/.test(l)) return { id: "rodas", label: "Rodas e Pneus" };
  if (/(dimens|altura|comprim|largura|entre.eixos|peso|tanque|capacid|assento|solo)/.test(l))
    return { id: "dimensoes", label: "Dimensões" };
  if (/(chassi|quadro|estrutura)/.test(l)) return { id: "chassi", label: "Chassi" };
  if (/(veloc|km\/h)/.test(l)) return { id: "desempenho", label: "Desempenho" };
  if (/(habilita|cnh|categoria)/.test(l)) return { id: "legal", label: "Habilitação" };
  return { id: "geral", label: "Geral" };
}

type Row = { label: string; values: (string | undefined)[] };
type Group = { id: string; label: string; rows: Row[] };

function buildGroups(models: { specs: { label: string; value: string }[] }[]): Group[] {
  const order: string[] = [];
  const seen = new Set<string>();
  // Preserva ordem original: percorre modelos e coleta labels únicos.
  for (const m of models) {
    for (const s of m.specs) {
      const key = s.label.trim();
      if (!seen.has(key)) {
        seen.add(key);
        order.push(key);
      }
    }
  }
  const groups = new Map<string, Group>();
  const groupOrder: string[] = [];
  for (const label of order) {
    const cat = categoryOf(label);
    if (!groups.has(cat.id)) {
      groups.set(cat.id, { id: cat.id, label: cat.label, rows: [] });
      groupOrder.push(cat.id);
    }
    groups.get(cat.id)!.rows.push({
      label,
      values: models.map((m) => m.specs.find((s) => s.label.trim() === label)?.value),
    });
  }
  return groupOrder.map((id) => groups.get(id)!);
}

function CompararPage() {
  const { items: models } = usePublicModels();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/comparar" });

  const selected = useMemo(() => {
    const wanted = [search.a, search.b, search.c].filter(Boolean) as string[];
    const valid = wanted.filter((s) => models.some((m) => m.slug === s));
    if (valid.length) return valid;
    return models.slice(0, 2).map((m) => m.slug);
  }, [search.a, search.b, search.c, models]);

  const chosen = selected
    .map((s) => models.find((m) => m.slug === s))
    .filter(Boolean) as typeof models;

  const groups = useMemo(() => buildGroups(chosen), [chosen]);

  function updateUrl(next: (string | undefined)[]) {
    const [a, b, c] = next;
    navigate({ search: { a, b, c }, replace: true });
  }
  function setAt(i: number, slug: string) {
    const next = [...selected];
    next[i] = slug;
    updateUrl(next);
  }
  function removeAt(i: number) {
    if (selected.length <= 1) return;
    updateUrl(selected.filter((_, idx) => idx !== i));
  }
  function addSlot() {
    if (selected.length >= 3) return;
    const first = models.find((m) => !selected.includes(m.slug));
    if (first) updateUrl([...selected, first.slug]);
  }

  const cols = chosen.length;

  return (
    <PageLayout
      eyebrow="Ferramenta"
      title="Compare"
      titleAccent="modelos"
      intro="Escolha 2 modelos (até 3) e veja a ficha técnica completa lado a lado, agrupada por categoria."
      maxWidth="max-w-6xl"
    >
      {/* Seletores no topo — sempre visíveis, funcionam como cabeçalho fixo em desktop */}
      <div className={`grid gap-3 sm:gap-4 mb-6 ${cols === 1 ? "grid-cols-1 sm:grid-cols-2" : cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}>
        {chosen.map((m, i) => (
          <div key={`${m.slug}-${i}`} className="rounded-2xl border border-border bg-background/40 p-3 sm:p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <select
                value={m.slug}
                onChange={(e) => setAt(i, e.target.value)}
                className="min-w-0 flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-white font-display font-black uppercase tracking-wider focus:border-primary focus:outline-none truncate"
                aria-label={`Modelo ${i + 1}`}
              >
                {models.map((opt) => (
                  <option key={opt.slug} value={opt.slug}>{opt.name}</option>
                ))}
              </select>
              {chosen.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  aria-label={`Remover ${m.name}`}
                  className="shrink-0 w-11 h-11 grid place-items-center rounded-lg border border-border text-white/60 hover:text-primary hover:border-primary transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {m.colors[0]?.image && (
              <img
                src={m.colors[0].image}
                alt={m.name}
                loading="lazy"
                className="w-full aspect-square object-contain bg-background rounded-lg border border-border"
              />
            )}
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-primary font-display font-black text-base sm:text-lg truncate">{m.price}</span>
              <Link
                to="/modelos/$slug"
                params={{ slug: m.slug }}
                className="text-[10px] uppercase tracking-widest font-display font-black text-white/60 hover:text-primary whitespace-nowrap"
              >
                Ver ficha →
              </Link>
            </div>
          </div>
        ))}
        {chosen.length < 3 && (
          <button
            type="button"
            onClick={addSlot}
            className="min-h-[220px] grid place-items-center gap-2 border-2 border-dashed border-border rounded-2xl text-white/40 hover:border-primary hover:text-primary transition-colors"
            aria-label="Adicionar modelo para comparar"
          >
            <Plus size={24} />
            <span className="text-xs uppercase tracking-widest font-display font-black">Adicionar modelo</span>
          </button>
        )}
      </div>

      {/* Tabela comparativa por grupo */}
      <div className="space-y-8">
        {/* Cabeçalho fixo de resumo (sempre 1ª linha) */}
        <ComparisonBlock
          groupLabel="Resumo"
          rows={[
            { label: "Categoria", values: chosen.map((m) => m.tag) },
            { label: "Preço", values: chosen.map((m) => m.price) },
            { label: "Autonomia", values: chosen.map((m) => m.range) },
            { label: "Velocidade", values: chosen.map((m) => m.speed) },
            { label: "Potência", values: chosen.map((m) => m.power) },
          ]}
          cols={cols}
          highlight
        />

        {groups.map((g) => (
          <ComparisonBlock key={g.id} groupLabel={g.label} rows={g.rows} cols={cols} />
        ))}

        {groups.length === 0 && (
          <p className="text-center text-sm text-white/50 py-10">
            Os modelos selecionados ainda não têm ficha técnica cadastrada.
          </p>
        )}
      </div>
    </PageLayout>
  );
}

function ComparisonBlock({
  groupLabel,
  rows,
  cols,
  highlight,
}: {
  groupLabel: string;
  rows: Row[];
  cols: number;
  highlight?: boolean;
}) {
  const gridCols =
    cols === 1
      ? "grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
      : cols === 2
      ? "grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]"
      : "grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]";
  return (
    <section>
      <h3 className="text-[10px] sm:text-xs uppercase tracking-widest text-white/40 font-display font-black mb-3 px-1">
        {groupLabel}
      </h3>
      <div className="overflow-x-auto -mx-5 sm:mx-0">
        <div className="min-w-[520px] sm:min-w-0 rounded-xl border border-border overflow-hidden">
          {rows.map((r, i) => {
            const allEqual =
              r.values.length > 1 && r.values.every((v) => v && v === r.values[0]);
            return (
              <div
                key={`${r.label}-${i}`}
                className={[
                  "grid items-start gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-3.5",
                  gridCols,
                  i % 2 === 0 ? "bg-white/[0.03]" : "bg-transparent",
                  i !== rows.length - 1 ? "border-b border-border" : "",
                ].join(" ")}
              >
                <div className="min-w-0 text-[11px] sm:text-xs uppercase tracking-widest text-white/50 font-display font-black">
                  {r.label}
                </div>
                {r.values.map((v, j) => {
                  const isPrice = highlight && r.label === "Preço";
                  return (
                    <div
                      key={j}
                      className={[
                        "min-w-0 text-[13px] sm:text-sm leading-relaxed break-words",
                        isPrice ? "text-primary font-display font-black text-base sm:text-lg" : "text-white/85",
                        !v ? "text-white/30" : "",
                        allEqual && !isPrice ? "text-white/50" : "",
                      ].join(" ")}
                    >
                      {v ?? "—"}
                    </div>
                  );
                })}

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
