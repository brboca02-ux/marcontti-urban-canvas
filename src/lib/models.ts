import x12Img from "@/assets/motos/x12.jpg.asset.json";
import miaImg from "@/assets/motos/mia.jpg.asset.json";
import gigaImg from "@/assets/motos/giga.jpg.asset.json";
import retImg from "@/assets/motos/ret.jpg.asset.json";
import somaImg from "@/assets/motos/soma.jpg.asset.json";
import jetImg from "@/assets/motos/jet.jpg.asset.json";
import bigtriImg from "@/assets/motos/bigtri.jpg.asset.json";
import sofiaImg from "@/assets/motos/sofia.jpg.asset.json";
import miatriImg from "@/assets/motos/miatri.jpg.asset.json";
import suduA12Img from "@/assets/motos/sudu-a12.png.asset.json";
import suduA10Img from "@/assets/motos/sudu-a10.png.asset.json";
import suduA3PlusImg from "@/assets/motos/sudu-a3-plus.png.asset.json";
import suduA4Img from "@/assets/motos/sudu-a4.png.asset.json";
import suduA5Img from "@/assets/motos/sudu-a5.png.asset.json";
import suduA6Img from "@/assets/motos/sudu-a6.png.asset.json";
import suduA13TImg from "@/assets/motos/sudu-a13t.png.asset.json";
import yamahaNeosImg from "@/assets/motos/yamaha-neos-connected.png.asset.json";
import yamahaRayZrImg from "@/assets/motos/yamaha-rayzr-hybrid.png.asset.json";
import yamahaFluoImg from "@/assets/motos/yamaha-fluo-hybrid.png.asset.json";
import yamahaAeroxImg from "@/assets/motos/yamaha-aerox.png.asset.json";
import yamahaNmaxImg from "@/assets/motos/yamaha-nmax.png.asset.json";
import yamahaXmaxImg from "@/assets/motos/yamaha-xmax.png.asset.json";
import yamahaFactorImg from "@/assets/motos/yamaha-factor-150.png.asset.json";
import yamahaFactorDxImg from "@/assets/motos/yamaha-factor-150-dx.png.asset.json";
import yamahaFz25Img from "@/assets/motos/yamaha-fz25.png.asset.json";

/** Slots de imagem dos blocos da página de vendas (chave ausente = automático). */
export const SECTION_SLOTS = [
  { key: "hero", label: "Hero (imagem principal)" },
  { key: "terreno", label: "Pronta para qualquer terreno" },
  { key: "tecnologia_a", label: "Tecnologia e conforto — imagem A" },
  { key: "tecnologia_b", label: "Tecnologia e conforto — imagem B" },
  { key: "comodidade", label: "Comodidade — Praticidade que acompanha a sua rotina" },
  { key: "conectividade", label: "Conectividade" },
  { key: "modernidade_a", label: "Modernidade — Painel 100% digital (A)" },
  { key: "modernidade_b", label: "Modernidade — Painel 100% digital (B)" },
  { key: "modernidade_c", label: "Modernidade — Painel 100% digital (C)" },
] as const;

export type SectionSlot = (typeof SECTION_SLOTS)[number]["key"];
export type SectionImages = Partial<Record<SectionSlot, string>>;

export type ColorVariant = {
  name: string;
  hex: string;
  image: string;
  gallery?: string[];
  tagline?: string;
  description?: string;
  /** Imagem escolhida no admin para cada bloco da página de vendas. */
  sections?: SectionImages;
};


export type Model = {
  slug: string;
  name: string;
  tag: string;
  price: string;
  priceNumber: number;
  range: string;
  speed: string;
  power: string;
  short: string;
  description: string;
  colors: ColorVariant[];
  specs: { label: string; value: string }[];
  features: string[];
  gallery?: string[];
  condition?: "zero_km" | "semi_nova";
  installmentMonths?: number;
  installmentValue?: number;
  installmentNote?: string;
};


/** Build a gallery for a model: explicit gallery > color variants > single image. */
export function getGallery(m: Model): string[] {
  if (m.gallery && m.gallery.length > 0) return m.gallery;
  const fromColors = m.colors.map((c) => c.image).filter(Boolean);
  return fromColors.length > 0 ? fromColors : [];
}

export const models: Model[] = [];

// MT Mobilidade - Joinville
export const WHATSAPP_NUMBER = "554734293200";
const WHATSAPP_FALLBACK_DELAY = 1800;

export function getModel(slug: string): Model | undefined {
  return models.find((m) => m.slug === slug);
}

export function buildWhatsAppUrl(message: string, phone = WHATSAPP_NUMBER): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppFallbackUrl(message: string, phone = WHATSAPP_NUMBER): string {
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}

export function openWhatsAppWithFallback(
  message: string,
  phoneOrOpts?: string | { phone?: string; source?: string; modelSlug?: string; event?: string },
): void {
  if (typeof window === "undefined") return;

  const opts =
    typeof phoneOrOpts === "string" || phoneOrOpts === undefined
      ? { phone: (phoneOrOpts as string | undefined) ?? WHATSAPP_NUMBER }
      : { phone: phoneOrOpts.phone ?? WHATSAPP_NUMBER, ...phoneOrOpts };
  const phone = opts.phone ?? WHATSAPP_NUMBER;

  // Fire-and-forget analytics — never blocks navigation
  try {
    // Lazy import so this module stays framework-agnostic
    void import("@/lib/analytics").then(({ trackEvent }) => {
      trackEvent(opts.event ?? "whatsapp_click", {
        source: opts.source,
        modelSlug: opts.modelSlug,
      });
    });
  } catch {
    /* noop */
  }

  const primaryUrl = buildWhatsAppUrl(message, phone);
  const fallbackUrl = buildWhatsAppFallbackUrl(message, phone);
  const fallbackTimer = window.setTimeout(() => {
    if (document.visibilityState === "visible") window.location.assign(fallbackUrl);
  }, WHATSAPP_FALLBACK_DELAY);

  const clearFallback = () => window.clearTimeout(fallbackTimer);


  window.addEventListener("pagehide", clearFallback, { once: true });
  window.addEventListener("blur", clearFallback, { once: true });
  window.location.assign(primaryUrl);
}

/**
 * Opens WhatsApp in a new tab (does not navigate the current page).
 * Fires a `whatsapp_redirected` analytics event by default.
 * Must be called during a user gesture (e.g. from a form submit handler)
 * to avoid popup blockers.
 */
export function openWhatsAppNewTab(
  message: string,
  opts: { phone?: string; source?: string; modelSlug?: string; event?: string; meta?: Record<string, unknown> } = {},
): Window | null {
  if (typeof window === "undefined") return null;
  const phone = opts.phone ?? WHATSAPP_NUMBER;
  try {
    void import("@/lib/analytics").then(({ trackEvent }) => {
      trackEvent(opts.event ?? "whatsapp_redirected", {
        source: opts.source,
        modelSlug: opts.modelSlug,
        meta: opts.meta,
      });
    });
  } catch { /* noop */ }
  const url = buildWhatsAppUrl(message, phone);
  return window.open(url, "_blank", "noopener,noreferrer");
}


/** Modelo semi novo (usado, tag/slug ou coluna condition). */
export function isSemiNovaModel(m: Pick<Model, "slug" | "tag"> & { condition?: string }): boolean {
  return (
    m.condition === "semi_nova" ||
    m.slug.startsWith("semi-nova") ||
    /semi\s*nova/i.test(m.tag ?? "")
  );
}

/** Triciclo elétrico. */
export function isTricicloModel(m: Pick<Model, "tag">): boolean {
  return (m.tag ?? "").toLowerCase().includes("triciclo");
}

/**
 * A parcela prevista só é exibida para scooters Moto Chefe (klug),
 * SUDU e triciclos elétricos. Yamaha 0km e semi novas mostram só o valor.
 */
export function supportsInstallment(
  m: Pick<Model, "slug" | "tag"> & { condition?: string },
): boolean {
  if (isSemiNovaModel(m)) return false;
  if (isTricicloModel(m)) return true;
  if (m.slug.startsWith("yamaha")) return false;
  return true;
}
