import { createFileRoute } from "@tanstack/react-router";
import { LocalLanding, localLandingScripts, type Faq } from "@/components/LocalLanding";
import { SectionCard } from "@/components/PageLayout";
import { isTricicloModel, isSemiNovaModel } from "@/lib/models";

const BASE_URL = "https://marcontti-urban-canvas.lovable.app";
const PATH = "/triciclos-eletricos-joinville";

const FAQ: Faq[] = [
  {
    q: "Triciclo elétrico precisa de CNH?",
    a: "Os triciclos autopropelidos (até 32 km/h e 1.000W, Resolução CONTRAN 996/23) não exigem CNH, placa nem licenciamento. Indicamos essa informação na ficha de cada modelo.",
  },
  {
    q: "O triciclo elétrico é indicado para a melhor idade?",
    a: "Sim. As três rodas dão estabilidade na parada e na saída, e o câmbio é automático — não há embreagem nem marcha. É a escolha mais comum de quem quer segurança extra.",
  },
  {
    q: "Quanto peso o triciclo de carga aguarda?",
    a: "Varia por modelo. Os utilitários com baú ou caçamba suportam carga de trabalho para entregas e feira; conferimos o limite exato do modelo escolhido no manual antes da compra.",
  },
  {
    q: "Tem manutenção de triciclo elétrico em Joinville?",
    a: "Tem. Fazemos revisão, conserto e troca de bateria de triciclo elétrico na nossa oficina, na Rua das Cegonhas, 699 (Jardim Iririú).",
  },
];

export const Route = createFileRoute("/triciclos-eletricos-joinville")({
  head: () => ({
    meta: [
      { title: "Triciclos Elétricos em Joinville (Carga e Conforto) | Klug" },
      {
        name: "description",
        content:
          "Triciclos elétricos em Joinville/SC na MT Mobilidade: modelos utilitários de carga e opções para a melhor idade, sem CNH, com oficina especializada e parcelamento.",
      },
      { property: "og:title", content: "Triciclos Elétricos em Joinville | MT Mobilidade" },
      {
        property: "og:description",
        content:
          "Triciclos elétricos de carga e para a melhor idade em Joinville/SC, com loja física no Jardim Iririú.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: BASE_URL + PATH },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: BASE_URL + PATH }],
    scripts: localLandingScripts({ path: PATH, name: "Triciclos elétricos em Joinville", faq: FAQ }),
  }),
  component: Page,
});

function Page() {
  return (
    <LocalLanding
      eyebrow="Triciclos elétricos · Joinville/SC"
      title="Triciclos Elétricos Utilitários e para"
      titleAccent="Melhor Idade em Joinville"
      intro="Triciclos elétricos para trabalho e para quem busca estabilidade sobre três rodas, na MT Mobilidade — Rua das Cegonhas, 699, Jardim Iririú, Joinville/SC. Modelos sem exigência de CNH e oficina especializada na loja."
      filter={(m) => isTricicloModel(m) && !isSemiNovaModel(m)}
      catalogSearch={{ cat: "triciclo" }}
      catalogLabel="Ver todos os triciclos no catálogo"
      whatsappMessage="Olá, MT Mobilidade! Quero informações sobre triciclos elétricos em Joinville."
      faq={FAQ}
    >
      <SectionCard title="Carga, conforto e estabilidade">
        <p>
          O triciclo elétrico resolve dois usos muito procurados em Joinville: transporte de carga
          leve para pequenos negócios e mobilidade segura para quem não se sente confiante em duas
          rodas. Sem marcha, sem embreagem e com partida suave.
        </p>
        <p>
          Os modelos utilitários levam baú ou caçamba para entregas dentro do bairro; os modelos de
          conforto trazem banco largo, encosto e ré. Todos com bateria de lítio ou chumbo conforme a
          versão, e manutenção feita na nossa oficina.
        </p>
      </SectionCard>
    </LocalLanding>
  );
}
