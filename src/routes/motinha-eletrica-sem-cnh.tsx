import { createFileRoute } from "@tanstack/react-router";
import { LocalLanding, localLandingScripts, type Faq } from "@/components/LocalLanding";
import { SectionCard } from "@/components/PageLayout";
import { isSemiNovaModel } from "@/lib/models";

const BASE_URL = "https://marcontti-urban-canvas.lovable.app";
const PATH = "/motinha-eletrica-sem-cnh";

const FAQ: Faq[] = [
  {
    q: "Qual motinha elétrica não precisa de CNH?",
    a: "Os veículos classificados como autopropelidos pela Resolução CONTRAN 996/23 — até 32 km/h de velocidade máxima e 1.000W de potência — não exigem CNH, placa, licenciamento nem seguro obrigatório.",
  },
  {
    q: "Qual a idade mínima para andar de motinha elétrica?",
    a: "A recomendação é 18 anos, por se tratar de condução em via pública compartilhada. Menores devem circular acompanhados e sob responsabilidade dos pais.",
  },
  {
    q: "Preciso usar capacete?",
    a: "O uso de capacete é altamente recomendado por segurança, mesmo nos modelos que não exigem habilitação.",
  },
  {
    q: "A motinha elétrica pode andar na rua?",
    a: "Sim. Os autopropelidos circulam nas vias urbanas respeitando o limite de velocidade do modelo e as regras de trânsito locais.",
  },
  {
    q: "Onde comprar motinha elétrica sem CNH em Joinville?",
    a: "Na MT Mobilidade, Rua das Cegonhas, 699 — Jardim Iririú, Joinville/SC. Você pode ver e testar os modelos na loja antes de decidir.",
  },
];

export const Route = createFileRoute("/motinha-eletrica-sem-cnh")({
  head: () => ({
    meta: [
      { title: "Motinha Elétrica sem CNH em Joinville | Modelos e Preços" },
      {
        name: "description",
        content:
          "Motinhas elétricas que não precisam de CNH em Joinville/SC: modelos autopropelidos (CONTRAN 996/23), preços, autonomia e parcelas. Loja física no Jardim Iririú.",
      },
      { property: "og:title", content: "Motinha Elétrica sem CNH em Joinville | MT Mobilidade" },
      {
        property: "og:description",
        content:
          "Modelos sem exigência de CNH, placa ou licenciamento, com preços e autonomia. MT Mobilidade, Joinville/SC.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: BASE_URL + PATH },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: BASE_URL + PATH }],
    scripts: localLandingScripts({
      path: PATH,
      name: "Motinha elétrica sem CNH em Joinville",
      faq: FAQ,
    }),
  }),
  component: Page,
});

function Page() {
  return (
    <LocalLanding
      eyebrow="Sem CNH · Joinville/SC"
      title="Motinhas Elétricas que Não Precisam de"
      titleAccent="CNH em Joinville"
      intro="Na MT Mobilidade você encontra motinhas e scooters elétricas classificadas como autopropelidas: sem CNH, sem placa e sem licenciamento, conforme a Resolução CONTRAN 996/23. Loja física na Rua das Cegonhas, 699 — Jardim Iririú, Joinville/SC."
      filter={(m) => !isSemiNovaModel(m) && /sem\s*cnh/i.test(m.tag)}
      emptyLabel="Estamos atualizando os modelos sem CNH."
      catalogSearch={{ cat: "scooter" }}
      catalogLabel="Ver catálogo de elétricos"
      whatsappMessage="Olá, MT Mobilidade! Quero saber quais modelos não precisam de CNH e os preços."
      faq={FAQ}
    >
      <SectionCard title="O que a lei permite em 2026">
        <p>
          A Resolução CONTRAN 996/23 define o equipamento autopropelido: velocidade máxima de 32 km/h
          e potência de até 1.000W. Quem se enquadra nessa regra circula sem habilitação, sem placa e
          sem licenciamento — e é exatamente o caso de boa parte dos nossos modelos.
        </p>
        <p>
          Na ficha de cada veículo mostramos o campo “Habilitação”, para você saber antes de comprar
          se aquele modelo exige CNH. Se tiver dúvida, chame no WhatsApp: explicamos a diferença entre
          um autopropelido e uma moto elétrica registrada.
        </p>
      </SectionCard>
    </LocalLanding>
  );
}
