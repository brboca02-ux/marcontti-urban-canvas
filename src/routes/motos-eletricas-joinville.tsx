import { createFileRoute } from "@tanstack/react-router";
import { LocalLanding, localLandingScripts, type Faq } from "@/components/LocalLanding";
import { SectionCard } from "@/components/PageLayout";
import { isSemiNovaModel } from "@/lib/models";

const BASE_URL = "https://klugmotors.com.br";
const PATH = "/motos-eletricas-joinville";

const FAQ: Faq[] = [
  {
    q: "Quanto custa recarregar uma moto elétrica por mês?",
    a: "A recarga completa de uma bateria de lítio consome poucos kWh e custa cerca de R$ 2 a R$ 4 na tomada comum. Rodando todos os dias na cidade, o gasto mensal de energia fica muito abaixo do que se gasta com gasolina.",
  },
  {
    q: "Moto elétrica precisa de CNH e placa?",
    a: "Os modelos autopropelidos (até 32 km/h e 1.000W, Resolução CONTRAN 996/23) não exigem CNH nem placa. Modelos mais potentes seguem as regras normais de habilitação — explicamos cada caso na ficha do veículo.",
  },
  {
    q: "Qual a manutenção de uma moto elétrica?",
    a: "Não há troca de óleo nem embreagem. A manutenção se resume a pneus, freios, suspensão e cuidado com a bateria — tudo feito na nossa oficina em Joinville.",
  },
  {
    q: "A moto elétrica pode pegar chuva?",
    a: "Sim, dentro do padrão de proteção indicado no manual (IP54 na maioria dos modelos). Não é recomendado atravessar alagamentos nem lavar com jato de alta pressão.",
  },
  {
    q: "Tem assistência técnica de moto elétrica em Joinville?",
    a: "Tem. A MT Mobilidade mantém oficina especializada em veículos elétricos na R. Albano Schmidt, 1882 (Boa Vista), com peças de reposição em estoque.",
  },
];

export const Route = createFileRoute("/motos-eletricas-joinville")({
  head: () => ({
    meta: [
      { title: "Motos Elétricas em Joinville | Venda e Assistência Klug" },
      {
        name: "description",
        content:
          "Motos elétricas em Joinville/SC na MT Mobilidade: venda, oficina especializada e peças. Modelos econômicos, alta performance e financiamento em até 71x no boleto.",
      },
      { property: "og:title", content: "Motos Elétricas em Joinville | MT Mobilidade" },
      {
        property: "og:description",
        content:
          "Venda e assistência de motos elétricas em Joinville/SC, com loja física no Boa Vista e oficina própria.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: BASE_URL + PATH },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: BASE_URL + PATH }],
    scripts: localLandingScripts({ path: PATH, name: "Motos elétricas em Joinville", faq: FAQ }),
  }),
  component: Page,
});

function Page() {
  return (
    <LocalLanding
      eyebrow="Motos elétricas · Joinville/SC"
      title="Motos Elétricas em Joinville:"
      titleAccent="Economia e Alta Performance"
      intro="Venda e assistência de motos elétricas em Joinville, na R. Albano Schmidt, 1882 (Boa Vista). Modelos de 1.000W a 3.000W, bateria de lítio removível e oficina especializada na própria loja."
      filter={(m) => !isSemiNovaModel(m) && !m.slug.startsWith("yamaha") && /moto|chopper/i.test(m.tag)}
      catalogSearch={{ marca: "klug" }}
      catalogLabel="Ver todos os elétricos no catálogo"
      whatsappMessage="Olá, MT Mobilidade! Quero informações sobre motos elétricas em Joinville."
      faq={FAQ}
    >
      <SectionCard title="Por que trocar a gasolina pela moto elétrica">
        <p>
          A moto elétrica entrega torque imediato, roda em silêncio e custa poucos centavos por
          quilômetro. Sem óleo, sem embreagem e sem fila no posto: você carrega a bateria em uma
          tomada comum, em casa ou no trabalho.
        </p>
        <p>
          Trabalhamos com modelos de estilo urbano, retrô e esportivo, além das versões chopper de
          maior potência, com freio a disco, suspensão dupla e alarme. Quem roda em Joinville e região
          — Araquari, São Francisco do Sul, Jaraguá do Sul — encontra na loja opções para trajeto
          diário e para uso de trabalho.
        </p>
      </SectionCard>
    </LocalLanding>
  );
}
