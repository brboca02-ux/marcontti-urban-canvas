import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock, Instagram, MessageCircle } from "lucide-react";
import { PageLayout, SectionCard } from "@/components/PageLayout";
import { FinanciamentoForm } from "@/components/FinanciamentoForm";
import { ContatoForm } from "@/components/ContatoForm";
import { StoreLocator } from "@/components/StoreLocator";
import { buildWhatsAppFallbackUrl, openWhatsAppWithFallback } from "@/lib/models";

const BASE_URL = "https://klugmotors.com.br";
const FINANCE_MSG =
  "Olá, Klug Motors! Quero simular um financiamento e conhecer as condições. Podem me ajudar?";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Klug Motors Joinville/SC | WhatsApp e Loja Física" },
      { name: "description", content: "Fale com a Klug Motors em Joinville/SC: WhatsApp, telefone (47) 93429-3200, e-mail e loja física na R. Albano Schmidt, 1882 — Boa Vista. Seg–Sex 08:30–18:30, Sáb 08:30–13:00." },
      { name: "keywords", content: "Klug Motors contato, moto elétrica Joinville contato, WhatsApp Klug, loja Albano Schmidt Joinville, concessionária Boa Vista Joinville" },
      { name: "geo.region", content: "BR-SC" },
      { name: "geo.placename", content: "Joinville" },
      { name: "geo.position", content: "-26.2836;-48.8451" },
      { name: "ICBM", content: "-26.2836, -48.8451" },
      { property: "og:title", content: "Contato — Klug Motors Joinville/SC" },
      { property: "og:description", content: "WhatsApp, telefone e loja física em Joinville/SC. Fale direto com a nossa equipe." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: "Klug Motors" },
      { property: "og:url", content: `${BASE_URL}/contato` },
      { property: "og:image", content: `${BASE_URL}/__l5e/assets-v1/b524e71f-5038-4ce3-8ef9-5dc8e174f6ba/og-contato.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Contato — Klug Motors Joinville" },
      { name: "twitter:description", content: "WhatsApp, telefone e loja física em Joinville/SC." },
      { name: "twitter:image", content: `${BASE_URL}/__l5e/assets-v1/b524e71f-5038-4ce3-8ef9-5dc8e174f6ba/og-contato.jpg` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/contato` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["AutomotiveBusiness", "LocalBusiness", "Store"],
          "@id": `${BASE_URL}/contato#loja-joinville`,
          name: "Klug Motors — Unidade Joinville",
          url: `${BASE_URL}/contato`,
          logo: `${BASE_URL}/favicon.ico`,
          image: `${BASE_URL}/favicon.ico`,
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
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:30", closes: "18:30" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:30", closes: "13:00" },
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
          sameAs: ["https://www.instagram.com/klugmotors/"],
        }),
      },
    ],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  return (
    <PageLayout
      eyebrow="Fale conosco"
      title="Estamos em"
      titleAccent="Joinville"
      intro="Prefere falar direto? WhatsApp, telefone, e-mail ou pessoalmente na loja. Respondemos rápido."
      maxWidth="max-w-6xl"
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <SectionCard title="Canais diretos">
            <div className="not-prose grid gap-3">
              <a
                href={buildWhatsAppFallbackUrl(FINANCE_MSG)}
                onClick={(e) => { e.preventDefault(); openWhatsAppWithFallback(FINANCE_MSG); }}
                className="flex items-center justify-between gap-3 p-4 border border-border rounded-xl bg-background/50 hover:border-primary transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-[#25D366]/10 text-[#25D366] grid place-items-center"><MessageCircle size={18} /></span>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-display font-black mb-0.5">WhatsApp</p>
                    <p className="text-sm font-display font-black text-white">Fale agora</p>
                  </div>
                </div>
                <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-xs uppercase tracking-widest">Abrir →</span>
              </a>
              <a href="tel:+5547934293200" className="flex items-center gap-3 p-4 border border-border rounded-xl bg-background/50 hover:border-primary transition-colors">
                <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><Phone size={18} /></span>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-display font-black mb-0.5">Telefone</p>
                  <p className="text-sm font-display font-black text-white">(47) 93429-3200</p>
                </div>
              </a>
              <a href="mailto:klugmotors@gmail.com" className="flex items-center gap-3 p-4 border border-border rounded-xl bg-background/50 hover:border-primary transition-colors">
                <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><Mail size={18} /></span>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-display font-black mb-0.5">E-mail</p>
                  <p className="text-sm text-white">klugmotors@gmail.com</p>
                </div>
              </a>
              <a href="https://www.instagram.com/klugmotors/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 border border-border rounded-xl bg-background/50 hover:border-primary transition-colors">
                <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><Instagram size={18} /></span>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-display font-black mb-0.5">Instagram</p>
                  <p className="text-sm text-white">@klugmotors</p>
                </div>
              </a>
            </div>
          </SectionCard>

          <SectionCard title="Loja física">
            <div className="not-prose space-y-3 text-sm">
              <p className="inline-flex items-start gap-2"><MapPin size={16} className="text-primary mt-0.5 shrink-0" /> <span>R. Albano Schmidt, 1882 — Boa Vista, Joinville/SC · 89205-100</span></p>
              <p className="inline-flex items-start gap-2"><Clock size={16} className="text-primary mt-0.5 shrink-0" /> <span>Seg a Sex: 08:30 às 18:30 (sem fechar para almoço)<br />Sábado: 08:30 às 13:00<br />Domingo: fechado</span></p>
            </div>
            <div className="not-prose mt-5 border border-border rounded-xl overflow-hidden">
              <StoreLocator />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-t border-border bg-background/50">
                <p className="text-xs text-white/60">R. Albano Schmidt, 1882 — Boa Vista, Joinville/SC · 89205-100</p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=R.+Albano+Schmidt,+1882+-+Boa+Vista,+Joinville+-+SC,+89205-100"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase text-[11px] tracking-widest px-4 py-2.5 rounded-full transition-all hover:-translate-y-0.5"
                >
                  <MapPin size={14} /> Como chegar
                </a>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-8">
          <ContatoForm />
          <FinanciamentoForm />
        </div>
      </div>
    </PageLayout>
  );
}
