import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type Model, type SectionImages } from "@/lib/models";

export type GalleryItem = { url: string; hidden?: boolean };

export type DbModel = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  tag: string;
  price: string;
  price_number: number;
  range_km: string;
  speed: string;
  power: string;
  short_description: string;
  description: string;
  colors: {
    name: string;
    hex: string;
    image: string;
    hidden?: boolean;
    gallery?: string[];
    sections?: SectionImages;
  }[];
  specs: { label: string; value: string }[];
  features: string[];
  gallery: Array<string | GalleryItem>;
  is_active: boolean;
  sort_order: number;
  condition: "zero_km" | "semi_nova";
  installment_months?: number;
  installment_value?: number;
  installment_note?: string;
};


export function normalizeGallery(raw: DbModel["gallery"] | null | undefined): GalleryItem[] {
  return (raw ?? []).map((g) => (typeof g === "string" ? { url: g } : { url: g.url, hidden: !!g.hidden }));
}

/** URLs `blob:`/`data:` são temporárias do navegador e nunca carregam depois de salvas. */
function safeUrl(url?: string) {
  if (!url) return "";
  return /^(blob:|data:)/i.test(url) ? "" : url;
}

export function dbToModel(m: DbModel): Model {
  const visibleGallery = normalizeGallery(m.gallery)
    .filter((g) => !g.hidden && safeUrl(g.url))
    .map((g) => g.url);
  const colors = (m.colors ?? []).map((c) => ({
    name: c.name,
    hex: c.hex,
    image: c.hidden ? "" : safeUrl(c.image) || visibleGallery[0] || "",
    ...(c.gallery && c.gallery.length ? { gallery: c.gallery } : {}),
    ...(!c.hidden && c.sections && Object.keys(c.sections).length ? { sections: c.sections } : {}),
  }));
  return {
    slug: m.slug,
    name: m.name,
    tag: m.tag,
    price: m.price,
    priceNumber: m.price_number,
    range: m.range_km,
    speed: m.speed,
    power: m.power,
    short: m.short_description,
    description: m.description,
    colors,
    specs: m.specs ?? [],
    features: m.features ?? [],
    gallery: visibleGallery.length ? visibleGallery : undefined,
    condition: m.condition,
    installmentMonths: m.installment_months ?? undefined,
    installmentValue: m.installment_value ? Number(m.installment_value) : undefined,
    installmentNote: m.installment_note ?? undefined,
  };
}


// Colunas mínimas para renderizar cards de catálogo — evita trafegar
// description/specs/features/gallery (payload muito maior) na listagem.
const LIST_COLUMNS =
  "id,slug,brand,name,tag,price,price_number,range_km,speed,power,short_description,colors,is_active,sort_order,condition,installment_months,installment_value,installment_note";


async function fetchModels(includeInactive = false, light = false) {
  let q = supabase
    .from("models")
    .select(light ? LIST_COLUMNS : "*")
    .order("sort_order", { ascending: true });
  if (!includeInactive) q = q.eq("is_active", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as unknown as DbModel[];
}


/**
 * Public catalog — active only. O banco é a ÚNICA fonte de preços: nada de
 * fallback estático, que exibia valores antigos até a resposta do banco.
 */
export function usePublicModels() {
  const q = useQuery({
    queryKey: ["models", "public"],
    queryFn: () => fetchModels(false),
    staleTime: 30_000, // Realtime invalida o cache quando o admin edita
    gcTime: 30 * 60_000,
  });
  const items = q.data ? q.data.map(dbToModel) : [];
  return { ...q, items, brands: q.data?.map((m) => m.brand) ?? [] };
}

/** Query options do catálogo enxuto — reutilizável no loader da rota. */
export const publicModelsLightOptions = queryOptions({
  queryKey: ["models", "public", "light"],
  queryFn: () => fetchModels(false, true),
  staleTime: 30_000, // Realtime invalida o cache quando o admin edita
  gcTime: 30 * 60_000,
});

/** Catálogo (cards) — payload enxuto, muito mais rápido que o SELECT *. */
export function usePublicModelsLight() {
  const q = useQuery(publicModelsLightOptions);
  const items = q.data ? q.data.map(dbToModel) : [];
  return { ...q, items, brands: q.data?.map((m) => m.brand) ?? [] };
}

/** Página de produto — busca apenas o modelo pedido (1 linha). */
export function useModelBySlug(slug: string) {
  return useQuery({
    queryKey: ["models", "public", "slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("models")
        .select("*")
        .ilike("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as DbModel | null) ?? null;
    },
    staleTime: 30_000, // Realtime invalida o cache quando o admin edita
    gcTime: 30 * 60_000,
  });
}


/** Admin — all models including inactive. */
export function useAdminModels() {
  return useQuery({
    queryKey: ["models", "admin"],
    queryFn: () => fetchModels(true),
    staleTime: 0,
  });
}
