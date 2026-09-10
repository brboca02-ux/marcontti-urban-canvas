import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import {
  ArrowRight,
  Zap,
  Wrench,
  Leaf,
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  BadgeCheck,
  CreditCard,
  Wallet,
  BadgePercent,
  Store,
  ShieldCheck,
  Search,
  Headphones,
  Truck,
  Flame,
  Youtube,
  User,
} from "lucide-react";
import {
  buildWhatsAppFallbackUrl,
  openWhatsAppWithFallback,
  models,
  type Model,
  supportsInstallment,
} from "@/lib/models";
import { useReveal } from "@/hooks/use-reveal";
import { usePublicInstagramPosts, type InstagramPost } from "@/hooks/useInstagramPosts";


import { FinanciamentoForm } from "@/components/FinanciamentoForm";
import { BenefitsBar } from "@/components/BenefitsBar";
import { LazyVideo } from "@/components/LazyVideo";
import { ProductCarousel } from "@/components/ProductCarousel";
import type { Product } from "@/components/ProductCard";
import { modelInstallment } from "@/lib/installment";

import klugSymbol from "@/assets/klug/klug-symbol.png.asset.json";
import { CreatedBy } from "@/components/CreatedBy";
import klugLogo from "@/assets/klug/klug-horizontal-white.png.asset.json";
import oficinaEspecializada from "@/assets/klug/oficina-especializada.png.asset.json";
import x12Img from "@/assets/motos/x12.jpg.asset.json";
import { HeroVideo } from "@/components/HeroVideo";
import heroBoltVideo from "@/assets/videos/hero-bolt.webm.asset.json";
import klugHeroVideo from "@/assets/videos/klug-hero-telao.mp4.asset.json";
import klugHeroPoster from "@/assets/videos/klug-hero-poster.jpg.asset.json";
import conhecaKlugMotorsVideo from "@/assets/videos/conheca-klug-motors.mp4.asset.json";


const BASE_URL = "https://klugmotors.com.br";
const FINANCE_MSG =
  "Olá, Klug Motors! Quero simular um financiamento e conhecer as condições para as motos elétricas. Podem me ajudar?";

/** Perguntas frequentes locais exibidas na home (e usadas no FAQPage JSON-LD). */
const HOME_FAQS: { q: string; a: string }[] = [
  {
    q: "Onde fica a loja da Klug Motors em Joinville?",
    a: "Estamos na R. Albano Schmidt, 1882 — Boa Vista, Joinville/SC (CEP 89205-100). Atendemos de segunda a sexta das 8h30 às 18h30 e sábado das 8h30 às 13h.",
  },
  {
    q: "Preciso de CNH para andar de scooter elétrica?",
    a: "Depende do modelo. Os modelos equiparados a autopropelidos, com limite de velocidade e potência definidos pelo CONTRAN, dispensam CNH e licenciamento. Já as motos e scooters com placa exigem habilitação. Nossa equipe indica em loja qual modelo se encaixa no seu caso.",
  },
  {
    q: "A Klug Motors financia scooters e motos elétricas?",
    a: "Sim. Trabalhamos com financiamento e prévia de parcelas no boleto em até 71x para as scooters elétricas Moto Chefe, SUDU e triciclos. Você também pode pagar à vista no PIX, com desconto na hora, ou no cartão.",
  },
  {
    q: "Vocês têm oficina para scooter elétrica?",
    a: "Sim, temos oficina especializada em scooters elétricas em Joinville: baterias, motores, parte eletrônica e pneus, com peças e suporte da própria loja.",
  },
  {
    q: "Quais marcas e modelos vocês vendem?",
    a: "Scooters elétricas Moto Chefe (Klug) e SUDU, triciclos elétricos, motos Yamaha 0km e motos semi novas revisadas.",
  },
  {
    q: "A Klug Motors atende outras cidades da região?",
    a: "Sim. Além de Joinville, atendemos clientes de Araquari, São Francisco do Sul, Jaraguá do Sul, Guaramirim, Barra Velha e região norte de Santa Catarina.",
  },
];


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scooters e Motos Elétricas em Joinville | Klug Motors" },
      {
        name: "description",
        content:
          "Loja de scooters, motos e triciclos elétricos em Joinville/SC: Moto Chefe, SUDU, Yamaha 0km e semi novas. Oficina especializada e financiamento em até 71x no boleto.",
      },
      { name: "keywords", content: "scooter elétrica Joinville, moto elétrica Joinville, triciclo elétrico SC, scooter sem CNH, Yamaha Joinville, Klug Motors" },
      { name: "geo.region", content: "BR-SC" },
      { name: "geo.placename", content: "Joinville" },
      { name: "geo.position", content: "-26.2836;-48.8451" },
      { name: "ICBM", content: "-26.2836, -48.8451" },
      { property: "og:title", content: "Scooters e Motos Elétricas em Joinville | Klug Motors" },
      {
        property: "og:description",
        content:
          "Scooters, motos e triciclos elétricos em Joinville/SC. Loja física na R. Albano Schmidt, 1882 — Boa Vista, com oficina especializada e financiamento facilitado.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: "Klug Motors" },
      { property: "og:url", content: `${BASE_URL}/` },
      { property: "og:image", content: `${BASE_URL}${x12Img.url}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Scooters e Motos Elétricas em Joinville | Klug Motors" },
      { name: "twitter:description", content: "Mobilidade elétrica em Joinville/SC: Moto Chefe, SUDU, Yamaha 0km e semi novas." },
      { name: "twitter:image", content: `${BASE_URL}${x12Img.url}` },
    ],

    links: [
      { rel: "canonical", href: `${BASE_URL}/` },
      // LCP preload: pôster do vídeo do hero (renderiza antes do vídeo carregar).
      { rel: "preload", as: "image", href: klugHeroPoster.url, fetchpriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["AutomotiveBusiness", "LocalBusiness", "Store"],
          "@id": `${BASE_URL}/#loja-joinville`,
          name: "Klug Motors — Unidade Joinville",
          alternateName: "Klug Motor's",
          description:
            "Concessionária de motos, scooters e triciclos elétricos em Joinville/SC. Representante Yamaha, SUDU e MotoChefe.",
          url: BASE_URL,
          logo: `${BASE_URL}${x12Img.url}`,
          image: `${BASE_URL}${x12Img.url}`,
          telephone: "+5547934293200",
          email: "klugmotors@gmail.com",
          taxID: "51.728.597/0001-26",
          vatID: "51.728.597/0001-26",
          priceRange: "$$",
          currenciesAccepted: "BRL",
          paymentAccepted: "Cash, Credit Card, Debit Card, PIX, Financiamento",
          address: {
            "@type": "PostalAddress",
            streetAddress: "R. Albano Schmidt, 1882 - Boa Vista",
            addressLocality: "Joinville",
            addressRegion: "SC",
            postalCode: "89205-100",
            addressCountry: "BR",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: -26.2836,
            longitude: -48.8451,
          },
          hasMap: "https://www.google.com/maps?q=R.+Albano+Schmidt,+1882+-+Boa+Vista,+Joinville+-+SC,+89205-100",
          areaServed: [
            { "@type": "City", name: "Joinville" },
            { "@type": "AdministrativeArea", name: "Santa Catarina" },
            { "@type": "Country", name: "Brasil" },
          ],
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "08:30",
              closes: "18:30",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Saturday",
              opens: "08:30",
              closes: "13:00",
            },
          ],
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: "+5547934293200",
              contactType: "customer service",
              areaServed: "BR",
              availableLanguage: ["Portuguese"],
            },
          ],
          sameAs: [
            "https://www.instagram.com/klugmotors/",
          ],
          parentOrganization: { "@id": `${BASE_URL}/#organizacao` },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${BASE_URL}/#faq-home`,
          mainEntity: HOME_FAQS.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }),
      },
    ],

  }),
  component: Index,
});

/* ------------------------------ Brand mark ------------------------------ */

function KlugWordmark({ className = "" }: { className?: string }) {
  return (
    <img
      src={klugLogo.url}
      alt="Klug Motors"
      className={`h-8 sm:h-9 w-auto object-contain ${className}`}
    />
  );
}

/* ------------------------------ Header ------------------------------ */

const NAV_LINKS = [
  { hash: "modelos", label: "Modelos" },
  { hash: "sobre", label: "Sobre Nós" },
  { hash: "joinville", label: "Joinville" },
  { hash: "contato", label: "Contato" },
] as const;
const NAV_IDS = NAV_LINKS.map((l) => l.hash);

/** Track which section is currently in view for nav highlighting. */
function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        // Pick the visible entry closest to the top of the viewport.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/** Smooth scroll to a page anchor, honoring reduced-motion + updating the hash. */
function scrollToHash(hash: string, reduced: boolean) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(hash);
  if (!el) return;
  el.scrollIntoView({
    behavior: reduced ? "auto" : "smooth",
    block: "start",
  });
  history.replaceState(null, "", `#${hash}`);
  // Move focus for a11y without stealing scroll.
  const prevTabIndex = el.getAttribute("tabindex");
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  if (prevTabIndex === null) {
    setTimeout(() => el.removeAttribute("tabindex"), 500);
  }
}

/* --------------------------- Promo strip (topo) --------------------------- */

function PromoStrip() {
  return (
    <div className="w-full bg-primary text-primary-foreground text-[11px] sm:text-xs font-display font-black uppercase tracking-[0.18em]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-8 flex items-center justify-center gap-3">
        <Flame size={14} className="shrink-0" />
        <span className="truncate text-[10px] sm:text-[11px] font-bold">Klug Motors — Com vc em todas as direções 🧭</span>
        <Link
          to="/modelos"
          className="hidden sm:inline-flex items-center gap-1 border border-primary-foreground/60 px-2.5 py-0.5 rounded-full hover:bg-primary-foreground hover:text-primary transition-colors"
        >
          Saiba Mais <ChevronRight size={12} />
        </Link>
      </div>
    </div>
  );
}

/* --------------------------- Category nav (barra) --------------------------- */

const CATEGORY_LINKS = [
  { label: "Scooter Elétricas Moto Chefe", search: { marca: "klug" } },
  { label: "Scooter Elétricas Sudu", search: { marca: "sudu" } },
  { label: "Triciclos Elétricos", search: { cat: "triciclo" } },
  { label: "Motos Yamaha 0km", search: { marca: "yamaha" } },
  { label: "Motos Semi Novas", search: { cat: "seminovos" } },
] as const;



function CategoryNav() {
  return (
    <div className="hidden md:block w-full bg-card/60 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-12 flex items-center justify-between gap-6">
        <nav
          aria-label="Categorias"
          className="flex items-center gap-6 lg:gap-8 text-[12px] lg:text-[14px] font-display font-black uppercase tracking-[0.15em] text-white/90 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {CATEGORY_LINKS.map((c) => (
            <Link
              key={c.label}
              to="/modelos"
              search={c.search}
              className="whitespace-nowrap hover:text-primary transition-colors story-link"
            >
              {c.label}
            </Link>
          ))}
        </nav>


      </div>
    </div>
  );
}

function TrustItem({
  icon: Icon,
  label,
  href,
  external = false,
}: {
  icon: typeof MapPin;
  label: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex items-center gap-2 text-white/85 hover:text-primary transition-colors group"
    >
      <span className="grid place-items-center h-9 w-9 rounded-full border border-white/15 text-primary group-hover:border-primary group-hover:bg-primary/10 transition-colors">
        <Icon size={16} strokeWidth={2} />
      </span>
      <span className="text-[12px] font-display font-bold uppercase tracking-widest whitespace-nowrap">
        {label}
      </span>
    </a>
  );
}

/* ------------------------------ Header ------------------------------ */

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();
  const active = useActiveSection(NAV_IDS);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body scroll lock + ESC when the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleAnchor = (hash: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    scrollToHash(hash, reduced);
  };


  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors ${
        scrolled
          ? "bg-background/95 border-border"
          : "bg-background/70 border-border/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 md:h-20 flex items-center gap-3 sm:gap-6">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
            history.replaceState(null, "", " ");
          }}
          className="flex items-center gap-2 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Klug Motors — início"
        >
          <KlugWordmark />
        </a>

        {/* Search bar */}
        {/* Search bar (Desktop) */}
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement)?.value;
            window.location.href = `/modelos?q=${encodeURIComponent(q || "")}`;
          }}
          className="hidden md:flex flex-1 max-w-xl h-11 items-center rounded-full bg-card border border-border focus-within:border-primary/60 transition-colors overflow-hidden"
        >
          <input
            name="q"
            type="search"
            placeholder="O que deseja procurar?"
            className="flex-1 bg-transparent px-5 text-sm text-white placeholder:text-white/40 focus:outline-none"
            aria-label="Buscar modelos"
          />
          <button
            type="submit"
            aria-label="Buscar"
            className="grid place-items-center h-full aspect-square text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Search size={18} strokeWidth={2.4} />
          </button>
        </form>

        {/* Mobile Search Button */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="md:hidden p-2 min-h-11 min-w-11 grid place-items-center rounded-full border border-white/10 text-primary"
          aria-label="Abrir busca"
        >
          <Search size={20} />
        </button>

        {/* Trust items */}
        <div className="hidden lg:flex items-center gap-6 ml-auto text-white">
          <TrustItem icon={Headphones} label="Atendimento" href={buildWhatsAppFallbackUrl(FINANCE_MSG)} external />
          <TrustItem icon={MapPin} label="Localização" href="#joinville" />
          <TrustItem icon={User} label="Contato" href="#contato" />
        </div>

        {/* Financiamento pill (replaces the cart) */}
        <a
          href="#contato"
          onClick={handleAnchor("contato")}
          className="hidden md:inline-flex items-center gap-2 bg-primary hover:bg-primary-glow text-primary-foreground font-display font-extrabold text-[11px] px-5 py-2.5 rounded-full uppercase tracking-widest transition-all hover:scale-[1.03] hover:shadow-[var(--shadow-ember)] active:scale-95"
        >
          Simular Financiamento
          <ArrowRight size={14} />
        </a>

        {/* Mobile — compact CTA + burger */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href="#contato"
            onClick={handleAnchor("contato")}
            className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-display font-extrabold text-[10px] px-3.5 py-2.5 min-h-11 rounded-full uppercase tracking-widest active:scale-95 transition-transform"
          >
            Financiar
            <ArrowRight size={12} />
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative p-2 min-h-11 min-w-11 grid place-items-center rounded-full border border-white/10 hover:border-primary/50 transition-colors"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <span className="sr-only">Menu</span>
            <span className="relative w-5 h-4">
              <span
                className={`absolute left-0 right-0 h-[2px] bg-current rounded-full transition-all duration-300 ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-current rounded-full transition-all duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 right-0 h-[2px] bg-current rounded-full transition-all duration-300 ${
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        {/* Mobile Search Overlay */}
        {searchOpen && (
          <div className="absolute inset-x-0 top-full bg-background border-b border-border p-4 animate-in slide-in-from-top duration-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = (e.currentTarget.elements.namedItem("q-mobile") as HTMLInputElement)?.value;
                window.location.href = `/modelos?q=${encodeURIComponent(q || "")}`;
              }}
              className="flex h-12 items-center rounded-full bg-card border border-primary/40 overflow-hidden"
            >
              <input
                name="q-mobile"
                autoFocus
                type="search"
                placeholder="Buscar modelos..."
                className="flex-1 bg-transparent px-5 text-sm text-white focus:outline-none"
              />
              <button type="submit" className="px-5 text-primary">
                <Search size={20} />
              </button>
            </form>
          </div>
        )}

      </div>
      </div>

      {/* Mobile drawer + backdrop */}
      <div
        className={`md:hidden fixed inset-x-0 top-16 bottom-0 z-40 pointer-events-none ${
          open ? "" : ""
        }`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Fechar menu"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0"
          }`}
        />
        {/* Panel */}
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          className={`absolute inset-x-0 top-0 bg-background border-b border-border shadow-2xl transition-all duration-300 ease-out ${
            open
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4"
          }`}
        >
          <nav className="px-5 py-5 flex flex-col gap-1" aria-label="Principal">
            {NAV_LINKS.map((l, i) => {
              const isActive = active === l.hash;
              return (
                <a
                  key={l.hash}
                  href={`#${l.hash}`}
                  onClick={handleAnchor(l.hash)}
                  aria-current={isActive ? "location" : undefined}
                  style={{
                    transitionDelay: open ? `${80 + i * 40}ms` : "0ms",
                  }}
                  className={`py-3 px-2 rounded-lg font-display font-bold uppercase text-sm tracking-wider transition-all duration-300 border-l-2 ${
                    open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                  } ${
                    isActive
                      ? "text-primary border-primary bg-primary/5"
                      : "text-white/85 border-transparent hover:text-primary hover:border-primary/40"
                  }`}
                >
                  {l.label}
                </a>
              );
            })}
            <Link
              to="/modelos"
              onClick={() => setOpen(false)}
              style={{
                transitionDelay: open ? `${80 + NAV_LINKS.length * 40}ms` : "0ms",
              }}
              className={`py-3 px-2 rounded-lg font-display font-bold uppercase text-sm tracking-wider text-white/85 border-l-2 border-transparent hover:text-primary hover:border-primary/40 transition-all duration-300 ${
                open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              }`}
            >
              Catálogo
            </Link>
            <a
              href="#contato"
              onClick={handleAnchor("contato")}
              style={{
                transitionDelay: open ? `${140 + NAV_LINKS.length * 40}ms` : "0ms",
              }}
              className={`mt-4 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase text-xs tracking-widest px-5 py-4 min-h-[48px] rounded-full transition-all duration-300 active:scale-95 ${
                open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              Simular Financiamento
              <ArrowRight size={14} />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}


/* ------------------------------ Hero ------------------------------ */

function AnimatedCount({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          const start = performance.now();
          const duration = 900;
          const step = (t: number) => {
            const p = Math.min(1, (t - start) / duration);
            setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-black">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-8">
        <h1 className="mb-4 text-center font-display font-black uppercase text-white text-xl sm:text-3xl md:text-4xl tracking-tight leading-[1.05]">
          Scooters e Motos Elétricas em <span className="text-primary">Joinville</span>
        </h1>
        <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl bg-black aspect-[2/1]">
          <HeroVideo src={klugHeroVideo.url} poster={klugHeroPoster.url} />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-6 w-full mx-auto max-w-7xl">
          <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 group aspect-[4.4/1] bg-black w-full sm:w-1/2">
            <img
              src={oficinaEspecializada.url}
              alt="Oficina Especializada em Scooters Elétricas Klug Motors - Baterias, Motores, Eletrônica e Pneus"
              width={1983}
              height={450}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
          
          {/* Desktop Buttons Side by Side */}
          <div className="hidden sm:flex flex-col gap-3 shrink-0">
            <Link
              to="/modelos"
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-display font-black uppercase tracking-widest text-[11px] px-8 py-3 rounded-full transition-all text-center min-w-[200px]"
            >
              Ver Modelos
            </Link>
            <a
              href={buildWhatsAppFallbackUrl(FINANCE_MSG)}
              onClick={(e) => {
                e.preventDefault();
                openWhatsAppWithFallback(FINANCE_MSG);
              }}
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-display font-black uppercase tracking-widest text-[11px] px-8 py-3 rounded-full transition-all shadow-lg text-center min-w-[200px]"
            >
              Simular Financiamento
            </a>
          </div>
        </div>

        {/* Mobile Stacked Buttons */}
        <div className="mt-4 flex flex-col sm:hidden justify-center items-center gap-2 px-4">
          <Link
            to="/modelos"
            className="w-full inline-flex items-center justify-center bg-white/5 border border-white/10 text-white font-display font-black uppercase tracking-widest text-xs px-8 py-3.5 rounded-full transition-all active:scale-95 min-h-[44px]"
          >
            Ver Modelos
          </Link>
          <a
            href={buildWhatsAppFallbackUrl(FINANCE_MSG)}
            onClick={(e) => {
              e.preventDefault();
              openWhatsAppWithFallback(FINANCE_MSG);
            }}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-display font-black uppercase tracking-widest text-xs px-8 py-3.5 rounded-full transition-all active:scale-95 min-h-[44px] shadow-md"
          >
            <MessageCircle size={18} fill="white" strokeWidth={0} />
            Simular Financiamento
          </a>
        </div>

      </div>
    </section>


  );
}




/**
 * Lightning-bolt shaped video frame, MotoChefe-style.
 * Uses SVG clip-path so the animated hero video fills the bolt silhouette.
 */
function HeroBolt() {
  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] max-w-md mx-auto flex items-center justify-center">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="klug-bolt" clipPathUnits="objectBoundingBox">
            {/* stylised lightning bolt normalized 0..1 */}
            <path d="M0.58 0 L0.05 0.55 L0.42 0.55 L0.28 1 L0.95 0.4 L0.55 0.4 L0.78 0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Glow behind bolt */}
      <div
        aria-hidden="true"
        className="absolute inset-0 blur-3xl opacity-60"
        style={{
          background:
            "radial-gradient(50% 50% at 55% 50%, color-mix(in oklab, var(--primary) 55%, transparent), transparent 70%)",
        }}
      />

      {/* Bolt video */}
      <div
        className="relative w-full h-full"
        style={{ clipPath: "url(#klug-bolt)", WebkitClipPath: "url(#klug-bolt)" }}
      >
        <video
          src={heroBoltVideo.url}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Vídeo de destaque da scooter elétrica Klug Motors X12"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Klug institutional video (background layer, wider horizontal framing) */}
      <video
        src={klugHeroVideo.url}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] max-w-none aspect-[16/12] object-contain object-center opacity-80"
        style={{ objectPosition: "center 45%" }}
      />

    </div>
  );
}


/* ---------------------------- Perks strip ---------------------------- */

type Perk = {
  icon: typeof CreditCard;
  title: string;
  desc: string;
  count?: number; // enables count-up animation
  countPrefix?: string;
  countSuffix?: string;
  message: string; // WhatsApp pre-filled message
};

const PERKS: Perk[] = [
  {
    icon: CreditCard,
    title: "Financiamento",
    desc: "em até 36x (WhatsApp)",
    message:
      "Olá, Klug Motors! Quero simular o financiamento em até 36x. Podem me passar as condições?",
  },
  {
    icon: Wallet,
    title: "Pagamento facilitado",
    desc: "em até 21x no cartão",
    message:
      "Olá! Gostaria de saber sobre as opções de pagamento em até 21x no cartão.",
  },
  {
    icon: BadgePercent,
    title: "No PIX",
    desc: "ganhe desconto na hora",
    message:
      "Olá! Tenho interesse em aproveitar o desconto no PIX. Podem me atender?",
  },
  {
    icon: Store,
    title: "+ de",
    desc: "unidades vendidas",
    count: 5000,
    countPrefix: "+",
    message:
      "Olá! Vi que a Klug já vendeu mais de 5 mil unidades — quero conhecer os modelos.",
  },
  {
    icon: ShieldCheck,
    title: "Loja Oficial",
    desc: "Joinville / SC",
    message:
      "Olá! Vocês são a loja oficial em Joinville/SC? Quero passar aí para conhecer.",
  },
];

/** Respect prefers-reduced-motion. Returns true when the user asked for less motion. */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Fire once when the ref enters the viewport. */
function useInViewOnce<T extends Element>(rootMargin = "0px 0px -10% 0px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin, threshold: 0.15 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [inView, rootMargin]);
  return { ref, inView };
}

/** Subtle count-up. Snaps to final value if `reduced` is true. */
function useCountUp(target: number, active: boolean, reduced: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic for a soft settle
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, reduced, duration]);
  return value;
}

function PerkCountLabel({
  perk,
  active,
  reduced,
}: {
  perk: Perk;
  active: boolean;
  reduced: boolean;
}) {
  const value = useCountUp(perk.count ?? 0, active, reduced);
  const formatted = value.toLocaleString("pt-BR");
  return (
    <p
      className="font-display font-black uppercase text-[12px] tracking-wider leading-none tabular-nums"
      aria-label={`${perk.countPrefix ?? ""}${(perk.count ?? 0).toLocaleString("pt-BR")} ${perk.desc}`}
    >
      <span aria-hidden="true">
        {perk.title}{" "}
        <span className="text-primary">
          {perk.countPrefix}
          {formatted}
        </span>
      </span>
    </p>
  );
}

function PerksBar() {
  const reduced = useReducedMotion();
  const { ref, inView } = useInViewOnce<HTMLUListElement>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), reduced ? 0 : 350);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <section
      aria-label="Benefícios e condições"
      className="border-b border-border bg-card"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <ul
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          aria-busy={!loaded}
        >
          {PERKS.map((p, i) => {
            const borderClasses = [
              i > 0 ? "md:border-l" : "",
              i >= 2 ? "border-t md:border-t-0" : "",
              i === 1 ? "border-l md:border-l" : "",
              i === 3 ? "border-l md:border-l" : "",
            ]
              .filter(Boolean)
              .join(" ");

            if (!loaded) {
              return (
                <li
                  key={p.title}
                  aria-hidden="true"
                  className={`flex items-center gap-3 py-5 px-4 sm:px-5 border-border ${borderClasses}`}
                >
                  <span className="w-10 h-10 shrink-0 border border-border bg-background/40 animate-pulse" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <span className="block h-3 w-24 bg-background/40 animate-pulse" />
                    <span className="block h-2.5 w-32 bg-background/30 animate-pulse" />
                  </div>
                </li>
              );
            }

            const enterStyle =
              !reduced && inView
                ? {
                    animation: `fade-in 0.5s ease-out ${i * 80}ms both`,
                  }
                : undefined;

            return (
              <li
                key={p.title}
                style={enterStyle}
                className={`border-border ${borderClasses} ${
                  !reduced && !inView ? "opacity-0" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => openWhatsAppWithFallback(p.message)}
                  aria-label={`${p.title} ${p.desc} — falar no WhatsApp`}
                  className="group w-full h-full text-left flex items-center gap-3 py-5 px-4 sm:px-5 transition-colors motion-safe:transition-all motion-safe:duration-300 hover:bg-background focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset motion-safe:hover:-translate-y-0.5"
                >
                  <span className="w-10 h-10 shrink-0 border border-border grid place-items-center text-primary transition-colors motion-safe:transition-transform motion-safe:duration-300 group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground group-focus-visible:bg-primary group-focus-visible:border-primary group-focus-visible:text-primary-foreground motion-safe:group-hover:scale-110 motion-safe:group-focus-visible:scale-110">
                    <p.icon size={18} strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0">
                    {p.count ? (
                      <PerkCountLabel perk={p} active={inView} reduced={reduced} />
                    ) : (
                      <p className="font-display font-black uppercase text-[11px] sm:text-[12px] tracking-wider leading-none truncate pr-1">
                        {p.title}
                      </p>
                    )}
                    <p className="text-white/55 text-[11px] mt-1 leading-tight group-hover:text-white/80 group-focus-visible:text-white/80 transition-colors">
                      {p.desc}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------- Products grid ---------------------------- */

const CATEGORIES = ["Todos", "Motos", "Scooters", "Triciclos"] as const;
type Category = (typeof CATEGORIES)[number];

function matchCategory(m: Model, cat: Category) {
  if (cat === "Todos") return true;
  const t = m.tag.toLowerCase();
  if (cat === "Triciclos") return t.includes("triciclo");
  if (cat === "Scooters") return t.includes("scooter");
  if (cat === "Motos") return t.includes("moto elétrica") || t.startsWith("moto");
  return true;

}

/* ------------------------- Nossa Linha (featured) ------------------------- */

const FEATURED_SLUGS = ["p10", "pop", "x12", "jet"] as const;

function Featured() {
  const featured = FEATURED_SLUGS
    .map((s) => models.find((m) => m.slug === s))
    .filter((m): m is Model => Boolean(m));

  return (
    <section id="nossa-linha" className="py-24 sm:py-32 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-4">
              Destaques
            </p>
            <h2 className="font-display font-black uppercase text-3xl sm:text-4xl md:text-5xl tracking-tight sm:tracking-tighter leading-[1.05]">
              Nossa <span className="text-primary">Linha</span>
            </h2>
            <p className="text-white/60 mt-4 text-sm leading-relaxed max-w-md">
              Os quatro modelos mais procurados — do scooter urbano ao triciclo top de linha.
            </p>
          </div>
          <Link
            to="/modelos"
            className="inline-flex items-center gap-2 self-start md:self-auto text-[10px] font-display font-black uppercase tracking-widest text-primary hover:gap-3 transition-all"
          >
            Ver catálogo completo <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((m) => (
            <article key={m.slug} className="group bg-card border border-border hover-ember flex flex-col">
              <Link
                to="/modelos/$slug"
                params={{ slug: m.slug }}
                className="block relative aspect-[4/3] overflow-hidden bg-charcoal"
                aria-label={`Ver detalhes de ${m.name}`}
              >
                <img
                  src={m.colors[0]?.image}
                  alt={`${m.name} — ${m.tag}`}
                  loading="lazy"
                  className="w-full h-full object-contain p-5 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <span className="absolute top-3 left-3 bg-charcoal/80 backdrop-blur border border-border text-white text-[9px] font-display font-black uppercase tracking-wider px-2 py-1 inline-flex items-center gap-1">
                  <Zap size={10} className="text-primary" /> {m.power}
                </span>
              </Link>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-primary text-[10px] font-display font-black uppercase tracking-widest mb-1">
                  {m.tag}
                </p>
                <h3 className="font-display font-black uppercase text-lg tracking-tight">
                  {m.name}
                </h3>
                <p className="mt-2 text-xs text-white/55 line-clamp-2 flex-1">{m.short}</p>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="block text-[9px] text-white/40 uppercase font-bold tracking-wider">
                      A partir de
                    </span>
                    <span className="font-display font-black text-base">{m.price}</span>
                  </div>
                </div>
                <Link
                  to="/modelos/$slug"
                  params={{ slug: m.slug }}
                  className="mt-4 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-[10px] px-4 py-3 hover:opacity-90 transition-opacity"
                >
                  Ver detalhes <ChevronRight size={12} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}



function Products() {
  const [cat, setCat] = useState<Category>("Todos");
  const filtered = models.filter((m) => matchCategory(m, cat));

  return (
    <section id="modelos" className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <h2 className="font-display font-black uppercase text-3xl sm:text-4xl md:text-5xl tracking-tight sm:tracking-tighter leading-[1.05]">
              Catálogo <span className="text-primary">Completo</span>
            </h2>
            <p className="text-white/50 font-bold uppercase text-[11px] tracking-[0.25em] mt-4">
              {models.length} modelos disponíveis · Pronta entrega
            </p>
          </div>
          <div
            role="tablist"
            aria-label="Filtrar por categoria"
            className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-display font-black uppercase tracking-widest"
          >
            {CATEGORIES.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                onClick={() => setCat(c)}
                className={`pb-1 transition-colors ${
                  cat === c
                    ? "text-primary border-b-2 border-primary"
                    : "text-white/40 hover:text-white border-b-2 border-transparent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="Nenhum modelo nesta categoria"
            hint="Selecione outra categoria acima ou veja o catálogo completo."
            action={
              <button
                onClick={() => setCat("Todos")}
                className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-xs px-6 py-3"
              >
                Ver Todos <ArrowRight size={14} />
              </button>
            }
          />
        ) : (
          <RevealGrid className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <div
                key={p.slug}
                className="reveal card-shine rounded-2xl"
                style={{ transitionDelay: `${Math.min(i, 5) * 70}ms` }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </RevealGrid>
        )}

      </div>
    </section>
  );
}

function ProductCard({ product: p }: { product: Model }) {
  const img = p.colors[0]?.image ?? "";
  return (
    <article className="group bg-card hover:bg-black border border-border hover:border-black hover-ember transition-colors duration-300">
      <Link
        to="/modelos/$slug"
        params={{ slug: p.slug }}
        className="block relative aspect-[4/3] overflow-hidden bg-black"
        aria-label={`Ver detalhes de ${p.name}`}
      >
        <img
          src={img}
          alt={`${p.name} — ${p.tag}`}
          loading="lazy"
          decoding="async"
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="absolute inset-0 w-full h-full object-contain scale-125 sm:scale-[1.35] drop-shadow-[0_20px_35px_rgba(0,0,0,0.55)] group-hover:scale-[1.45] transition-transform duration-700"
        />
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
          <span className="bg-charcoal/80 backdrop-blur border border-border text-white text-[9px] font-display font-black uppercase tracking-wider px-2 py-1 inline-flex items-center gap-1">
            <Zap size={10} className="text-primary" /> {p.power}
          </span>
          <span className="bg-charcoal/80 backdrop-blur border border-border text-white text-[9px] font-display font-black uppercase tracking-wider px-2 py-1">
            {p.range}
          </span>
        </div>
      </Link>
      <div className="p-6 sm:p-7">
        <div className="flex justify-between items-start gap-4 mb-5">
          <div className="min-w-0">
            <h3 className="font-display font-black uppercase text-xl tracking-tight line-clamp-2 break-words">
              {p.name}
            </h3>
            <p className="text-primary text-[10px] font-display font-black uppercase tracking-widest mt-1">
              {p.tag}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="block text-[9px] text-white/40 uppercase font-bold tracking-wider">
              A partir de
            </span>
            <span className="font-display font-black text-lg">{p.price}</span>
          </div>
        </div>
        <Link
          to="/modelos/$slug"
          params={{ slug: p.slug }}
          className="w-full py-3 flex items-center justify-center gap-2 border border-border group-hover:bg-primary group-hover:border-primary text-white font-display font-black uppercase text-[11px] tracking-widest transition-all"
        >
          Ver Detalhes <ChevronRight size={14} />
        </Link>
      </div>
    </article>
  );
}

function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border border-dashed border-border p-16 text-center bg-card">
      <p className="font-display font-black uppercase tracking-wider text-lg mb-2">
        {title}
      </p>
      <p className="text-white/50 text-sm">{hint}</p>
      {action}
    </div>
  );
}

/* ---------------------------- Benefits strip ---------------------------- */

const benefits = [
  {
    icon: Zap,
    kicker: "01",
    title: "Zero Combustível",
    desc: "Recarregue em qualquer tomada. Custo por km até 10× menor que a gasolina.",
  },
  {
    icon: Wrench,
    kicker: "02",
    title: "Manutenção Mínima",
    desc: "Sem óleo, sem correia, sem velas. Mais tempo na estrada, menos na oficina.",
  },
  {
    icon: BadgeCheck,
    kicker: "03",
    title: "Sem CNH",
    desc: "A maioria dos modelos é autopropelida (CONTRAN 996/23) — não exige habilitação.",
  },
  {
    icon: Leaf,
    kicker: "04",
    title: "100% Silenciosa",
    desc: "Zero ruído, zero emissão. A mobilidade urbana que respeita a cidade.",
  },
];

function Benefits() {
  return (
    <section id="sobre" className="py-24 sm:py-32 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-4">
            Por que Klug Motors
          </p>
          <h2 className="font-display font-black uppercase text-3xl sm:text-4xl md:text-5xl tracking-tight sm:tracking-tighter leading-[1.05]">
            Mais liberdade.
            <br />
            Menos <span className="text-primary">custo</span>. Zero ruído.
          </h2>
        </div>
        <RevealGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className="reveal card-shine p-7 bg-card border border-border rounded-2xl group hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-11 h-11 rounded-xl border border-border grid place-items-center group-hover:bg-primary group-hover:border-primary group-hover:rotate-6 transition-all duration-300">
                  <b.icon
                    className="text-primary group-hover:text-primary-foreground transition-colors"
                    size={20}
                    strokeWidth={2.2}
                  />
                </div>
                <span className="font-display text-xs text-white/30 font-black tracking-widest">
                  {b.kicker}
                </span>
              </div>
              <h3 className="font-display font-black uppercase text-lg tracking-tight mb-3">
                {b.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </RevealGrid>


      </div>
    </section>
  );
}

/* ---------------------------- Contact ---------------------------- */

function Contact() {
  return (
    <section id="contato" className="py-24 sm:py-32 pb-32 sm:pb-40 lg:pb-32 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div className="min-w-0">

          <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-4">
            Visite a unidade
          </p>
          <h2 className="font-display font-black uppercase text-3xl sm:text-4xl md:text-5xl tracking-tight sm:tracking-tighter leading-[1.05] mb-6">
            Estamos em <span className="text-primary">Joinville</span>.
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-md">
            Venha conhecer os modelos, simular o financiamento e conversar com
            o time. Atendemos direto, sem fechar para o almoço.
          </p>

          {/* Cockpit panel */}
          <div id="joinville" className="border border-border bg-card rounded-2xl overflow-hidden divide-y divide-border scroll-mt-24">
            <ContactRow
              icon={MapPin}
              label="Endereço"
              value="R. Albano Schmidt, 1882 — Boa Vista, Joinville/SC · 89205-100"
              href="https://maps.google.com/?q=R.+Albano+Schmidt,+1882+-+Boa+Vista,+Joinville+-+SC,+89205-100"
            />
            <ContactRow
              icon={Phone}
              label="Central de vendas"
              value="(47) 3429-3200"
              href="tel:+5547934293200"
              highlight
            />
            <ContactRow
              icon={Clock}
              label="Horários"
              value="Seg a Sex 08:30–18:30 (sem fechar p/ almoço) · Sáb 08:30–13:00 · Dom fechado"
            />
            <ContactRow
              icon={Mail}
              label="E-mail"
              value="klugmotors@gmail.com"
              href="mailto:klugmotors@gmail.com"
            />
            <ContactRow
              icon={Instagram}
              label="Instagram"
              value="@klugmotors"
              href="https://www.instagram.com/klugmotors/"
              external
            />
          </div>

          {/* Google Maps embed */}
          <div className="mt-6 border border-border bg-card rounded-2xl overflow-hidden">
            <iframe
              title="Localização da Klug Motors em Joinville — R. Albano Schmidt, 1882"
              src="https://www.google.com/maps?q=R.+Albano+Schmidt,+1882+-+Boa+Vista,+Joinville+-+SC,+89205-100&output=embed"
              width="100%"
              height="320"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-t border-border bg-background/50">
              <p className="text-xs text-white/60 leading-relaxed">
                R. Albano Schmidt, 1882 — Boa Vista, Joinville/SC · 89205-100
              </p>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=R.+Albano+Schmidt,+1882+-+Boa+Vista,+Joinville+-+SC,+89205-100"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir rota até a Klug Motors no Google Maps"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-glow text-primary-foreground font-display font-black uppercase text-[11px] tracking-widest px-5 py-3 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-ember)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <MapPin size={14} strokeWidth={2.4} />
                Como chegar
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="min-w-0">

          <FinanciamentoForm />
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  external,
  highlight,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  highlight?: boolean;
}) {
  const content = (
    <>
      <div className="w-11 h-11 rounded-xl border border-border bg-background grid place-items-center shrink-0 group-hover:bg-primary group-hover:border-primary transition-colors">
        <Icon
          size={18}
          className="text-primary group-hover:text-primary-foreground transition-colors"
        />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] text-white/40 font-display font-black uppercase tracking-[0.25em] mb-1">
          {label}
        </p>
        <p
          className={`font-medium break-words ${
            highlight
              ? "text-primary font-display font-black text-xl tracking-tight"

              : "text-white/90"
          }`}
        >
          {value}
        </p>
      </div>
    </>
  );

  const cls =
    "group flex items-center gap-5 p-5 sm:p-6 transition-colors hover:bg-background";

  return href ? (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cls}
    >
      {content}
    </a>
  ) : (
    <div className={`${cls} cursor-default`}>{content}</div>
  );
}

/* ---------------------------- Footer ---------------------------- */

function Footer() {
  const iconProps = { size: 14, strokeWidth: 1.5 } as const;
  return (
    <footer className="bg-card border-t border-border pt-16 sm:pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 mb-12 sm:mb-14 [&>*]:min-w-0">
          {/* Brand */}
          <div className="lg:col-span-4 lg:pr-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-5" aria-label="Klug Motors">
              <KlugWordmark />
            </Link>

            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              A revolução da mobilidade elétrica em Joinville. Qualidade,
              tecnologia e o melhor pós-venda da região.
            </p>
            <div className="flex gap-2">
              <a
                href="https://www.instagram.com/klugmotors/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/15 grid place-items-center text-white/80 hover:bg-primary hover:border-primary hover:text-black transition-colors"
                aria-label="Instagram @klugmotors"
              >
                <Instagram size={15} strokeWidth={1.5} />
              </a>
              <a
                href={buildWhatsAppFallbackUrl(
                  "Olá! Tenho interesse em conhecer os modelos da Klug Motors.",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  openWhatsAppWithFallback(
                    "Olá! Tenho interesse em conhecer os modelos da Klug Motors.",
                  );
                }}
                className="w-10 h-10 rounded-full border border-white/15 grid place-items-center text-white/80 hover:bg-primary hover:border-primary hover:text-black transition-colors"
                aria-label="Falar no WhatsApp"
              >
                <MessageCircle size={15} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Visit */}
          <div className="lg:col-span-3 lg:pl-8 lg:border-l lg:border-white/10">
            <h4 className="flex items-center gap-2 font-display font-black uppercase text-[10px] tracking-[0.25em] text-primary mb-5">
              <span className="h-px w-6 bg-primary/60" aria-hidden="true" />
              Visite-nos
            </h4>
            <address className="not-italic text-white/70 text-sm leading-relaxed flex items-start gap-2">
              <MapPin {...iconProps} className="mt-1 shrink-0 text-white/40" />
              <span>
                R. Albano Schmidt, 1882 — Boa Vista
                <br />
                Joinville/SC · 89205-100
              </span>
            </address>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 lg:pl-8 lg:border-l lg:border-white/10">
            <h4 className="flex items-center gap-2 font-display font-black uppercase text-[10px] tracking-[0.25em] text-primary mb-5">
              <span className="h-px w-6 bg-primary/60" aria-hidden="true" />
              Contato
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Phone {...iconProps} className="shrink-0 text-white/40" />
                <a href="tel:+5547934293200" className="font-display font-black text-base text-white hover:text-primary transition-colors">
                  (47) 3429-3200
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail {...iconProps} className="shrink-0 text-white/40" />
                <a
                  href="mailto:klugmotors@gmail.com"
                  className="hover:text-primary story-link"
                >
                  klugmotors@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <Clock {...iconProps} className="mt-0.5 shrink-0 text-white/40" />
                <span className="text-xs leading-relaxed">
                  Seg a Sex: 08:30 às 18:30
                  <br />
                  Sábado: 08:30 às 13:00
                  <br />
                  Domingo: fechado
                </span>
              </li>
            </ul>
          </div>

          {/* Nav */}
          <div className="lg:col-span-2 lg:pl-8 lg:border-l lg:border-white/10">
            <h4 className="flex items-center gap-2 font-display font-black uppercase text-[10px] tracking-[0.25em] text-primary mb-5">
              <span className="h-px w-6 bg-primary/60" aria-hidden="true" />
              Navegação
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link to="/modelos" className="story-link hover:text-primary">Catálogo</Link></li>
              <li><Link to="/modelos/yamaha" className="story-link hover:text-primary">Yamaha</Link></li>
              <li><Link to="/modelos/sudu" className="story-link hover:text-primary">SUDU</Link></li>
              <li><Link to="/comparar" className="story-link hover:text-primary">Comparar</Link></li>
              <li><Link to="/financiamento" className="story-link hover:text-primary">Financiamento</Link></li>
              <li><Link to="/garantia" className="story-link hover:text-primary">Garantia</Link></li>
              <li><Link to="/sobre" className="story-link hover:text-primary">Sobre</Link></li>
              <li><Link to="/faq" className="story-link hover:text-primary">FAQ</Link></li>
              <li><Link to="/contato" className="story-link hover:text-primary">Contato</Link></li>
              <li><Link to="/privacidade" className="story-link hover:text-primary">Privacidade</Link></li>
              <li><Link to="/admin" className="story-link text-white/50 hover:text-primary">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] text-center md:text-left">
            © {new Date().getFullYear()} Klug Motors · CNPJ 51.728.597/0001-26 · R. Albano Schmidt, 1882 — Boa Vista, Joinville/SC · 89205-100
          </p>
          <div className="flex items-center gap-3">
            <CreatedBy />
            <img
              src={klugSymbol.url}
              alt=""
              aria-hidden="true"
              className="w-6 h-6 object-contain opacity-60"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------- WhatsApp CTA banner ---------------------------- */

function WhatsAppCTA() {
  return (
    <section aria-label="Simular financiamento via WhatsApp" className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
        <div className="relative overflow-hidden border border-border bg-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="absolute inset-0 pointer-events-none ember-spotlight opacity-60" />
          <div className="relative">
            <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-2">
              Consulta rápida
            </p>
            <h2 className="font-display font-black uppercase text-2xl sm:text-3xl tracking-tighter leading-none">
              Simule seu <span className="text-primary">financiamento</span>
            </h2>
            <p className="text-white/60 text-sm mt-3 max-w-md">
              Fale no WhatsApp e receba as condições para a moto que você quer — entrada, parcelas e prazos.
            </p>
          </div>
          <a
            href={buildWhatsAppFallbackUrl(FINANCE_MSG)}
            onClick={(e) => {
              e.preventDefault();
              openWhatsAppWithFallback(FINANCE_MSG);
            }}
            aria-label="Simular financiamento no WhatsApp"
            className="relative inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-display font-black uppercase tracking-widest text-sm px-8 py-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(37,211,102,0.6)] shrink-0"
          >
            <MessageCircle size={18} fill="white" strokeWidth={0} />
            Simular Financiamento
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- WhatsApp FAB ---------------------------- */

function WhatsAppFab() {
  const message =
    "Olá! Tenho interesse em conhecer os modelos da Klug Motors.";
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let ticking = false;
    const check = () => {
      ticking = false;
      const el = document.getElementById("contato");
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Hide when the contact section overlaps the bottom-right FAB area
      const inView = r.top < vh - 40 && r.bottom > vh - 220;
      setHidden(inView);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <a
      href={buildWhatsAppFallbackUrl(message)}
      onClick={(event) => {
        event.preventDefault();
        openWhatsAppWithFallback(message);
      }}
      aria-label="Falar no WhatsApp"
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      className={`fixed bottom-6 right-4 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-[var(--shadow-elegant)] hover:scale-110 transition-all duration-300 animate-float ${
        hidden ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100"
      }`}
    >
      <MessageCircle size={22} className="sm:hidden" fill="white" strokeWidth={0} />
      <MessageCircle size={26} className="hidden sm:block" fill="white" strokeWidth={0} />
    </a>
  );
}



/* ---------------------------- Scroll to top ---------------------------- */

// ScrollTopFab removido — BackToTop global vive em src/components/BackToTop.tsx

function Index() {



  return (
    <div className="min-h-dvh bg-background text-foreground">
      <PromoStrip />
      <Header />
      <CategoryNav />
      <main>
        <Hero />
        <BenefitsBar />
        <DestaquesGrid />
        <MaisVendidosGrid />
        <YoutubeShowcase />
        <InstagramRow />
        <HomeFaq />

        {/* Blocos de suporte (financiamento + contato) mantidos como no Moto Chefe: rodapé estendido */}
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

/* ------------------------- FAQ local (home) ------------------------- */

function HomeFaq() {
  return (
    <section id="perguntas-frequentes" className="border-t border-border bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h2 className="text-center font-display font-black uppercase text-2xl sm:text-3xl tracking-tight leading-none">
          Perguntas frequentes — Klug Motors Joinville
        </h2>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Dúvidas sobre CNH, financiamento, oficina e atendimento na região de Joinville/SC.
        </p>
        <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card/40">
          {HOME_FAQS.map(({ q, a }) => (
            <details key={q} className="group p-5 sm:p-6">
              <summary className="cursor-pointer list-none font-display font-black uppercase text-sm sm:text-base tracking-wide flex items-start justify-between gap-4">
                <span>{q}</span>
                <span aria-hidden="true" className="text-primary transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ---------------------------- Reveal helper ---------------------------- */

function RevealGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}


/* ============================================================
 * Reference-style home sections (Klug identity)
 * ============================================================ */

/* --------- Product grid card in the Moto Chefe reference style --------- */

function fmtBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function RefProductCard({ m }: { m: Model }) {
  const inst = modelInstallment(m);
  const parcela = supportsInstallment(m) ? inst.label : null;
  const parcelaNote = inst.note;
  return (
    <Link
      to="/modelos/$slug"
      params={{ slug: m.slug }}
      className="group flex flex-col h-full bg-black border border-border rounded-lg overflow-hidden hover:border-primary/60 transition-all hover:-translate-y-1"
    >
      <div className="relative aspect-square bg-white overflow-hidden">
        <img
          src={m.colors[0]?.image}
          alt={m.name}
          loading="lazy"
          decoding="async"
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[9px] font-display font-black uppercase tracking-widest px-2 py-1 rounded-sm">
          <Zap size={10} className="inline -mt-0.5" /> {m.power}
        </span>
      </div>
      <div className="p-4 text-center flex-1 flex flex-col min-w-0">
        <h3 className="font-display font-black uppercase text-xs sm:text-sm tracking-tight text-white/90 break-words min-h-[2.4em]">
          {m.name}
        </h3>

        <div className="flex items-center justify-center gap-0.5 text-primary mt-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-[10px]">★</span>
          ))}
        </div>
        <p
          className="text-primary leading-none mt-3"
          style={{
            fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
            fontSize: "26px",
          }}
        >
          {parcela ?? "Sob consulta"}
        </p>
        <p className="text-[9px] text-white/50 uppercase font-bold tracking-widest mt-1">
          {parcela ? parcelaNote : "Fale com um consultor"}
        </p>
        {parcela && (
          <p className="text-[10px] text-white/40 mt-0.5">
            à vista <span className="text-white/70">{m.price}</span>
          </p>
        )}

        <span className="mt-auto pt-3 inline-flex items-center justify-center w-full gap-1 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-[10px] min-h-11 py-2.5 rounded-md group-hover:brightness-110">
          Ver produto
        </span>
      </div>
    </Link>
  );
}

function DestaquesGrid() {
  const items = models.slice(0, 4);
  return (
    <section className="py-10 sm:py-12 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <h2 className="text-center font-display font-black uppercase text-2xl sm:text-3xl tracking-widest mb-10">
          Destaques <span className="text-primary">Klug</span>
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((m) => (
            <RefProductCard key={m.slug} m={m} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MaisVendidosGrid() {
  const items = models.slice(4, 12);
  if (items.length === 0) return null;
  return (
    <section className="py-10 sm:py-12 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <h2 className="text-center font-display font-black uppercase text-2xl sm:text-3xl tracking-widest mb-10">
          Mais <span className="text-primary">Vendidos</span>
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((m) => (
            <RefProductCard key={m.slug} m={m} />
          ))}
        </div>
      </div>
    </section>
  );
}

function YoutubeShowcase() {
  const highlight = models[1] ?? models[0];
  const highlightInst = modelInstallment(highlight);
  const parcela = supportsInstallment(highlight) ? highlightInst.label : null;
  const parcelaNote = highlightInst.note;
  return (
    <section className="py-10 sm:py-12 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        <div className="rounded-lg overflow-hidden border border-border bg-card">
          <div className="flex items-center gap-3 p-4 bg-black border-b border-border">
            <span className="grid place-items-center w-10 h-10 rounded-full bg-primary text-primary-foreground">
              <Zap size={20} strokeWidth={2.5} />
            </span>
            <div>
              <p className="font-display font-black uppercase text-white text-sm tracking-widest">
                Klug Motors | Joinville
              </p>
              <p className="text-white/50 text-[11px]">
                Referência nacional em mobilidade elétrica
              </p>
            </div>
          </div>
          <div className="relative aspect-video bg-black">
            <LazyVideo
              src={conhecaKlugMotorsVideo.url}
              loop
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        <aside className="bg-black border border-border rounded-lg overflow-hidden">
          <div className="aspect-square bg-white">
            <img
              src={highlight.colors[0]?.image}
              alt={highlight.name}
              className="w-full h-full object-contain p-4"
              loading="lazy"
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-display font-black uppercase text-sm text-white tracking-tight">
              {highlight.name} | Klug
            </h3>
            <p
              className="text-primary mt-2 leading-none"
              style={{
                fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                fontSize: "28px",
              }}
            >
              {parcela ?? highlight.price}
            </p>
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">
              {parcela ? parcelaNote : "consulte condições"}
            </p>
            {parcela && (
              <p className="text-[10px] text-white/40 mt-0.5">
                à vista <span className="text-white/70">{highlight.price}</span>
              </p>
            )}

            <Link
              to="/modelos/$slug"
              params={{ slug: highlight.slug }}
              className="mt-3 inline-flex items-center justify-center w-full gap-1 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-[10px] min-h-11 py-2.5 rounded-md hover:brightness-110"
            >
              Ver produto
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}

function InstagramRow() {
  const { data: posts, isLoading } = usePublicInstagramPosts();
  const tiles = (posts ?? []).slice(0, 6);
  const hasTiles = tiles.length > 0;

  return (
    <section className="py-10 sm:py-12 bg-background border-b border-border">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <h2 className="text-center font-display font-black uppercase text-white text-lg sm:text-xl tracking-widest mb-8">
          Siga nosso Instagram{" "}
          <a
            href="https://www.instagram.com/klugmotors/"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            @klugmotors
          </a>
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`sk-${i}`}
                className="aspect-square bg-neutral-900 rounded-md border border-border animate-pulse"
              />
            ))}
          </div>
        ) : hasTiles ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
            {tiles.map((p: InstagramPost) => (
              <InstagramMediaTile key={p.id} post={p} />
            ))}
          </div>

        ) : (
          <div className="max-w-2xl mx-auto text-center border border-border rounded-2xl p-8 sm:p-10 bg-card/60">
            <Instagram size={32} className="mx-auto text-primary" />
            <p className="mt-4 text-white/80 text-sm sm:text-base">
              Acompanhe novidades, lançamentos e bastidores da Klug Motors direto no nosso perfil.
            </p>
            <a
              href="https://www.instagram.com/klugmotors/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-xs px-6 py-3 rounded-md hover:brightness-110"
            >
              <Instagram size={16} /> Seguir @klugmotors
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function extractInstagramShortcode(url: string): string | null {
  const m = url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/i);
  return m?.[1] ?? null;
}

function InstagramMediaTile({ post }: { post: InstagramPost }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isVideo = post.media_type === "video";
  const mediaUrl = post.image_url?.trim() ?? "";
  const postLinkForHref = post.post_url?.trim() || mediaUrl;
  const shortcode =
    extractInstagramShortcode(postLinkForHref) || extractInstagramShortcode(mediaUrl);
  const href = postLinkForHref || (shortcode ? `https://www.instagram.com/p/${shortcode}/` : "https://www.instagram.com/klugmotors/");
  const embedUrl = shortcode ? `https://www.instagram.com/p/${shortcode}/embed/captioned/` : null;
  // Capa oficial do post no IG (funciona também para vídeos/reels — retorna o
  // primeiro frame). Usada quando o admin não subiu thumbnail manualmente.
  const igCoverUrl = shortcode ? `https://www.instagram.com/p/${shortcode}/media/?size=l` : null;
  const hasDirectMedia = isDirectInstagramMediaUrl(mediaUrl, post.media_type);
  const posterUrl = post.thumbnail_url?.trim() || igCoverUrl || undefined;

  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [coverErrored, setCoverErrored] = useState(false);

  // Priority: direct media file > IG cover image > IG embed iframe > text fallback
  const showDirect = hasDirectMedia && !errored;
  const showCover = !showDirect && !!shortcode && !!posterUrl && !coverErrored;
  const showEmbed = !showDirect && !showCover && !!embedUrl && !errored;

  // Reels/vídeos usam 4:5 (padrão IG portrait); imagens ficam quadradas.
  const aspectClass = isVideo ? "aspect-[4/5]" : "aspect-square";

  // IG embed exige ~326px de largura mínima para renderizar corretamente.
  // Fixamos a iframe em pixels e escalamos via container-query para preencher
  // qualquer tamanho de tile mantendo a proporção do conteúdo.
  const IFRAME_W = 340;
  // Altura aproximada do conteúdo (mídia + header). Rodapé com legenda é cortado
  // pelo overflow-hidden do container.
  const IFRAME_H = isVideo ? Math.round(IFRAME_W * 1.25) + 96 : IFRAME_W + 96;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`group relative ${aspectClass} overflow-hidden rounded-md border border-border bg-neutral-900 block [container-type:inline-size]`}
      onMouseEnter={() => {
        const v = videoRef.current;
        if (v) v.play().catch(() => {});
      }}
      onMouseLeave={() => {
        const v = videoRef.current;
        if (v) {
          v.pause();
          try { v.currentTime = 0; } catch { /* ignore */ }
        }
      }}
      aria-label={post.caption || "Post do Instagram"}
    >
      {showDirect && isVideo ? (
        <video
          ref={videoRef}
          src={mediaUrl}
          poster={posterUrl}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          muted
          playsInline
          loop
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      ) : showDirect ? (
        <img
          src={mediaUrl}
          alt={post.caption || "Post do Instagram"}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      ) : showCover ? (
        <img
          src={posterUrl!}
          alt={post.caption || "Post do Instagram"}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onLoad={() => setLoaded(true)}
          onError={() => setCoverErrored(true)}
        />
      ) : showEmbed ? (
        <>
          <iframe
            src={embedUrl!}
            title={post.caption || "Post do Instagram"}
            loading="lazy"
            scrolling="no"
            allow="encrypted-media; picture-in-picture; web-share"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute top-0 left-0 border-0 pointer-events-none origin-top-left"
            style={{
              width: `${IFRAME_W}px`,
              height: `${IFRAME_H}px`,
              transform: `scale(calc(100cqw / ${IFRAME_W}))`,
            }}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
          />
          {/* Click-catcher sobre o iframe */}
          <span aria-hidden className="absolute inset-0" />
        </>
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-neutral-950 p-5 text-center transition-transform duration-500 group-hover:scale-105">
          <div>
            <Instagram className="mx-auto mb-3 text-primary" size={28} />
            <p className="font-display text-xs uppercase tracking-widest text-white">
              Ver post no Instagram
            </p>
            {post.caption && (
              <p className="mt-2 text-[11px] leading-snug text-white/60 line-clamp-2">
                {post.caption}
              </p>
            )}
          </div>
        </div>
      )}
      {(showDirect || showCover || showEmbed) && !loaded && (
        <div
          aria-hidden
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800"
        >
          <div className="absolute inset-0 grid place-items-center">
            <Instagram className="text-white/20" size={28} />
          </div>
        </div>
      )}
      {isVideo && (showDirect || showCover) && (
        <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] uppercase tracking-widest bg-black/70 text-white px-1.5 py-0.5 rounded">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
          Vídeo
        </span>
      )}
      {post.caption && (
        <div className="absolute inset-x-0 bottom-0 p-2 text-[11px] text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
          {post.caption}
        </div>
      )}
    </a>
  );
}

function isDirectInstagramMediaUrl(url: string, mediaType: InstagramPost["media_type"]) {
  if (!url) return false;
  if (/instagram\.com\/(p|reel|tv)\//i.test(url)) return false;
  if (/^\/api\/public\/model-images\//i.test(url)) return true;
  if (/^blob:|^data:/i.test(url)) return true;
  if (mediaType === "video") return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url);
  return /\.(png|jpe?g|gif|webp|avif)(\?|#|$)/i.test(url);
}



