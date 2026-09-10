import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import {
  ArrowLeft,
  Check,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  X,
  Expand,
  Truck,
  CreditCard,
  Percent,
  ShieldCheck,
  Store,
  ShoppingCart,
  MapPin,
  Play,
  Star,
} from "lucide-react";
import {
  getGallery,
  buildWhatsAppFallbackUrl,
  openWhatsAppWithFallback,
} from "@/lib/models";
import { useModelBySlug, dbToModel } from "@/hooks/useDbModels";
import { FinanciamentoForm } from "@/components/FinanciamentoForm";
import { YamahaProductPage } from "@/components/YamahaProductPage";
import klugSymbol from "@/assets/klug/klug-symbol.png.asset.json";
import { CreatedBy } from "@/components/CreatedBy";
import klugLogo from "@/assets/klug/klug-horizontal-white.png.asset.json";
import tenereNobgOptimized from "@/assets/seminovas/tenere-250-seminova-nobg.png?w=320;480;640;800;1024;1280&format=webp&quality=90&as=img";

const BASE_URL = "https://klugmotors.com.br";

function humanizeSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

export const slugColor = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

type SlugSearch = { cor?: string };

export const Route = createFileRoute("/modelos/$slug")({
  validateSearch: (s: Record<string, unknown>): SlugSearch => ({
    cor: typeof s.cor === "string" && s.cor.length > 0 ? s.cor : undefined,
  }),
  beforeLoad: ({ params, search }) => {
    if (params.slug.startsWith("seminova-")) {
      const newSlug = params.slug.replace("seminova-", "semi-nova-");
      throw redirect({ to: "/modelos/$slug", params: { slug: newSlug }, search });
    }
  },
  loader: ({ params }) => {
    // O banco é a única fonte de preço: nada de cadastro estático como
    // placeholder, que exibia valores antigos até a resposta do banco.
    return { model: null as import("@/lib/models").Model | null, slug: params.slug };
  },
  head: ({ loaderData, params }) => {
    const url = `${BASE_URL}/modelos/${params.slug}`;
    if (!loaderData || !loaderData.model) {
      const name = humanizeSlug(params.slug);
      const title = `${name} — Klug Motors | Motos e Scooters Elétricas`;
      const desc = `Conheça a ${name} na Klug Motors em Joinville/SC. Preço, autonomia, velocidade e financiamento facilitado.`;
      return {
        meta: [
          { title },
          { name: "description", content: desc },
          { property: "og:title", content: title },
          { property: "og:description", content: desc },
          { property: "og:type", content: "product" },
          { property: "og:url", content: url },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const m = loaderData.model;
    const title = `${m.name} — ${m.tag} | Klug Motors`;
    const desc = `${m.short} A partir de ${m.price}. Autonomia ${m.range}, ${m.speed}. Financiamento facilitado em Joinville/SC.`;
    const rawImg = m.colors[0]?.image;
    const img = rawImg
      ? rawImg.startsWith("http")
        ? rawImg
        : `${BASE_URL}${rawImg}`
      : undefined;
    const isTenere = params.slug === "semi-nova-yamaha-tenere-250";
    const tenereImg = isTenere ? tenereNobgOptimized : null;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        ...(img
          ? [
              { property: "og:image", content: img },
              { name: "twitter:card", content: "summary_large_image" },
              { name: "twitter:image", content: img },
            ]
          : []),
      ],
      links: [
        { rel: "canonical", href: url },
        ...(tenereImg
          ? [
              {
                rel: "preload",
                as: "image",
                href: tenereImg.src,
                imagesrcset: tenereImg.srcset,
                imagesizes: "(max-width: 1024px) 95vw, 50vw",
                fetchpriority: "high",
              },
            ]
          : img
          ? [{ rel: "preload", as: "image", href: img, fetchpriority: "high" }]
          : []),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${m.name} — Klug Motors`,
            description: m.description,
            brand: { "@type": "Brand", name: "Klug Motors" },
            category: m.tag,
            image: img,
            offers: {
              "@type": "Offer",
              price: m.priceNumber,
              priceCurrency: "BRL",
              availability: "https://schema.org/InStock",
              url,
              seller: { "@type": "Organization", name: "Klug Motors" },
            },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-dvh grid place-items-center bg-background p-6">
      <div className="text-center">
        <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-3">
          404
        </p>
        <h1 className="font-display font-black uppercase text-3xl tracking-tight mb-4">
          Modelo não encontrado
        </h1>
        <Link
          to="/modelos"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-xs px-5 py-3 rounded-full"
        >
          Ver catálogo <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-dvh grid place-items-center bg-background p-6">
      <div className="text-center max-w-md">
        <h1 className="font-display font-black uppercase text-2xl tracking-tight mb-3">
          Algo deu errado
        </h1>
        <p className="text-white/60 mb-6 text-sm">{error.message}</p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-xs px-5 py-3 rounded-full"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  ),
  component: ModelPage,
});

const TABS = [
  "Descrição Geral",
  "Itens Inclusos",
  "Características",
  "Garantia",
  "Formas de Pagamento",
  "Avaliações",
] as const;
type Tab = (typeof TABS)[number];

function ModelPage() {
  const data = Route.useLoaderData() as { model: import("@/lib/models").Model | null; slug: string };
  const { data: dbRow, isLoading: dbLoading } = useModelBySlug(data.slug);
  // O banco é a fonte de verdade: o cadastro estático só serve de placeholder
  // durante o carregamento. Modelo ausente/inativo no admin => 404.
  const m = dbRow ? dbToModel(dbRow) : dbLoading ? data.model ?? null : null;

  // Hooks must be declared unconditionally — never early-return above them.
  const [selected, setSelectedState] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [tab, setTab] = useState<Tab>("Descrição Geral");
  const [cep, setCep] = useState("");
  const gallery = useMemo(() => (m ? getGallery(m) : []), [m]);
  const [imgIndex, setImgIndex] = useState(0);

  const search = Route.useSearch();


  // Sync selected color with ?cor= search param (share-friendly deep links).
  useEffect(() => {
    if (!m || !search.cor) return;
    const idx = m.colors.findIndex((c) => slugColor(c.name) === search.cor);
    if (idx >= 0 && idx !== selected) setSelectedState(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m?.slug, search.cor]);

  const setSelected = useCallback(
    (i: number) => {
      setSelectedState(i);
      const color = m?.colors[i];
      if (!color || typeof window === "undefined") return;
      // Atualiza apenas o ?cor= via history API — evita re-render de rota,
      // re-run de loader e qualquer sensação de "reload" ao trocar de cor.
      const url = new URL(window.location.href);
      url.searchParams.set("cor", slugColor(color.name));
      window.history.replaceState(window.history.state, "", url.toString());
    },
    [m],
  );


  const variant = m?.colors[selected] ?? m?.colors[0];

  useEffect(() => {
    if (!variant) return;
    const idx = gallery.indexOf(variant.image);
    if (idx >= 0) setImgIndex(idx);
  }, [selected, variant, gallery]);

  const prevImage = useCallback(
    () => setImgIndex((i) => (gallery.length ? (i - 1 + gallery.length) % gallery.length : 0)),
    [gallery.length],
  );
  const nextImage = useCallback(
    () => setImgIndex((i) => (gallery.length ? (i + 1) % gallery.length : 0)),
    [gallery.length],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [lightbox, prevImage, nextImage]);

  if (!m) {
    if (dbLoading) {
      return (
        <div className="min-h-dvh grid place-items-center bg-background p-6 text-center">
          <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      );
    }
    return (
      <div className="min-h-dvh grid place-items-center bg-background p-6 text-center">
        <div>
          <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-3">404</p>
          <h1 className="font-display font-black uppercase text-3xl tracking-tight mb-4">Modelo não encontrado</h1>
          <Link to="/modelos" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-xs px-5 py-3 rounded-full">
            Ver catálogo <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  // All models use the dedicated editorial layout.
  return (
    <YamahaProductPage
      m={m}
      selected={selected}
      onSelect={setSelected}
    />
  );

}


function BenefitPill({
  icon: Icon,
  title,
  hint,
  highlight,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  hint?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon
        size={16}
        className={highlight ? "text-primary" : "text-white/60"}
      />
      <div className="leading-tight">
        <div className={highlight ? "text-primary" : "text-white"}>{title}</div>
        {hint && <div className="text-white/40 text-[9px] normal-case tracking-wide">{hint}</div>}
      </div>
    </div>
  );
}
