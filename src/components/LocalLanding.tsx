import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Wrench, ShieldCheck, CreditCard, MessageCircle } from "lucide-react";
import { PageLayout, SectionCard } from "@/components/PageLayout";
import { LazyImage } from "@/components/LazyImage";
import { usePublicModelsLight } from "@/hooks/useDbModels";
import { modelInstallment } from "@/lib/installment";
import {
  type Model,
  supportsInstallment,
  buildWhatsAppFallbackUrl,
  openWhatsAppWithFallback,
} from "@/lib/models";

export type Faq = { q: string; a: string };

export const REGIAO =
  "Joinville, Araquari, São Francisco do Sul, Jaraguá do Sul, Guaramirim e região";

/** Bairros de Joinville citados nas páginas locais. */
export const BAIRROS =
  "Boa Vista, Centro, Aventureiro, Costa e Silva, Iririú, Guanabara, Vila Nova e demais bairros";

const REASONS = [
  {
    icon: MapPin,
    title: "Loja física no Jardim Iririú",
    desc: "Rua das Cegonhas, 699 — Jardim Iririú, Joinville/SC. Você vê, sobe e testa o veículo antes de comprar.",
  },
  {
    icon: Wrench,
    title: "Oficina especializada",
    desc: "Manutenção, revisão, bateria de lítio, motor e pneu de veículo elétrico feita na própria loja.",
  },
  {
    icon: ShieldCheck,
    title: "Garantia e pós-venda",
    desc: "Garantia oficial do fabricante, peças de reposição em estoque e suporte direto com a nossa equipe.",
  },
  {
    icon: CreditCard,
    title: "Financiamento em até 71x",
    desc: "Prévia de parcela no boleto, consórcio e desconto no PIX. Simulação sem compromisso.",
  },
];

export function LocalLanding({
  eyebrow,
  title,
  titleAccent,
  intro,
  filter,
  emptyLabel = "Estamos atualizando o estoque desta linha.",
  catalogTo = "/modelos",
  catalogSearch,
  catalogLabel = "Ver catálogo completo",
  whatsappMessage,
  faq,
  children,
}: {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  intro: string;
  filter: (m: Model) => boolean;
  emptyLabel?: string;
  catalogTo?: string;
  catalogSearch?: { cat?: string; marca?: string };
  catalogLabel?: string;
  whatsappMessage: string;
  faq: Faq[];
  children?: React.ReactNode;
}) {
  const { items, isLoading } = usePublicModelsLight();
  const list = items.filter(filter);

  return (
    <PageLayout
      eyebrow={eyebrow}
      title={title}
      titleAccent={titleAccent}
      intro={intro}
      maxWidth="max-w-6xl"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() =>
            openWhatsAppWithFallback(whatsappMessage, {
              source: "landing_local",
              event: "interest_click",
            })
          }
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-[11px] font-display font-black uppercase tracking-widest text-primary-foreground hover:brightness-110"
        >
          <MessageCircle size={15} /> Falar no WhatsApp
        </button>
        <a
          href="https://www.google.com/maps/dir/?api=1&destination=Rua+das+Cegonhas,+699+-+Jardim+Iririu,+Joinville+-+SC,+89227-645&destination_place_id=ChIJnXaWyi6x3pQRtRqlFs8vhlw"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[11px] font-display font-black uppercase tracking-widest text-white hover:border-primary hover:text-primary"
        >
          <MapPin size={15} /> Como chegar
        </a>
      </div>

      {children}

      <SectionCard title="Modelos disponíveis">
        {isLoading && list.length === 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 not-prose">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-background/50 aspect-[4/3] animate-pulse" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <p className="text-white/60">
            {emptyLabel} Fale com a gente no WhatsApp para saber o que temos em estoque hoje.
          </p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 not-prose">
            {list.map((m, i) => {
              const parcela = supportsInstallment(m) ? modelInstallment(m) : null;
              return (
                <li key={m.slug}>
                  <Link
                    to="/modelos/$slug"
                    params={{ slug: m.slug }}
                    className="group block rounded-2xl border border-border bg-black overflow-hidden hover:border-primary/60 transition-colors h-full"
                  >
                    <LazyImage
                      src={m.colors[0]?.image || m.gallery?.[0] || ""}
                      alt={`${m.name} — MT Mobilidade Joinville`}
                      aspectRatio="4 / 3"
                      priority={i < 3}
                      className="w-full h-full object-contain object-center bg-white"
                    />
                    <div className="p-4">
                      <p className="font-display font-black uppercase text-base tracking-wide text-white leading-tight">
                        {m.name}
                      </p>
                      <p className="text-[11px] uppercase tracking-widest text-white/45 mt-1">{m.tag}</p>
                      <p className="mt-3 text-sm text-white/80">
                        {m.priceNumber > 0 ? (
                          <>
                            <span className="text-[10px] uppercase tracking-widest text-white/45 block">
                              A partir de
                            </span>
                            {m.price}
                          </>
                        ) : (
                          "Consultar disponibilidade"
                        )}
                      </p>
                      {parcela?.label && (
                        <p className="text-[11px] text-primary font-bold mt-1">
                          {parcela.label}{" "}
                          <span className="text-white/40 font-normal normal-case">financiamento</span>
                        </p>
                      )}
                      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-display font-black uppercase tracking-widest text-white/60 group-hover:text-primary">
                        Ver ficha <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <Link
          to={catalogTo}
          search={catalogSearch}
          className="mt-6 inline-flex items-center gap-2 text-[11px] font-display font-black uppercase tracking-widest text-primary hover:underline"
        >
          {catalogLabel} <ArrowRight size={14} />
        </Link>
      </SectionCard>

      <SectionCard title="Por que comprar na MT Mobilidade">
        <ul className="grid sm:grid-cols-2 gap-4 not-prose">
          {REASONS.map(({ icon: Icon, title: t, desc }) => (
            <li key={t} className="flex gap-4 items-start border border-border rounded-xl p-4 bg-background/50">
              <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
                <Icon size={18} />
              </span>
              <div>
                <p className="font-display font-black uppercase text-sm tracking-wider text-white mb-1">{t}</p>
                <p className="text-white/60 text-[13px] leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-[13px] text-white/60 pt-4">
          Atendemos {REGIAO}. Em Joinville, recebemos clientes do {BAIRROS}.
        </p>
      </SectionCard>

      <SectionCard title="Perguntas frequentes">
        <dl className="space-y-5">
          {faq.map((f) => (
            <div key={f.q}>
              <dt className="font-display font-black uppercase text-sm tracking-wider text-white mb-1">{f.q}</dt>
              <dd className="text-white/70 text-[15px] leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </SectionCard>

      <div className="flex flex-wrap gap-4 text-[11px] font-display font-black uppercase tracking-widest text-white/60">
        <Link to="/financiamento" className="hover:text-primary">Simular financiamento</Link>
        <Link to="/sobre" className="hover:text-primary">Oficina especializada</Link>
        <Link to="/contato" className="hover:text-primary">Contato e localização</Link>
        <a
          href={buildWhatsAppFallbackUrl(whatsappMessage)}
          onClick={(e) => {
            e.preventDefault();
            openWhatsAppWithFallback(whatsappMessage);
          }}
          className="hover:text-primary"
        >
          WhatsApp
        </a>
      </div>
    </PageLayout>
  );
}

/** JSON-LD de FAQ + trilha de navegação para as páginas locais. */
export function localLandingScripts({
  path,
  name,
  faq,
  baseUrl = "https://marcontti-urban-canvas.lovable.app",
}: {
  path: string;
  name: string;
  faq: Faq[];
  baseUrl?: string;
}) {
  return [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: baseUrl + "/" },
          { "@type": "ListItem", position: 2, name, item: baseUrl + path },
        ],
      }),
    },
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }),
    },
  ];
}
