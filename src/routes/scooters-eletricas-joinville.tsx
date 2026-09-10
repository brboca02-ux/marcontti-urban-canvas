import { createFileRoute } from "@tanstack/react-router";
import { LocalLanding, localLandingScripts, type Faq } from "@/components/LocalLanding";
import { SectionCard } from "@/components/PageLayout";
import { isSemiNovaModel, isTricicloModel } from "@/lib/models";

const BASE_URL = "https://klugmotors.com.br";
const PATH = "/scooters-eletricas-joinville";

const FAQ: Faq[] = [
  {
    q: "Quantos km faz uma scooter elétrica por carga?",
    a: "Depende do modelo e do peso do condutor. Nossas scooters de lítio fazem em média 45 a 90 km por carga, e a bateria pode ser retirada para carregar em qualquer tomada comum.",
  },
  {
    q: "Precisa de CNH para andar de scooter elétrica?",
    a: "Os modelos autopropelidos (até 32 km/h e 1.000W, conforme a Resolução CONTRAN 996/23) não exigem CNH, placa ou licenciamento. Na ficha de cada modelo indicamos essa informação.",
  },
  {
    q: "Qual a melhor scooter elétrica para o dia a dia em Joinville?",
    a: "Para trajetos curtos no Centro e nos bairros, os modelos compactos de 800W a 1.000W dão conta. Para subidas e uso com garupa, indicamos os modelos de maior potência. Podemos comparar as opções com você na loja.",
  },
  {
    q: "Dá para parcelar a scooter elétrica no boleto?",
    a: "Sim. Trabalhamos com prévia de parcela em até 71x no boleto, consórcio e desconto no PIX. Você pode simular direto na página de financiamento.",
  },
  {
    q: "Onde fica a loja de scooters elétricas em Joinville?",
    a: "Na R. Albano Schmidt, 1882 — bairro Boa Vista, Joinville/SC. Atendemos de segunda a sexta das 8h30 às 18h30 e sábado das 8h30 às 13h.",
  },
];

export const Route = createFileRoute("/scooters-eletricas-joinville")({
  head: () => ({
    meta: [
      { title: "Scooter Elétrica em Joinville | Concessionária MT Mobilidade" },
      {
        name: "description",
        content:
          "Scooters elétricas em Joinville/SC na MT Mobilidade: modelos SUDU e Moto Chefe, muitos sem CNH, com oficina especializada e parcelas em até 71x. Loja no Boa Vista.",
      },
      { property: "og:title", content: "Scooter Elétrica em Joinville | MT Mobilidade" },
      {
        property: "og:description",
        content:
          "Modelos SUDU e Moto Chefe em Joinville/SC, com loja física no Boa Vista, oficina própria e financiamento.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: BASE_URL + PATH },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: BASE_URL + PATH }],
    scripts: localLandingScripts({ path: PATH, name: "Scooters elétricas em Joinville", faq: FAQ }),
  }),
  component: Page,
});

function Page() {
  return (
    <LocalLanding
      eyebrow="Scooters elétricas · Joinville/SC"
      title="Scooters Elétricas em Joinville:"
      titleAccent="Modelos SUDU e MotoChefe"
      intro="A MT Mobilidade é concessionária de scooters elétricas em Joinville, com loja física na R. Albano Schmidt, 1882 (Boa Vista) e oficina especializada na própria loja. Vendemos as linhas SUDU e Moto Chefe, com modelos que não exigem CNH."
      filter={(m) =>
        !isSemiNovaModel(m) &&
        !isTricicloModel(m) &&
        !m.slug.startsWith("yamaha") &&
        /scooter/i.test(m.tag)
      }
      catalogSearch={{ marca: "sudu" }}
      catalogLabel="Ver todas as scooters no catálogo"
      whatsappMessage="Olá, MT Mobilidade! Quero informações sobre scooters elétricas em Joinville."
      faq={FAQ}
    >
      <SectionCard title="Scooter elétrica em Joinville: economia real no dia a dia">
        <p>
          Uma scooter elétrica gasta poucos centavos de energia por quilômetro, não precisa de troca
          de óleo e tem manutenção muito mais simples que uma moto a gasolina. Para quem roda dentro
          de Joinville — Boa Vista, Centro, Aventureiro, Costa e Silva, Iririú — é a forma mais barata
          de se locomover todos os dias.
        </p>
        <p>
          Na loja você encontra scooters de 800W, 1.000W e modelos de maior potência, com bateria de
          lítio removível, freio a disco, alarme e chave presencial, além de opções de dois lugares.
          Todos passam por revisão antes da entrega e contam com garantia do fabricante.
        </p>
      </SectionCard>
    </LocalLanding>
  );
}
