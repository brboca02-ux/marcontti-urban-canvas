import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";

const BASE_URL = "https://klugmotors.com.br";

const FAQS = [
  {
    q: "Preciso de CNH para conduzir uma moto elétrica da Klug?",
    a: "Depende do modelo. Motos e scooters de até 1000W são classificadas pelo CONTRAN 996/23 como equipamentos autopropelidos — não exigem CNH nem emplacamento. Modelos acima de 1000W são motocicletas e precisam de CNH categoria A.",
  },
  {
    q: "Qual é a autonomia real das motos?",
    a: "Varia por modelo (de 40 a 100 km por carga). A autonomia depende de peso do condutor, terreno, velocidade média e condições de tráfego. Os valores divulgados são medições em condições ideais.",
  },
  {
    q: "Onde e como carrego a bateria?",
    a: "Na tomada comum de casa (110V ou 220V — os carregadores são bivolt). A maioria dos modelos tem bateria removível, então você pode levar para dentro de casa ou apartamento e carregar sem precisar do veículo por perto. Recarga completa leva de 4 a 8 horas.",
  },
  {
    q: "Quanto custa carregar por mês?",
    a: "Em torno de R$ 15 a R$ 40 na conta de luz para uso urbano diário (varia com a tarifa da sua região). Muito mais barato que gasolina — a economia é um dos principais motivos para a mudança.",
  },
  {
    q: "As motos são homologadas pelo Denatran?",
    a: "Modelos acima de 1000W (motocicletas elétricas) são homologados pelo Denatran e emplacáveis. Modelos de até 1000W (autopropelidos) não precisam de emplacamento nem homologação individual, seguindo o CONTRAN 996/23.",
  },
  {
    q: "Qual é a garantia?",
    a: "12 meses para bateria, motor e controlador. 3 a 6 meses para componentes elétricos. Peças de desgaste (pneus, freios, lâmpadas) não são cobertas. Detalhes completos na página de Garantia.",
  },
  {
    q: "Vocês fazem entrega para outras cidades?",
    a: "Sim. Entregamos em Joinville e região com frota própria e para todo o Brasil via transportadoras parceiras. O frete é cotado por CEP — fale conosco no WhatsApp com sua cidade para receber o valor.",
  },
  {
    q: "Posso fazer test-drive antes de comprar?",
    a: "No momento não oferecemos test-drive. Recomendamos visitar a loja em Joinville para ver o modelo pessoalmente, sentar, conhecer os detalhes e tirar todas as suas dúvidas com nossa equipe.",
  },
  {
    q: "Aceita cartão de crédito? Parcela em quantas vezes?",
    a: "Sim. Aceitamos cartão de crédito em até 12x — condição varia por bandeira. Também trabalhamos com financiamento CDC via bancos parceiros para prazos maiores. Consulte a página de Financiamento.",
  },
  {
    q: "A moto pode pegar chuva?",
    a: "Sim, os modelos têm proteção IP54 — resistem a chuva moderada e respingos. Evite atravessar poças fundas ou deixar o veículo submerso. Para chuva forte prolongada, o ideal é abrigar.",
  },
  {
    q: "Preciso de seguro?",
    a: "Não é obrigatório para modelos autopropelidos (até 1000W). Para motocicletas emplacáveis, o seguro DPVAT é pago junto ao licenciamento anual. Seguro contra roubo/colisão é opcional e altamente recomendado.",
  },
  {
    q: "Quanto tempo dura a bateria de lítio?",
    a: "As baterias de lítio suportam entre 600 e 1.000 ciclos de carga completa antes de perder capacidade significativa (~20%). Com uso diário moderado, isso equivale a 3 a 5 anos. É possível trocar a bateria depois — vendemos peças de reposição.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Perguntas Frequentes sobre Motos Elétricas | Klug Motors" },
      { name: "description", content: "Dúvidas sobre motos elétricas: CNH, autonomia, garantia, carregamento, homologação, financiamento e mais. Tire suas dúvidas com a Klug Motors." },
      { property: "og:title", content: "FAQ — Klug Motors" },
      { property: "og:description", content: "Perguntas frequentes sobre motos e scooters elétricas: CNH, autonomia, garantia, financiamento." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE_URL}/faq` },
      { property: "og:image", content: `${BASE_URL}/__l5e/assets-v1/21bd2611-0299-49a1-97ac-8ef4e7ef597e/og-faq.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${BASE_URL}/__l5e/assets-v1/21bd2611-0299-49a1-97ac-8ef4e7ef597e/og-faq.jpg` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/faq` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PageLayout
      eyebrow="Suporte"
      title="Perguntas"
      titleAccent="frequentes"
      intro="Reunimos as dúvidas mais comuns sobre motos elétricas. Não encontrou a sua? Fale conosco no WhatsApp."
    >
      <div className="space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="border border-border bg-card rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left hover:bg-background/50 transition-colors"
              >
                <span className="font-display font-black text-white text-base sm:text-lg tracking-tight pr-4">
                  {f.q}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-primary shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                id={`faq-${i}`}
                hidden={!isOpen}
                className="px-5 sm:px-6 pb-5 sm:pb-6 text-white/70 leading-relaxed text-[15px]"
              >
                {f.a}
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
