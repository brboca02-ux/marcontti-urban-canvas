import { Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Phone, Mail, Clock, Instagram, MessageCircle } from "lucide-react";
import klugLogo from "@/assets/klug/klug-horizontal-white.png.asset.json";
import klugSymbol from "@/assets/klug/klug-symbol.png.asset.json";
import { buildWhatsAppFallbackUrl, openWhatsAppWithFallback } from "@/lib/models";
import { CreatedBy } from "@/components/CreatedBy";

export function PageLayout({
  eyebrow,
  title,
  titleAccent,
  intro,
  children,
  maxWidth = "max-w-4xl",
}: {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  intro?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  const FINANCE_MSG =
    "Olá, Klug Motors! Quero simular um financiamento e conhecer as condições. Podem me ajudar?";

  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0 min-w-0" aria-label="Klug Motors — início">
            <img src={klugLogo.url} alt="Klug Motors" className="h-7 sm:h-8 w-auto object-contain" />
          </Link>
          <nav className="hidden lg:flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-display font-black uppercase tracking-widest text-white/70">
            <Link to="/modelos" className="hover:text-primary whitespace-nowrap">Modelos</Link>
            <Link to="/modelos" search={{ marca: "yamaha" }} className="hover:text-primary whitespace-nowrap">Yamaha</Link>
            <Link to="/modelos" search={{ marca: "sudu" }} className="hover:text-primary whitespace-nowrap">SUDU</Link>
            <Link to="/comparar" className="hover:text-primary whitespace-nowrap">Comparar</Link>
            <Link to="/financiamento" className="hover:text-primary whitespace-nowrap">Financiamento</Link>
            <Link to="/garantia" className="hover:text-primary whitespace-nowrap">Garantia</Link>
            <Link to="/sobre" className="hover:text-primary whitespace-nowrap">Sobre</Link>
            <Link to="/faq" className="hover:text-primary whitespace-nowrap">FAQ</Link>
            <Link to="/contato" className="hover:text-primary whitespace-nowrap">Contato</Link>
          </nav>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() =>
                openWhatsAppWithFallback(
                  "Olá, Klug Motors! Quero agendar um Test-Ride. Podem me passar as opções?",
                  { source: "header_test_ride", event: "test_ride_click" },
                )
              }
              className="hidden sm:inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[11px] font-display font-black uppercase tracking-widest text-primary-foreground hover:brightness-110"
            >
              Agendar Test-Ride
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[11px] font-display font-black uppercase tracking-widest text-white/70 hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
          </div>
        </div>
      </header>


      <main className={`mx-auto w-full ${maxWidth} px-5 sm:px-8 py-14 sm:py-20 flex-1`}>
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-display font-black mb-4">
          {eyebrow}
        </p>
        <h1 className="font-display font-black uppercase text-3xl sm:text-4xl md:text-5xl tracking-tight sm:tracking-tighter leading-[1.05]">
          {title} {titleAccent && <span className="text-primary">{titleAccent}</span>}
        </h1>
        {intro && (
          <p className="mt-5 text-lg text-white/70 max-w-2xl leading-relaxed">{intro}</p>
        )}
        <div className="mt-12 space-y-8">{children}</div>
      </main>

      <footer className="bg-card border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid gap-8 md:grid-cols-3 text-sm text-white/70">
          <div>
            <img src={klugLogo.url} alt="Klug Motors" className="h-8 w-auto object-contain mb-3" />
            <p className="text-xs leading-relaxed max-w-xs">
              Motos, scooters e triciclos elétricos em Joinville/SC.
            </p>
          </div>
          <div className="space-y-2 text-xs">
            <p className="inline-flex items-center gap-2"><MapPin size={13} className="text-white/40" /> R. Albano Schmidt, 1882 — Boa Vista, Joinville/SC · 89205-100</p>
            <p className="inline-flex items-center gap-2"><Phone size={13} className="text-white/40" /> <a href="tel:+554734293200" className="hover:text-primary">(47) 3429-3200</a></p>
            <p className="inline-flex items-center gap-2"><Mail size={13} className="text-white/40" /> <a href="mailto:klugmotors@gmail.com" className="hover:text-primary">klugmotors@gmail.com</a></p>
            <p className="inline-flex items-center gap-2"><Clock size={13} className="text-white/40" /> Seg a Sex 08:30–18:30 · Sáb 08:30–13:00 · Dom fechado</p>
          </div>
          <div className="flex flex-col gap-3 items-start md:items-end">
            <div className="flex gap-2">
              <a
                href="https://www.instagram.com/klugmotors/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @klugmotors"
                className="w-9 h-9 rounded-full border border-white/15 grid place-items-center text-white/80 hover:bg-primary hover:border-primary hover:text-black transition-colors"
              >
                <Instagram size={14} />
              </a>
              <a
                href={buildWhatsAppFallbackUrl(FINANCE_MSG)}
                onClick={(e) => { e.preventDefault(); openWhatsAppWithFallback(FINANCE_MSG); }}
                aria-label="Falar no WhatsApp"
                className="w-9 h-9 rounded-full border border-white/15 grid place-items-center text-white/80 hover:bg-primary hover:border-primary hover:text-black transition-colors"
              >
                <MessageCircle size={14} />
              </a>
            </div>
            <div className="flex flex-col gap-1 items-start md:items-end">
              <Link to="/privacidade" className="text-[11px] uppercase tracking-widest hover:text-primary">
                Política de Privacidade
              </Link>
              <Link to="/admin" className="text-[11px] uppercase tracking-widest text-white/50 hover:text-primary">
                Painel Admin
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] text-center sm:text-left">
              © {new Date().getFullYear()} Klug Motors · CNPJ 51.728.597/0001-26
            </p>
            <div className="flex items-center gap-3">
              <CreatedBy />
              <img src={klugSymbol.url} alt="" aria-hidden="true" className="w-5 h-5 object-contain opacity-60" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function SectionCard({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`border border-border bg-card rounded-2xl p-6 sm:p-8 ${className}`}>
      {title && (
        <h2 className="font-display font-black uppercase text-xl sm:text-2xl tracking-tight mb-4">
          {title}
        </h2>
      )}
      <div className="text-white/80 leading-relaxed space-y-4 text-[15px]">{children}</div>
    </section>
  );
}
