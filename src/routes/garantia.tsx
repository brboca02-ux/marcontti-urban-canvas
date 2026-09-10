import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Battery, Wrench, AlertTriangle } from "lucide-react";
import { PageLayout, SectionCard } from "@/components/PageLayout";

const BASE_URL = "https://klugmotors.com.br";

export const Route = createFileRoute("/garantia")({
  head: () => ({
    meta: [
      { title: "Garantia de Scooter Elétrica | Klug Motors Joinville" },
      { name: "description", content: "Condições de garantia para motos e scooters elétricas Klug Motors. Cobertura de bateria, motor e componentes, além de assistência técnica em Joinville/SC." },
      { property: "og:title", content: "Garantia — Klug Motors" },
      { property: "og:description", content: "Cobertura de garantia, prazo, o que cobre e como acionar. Assistência técnica em Joinville/SC." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE_URL}/garantia` },
      { property: "og:image", content: `${BASE_URL}/__l5e/assets-v1/edfee49b-db69-4faf-8815-17dc7732caed/og-garantia.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${BASE_URL}/__l5e/assets-v1/edfee49b-db69-4faf-8815-17dc7732caed/og-garantia.jpg` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/garantia` }],
  }),
  component: GarantiaPage,
});

function GarantiaPage() {
  return (
    <PageLayout
      eyebrow="Pós-venda"
      title="Garantia &"
      titleAccent="assistência"
      intro="Todo veículo comercializado pela Klug Motors conta com garantia oficial do fabricante e suporte técnico direto na nossa loja em Joinville/SC."
    >
      <SectionCard title="O que a garantia cobre">
        <ul className="grid sm:grid-cols-2 gap-4 not-prose">
          {[
            { icon: Battery, title: "Bateria", desc: "12 meses contra defeitos de fabricação. Degradação natural não é considerada defeito." },
            { icon: ShieldCheck, title: "Motor e controlador", desc: "12 meses de garantia contra defeitos de fabricação em uso normal." },
            { icon: Wrench, title: "Componentes elétricos", desc: "3 a 6 meses (chicote, painel, farol LED, carregador) conforme o fabricante." },
            { icon: AlertTriangle, title: "Itens de desgaste", desc: "Pneus, pastilhas de freio, lâmpadas e correias não são cobertos pela garantia." },
          ].map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex gap-4 items-start border border-border rounded-xl p-4 bg-background/50">
              <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
                <Icon size={18} />
              </span>
              <div>
                <p className="font-display font-black uppercase text-sm tracking-wider text-white mb-1">{title}</p>
                <p className="text-white/60 text-[13px] leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="O que não é coberto">
        <ul className="list-disc pl-5 space-y-2 text-[15px]">
          <li>Danos causados por acidente, queda ou uso indevido.</li>
          <li>Modificações não autorizadas no sistema elétrico ou mecânico.</li>
          <li>Exposição a chuva forte ou submersão além do especificado (IP54).</li>
          <li>Sobrecarga de peso além do limite indicado no manual.</li>
          <li>Uso da bateria com carregador não original ou tomadas com voltagem incorreta.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Como acionar a garantia">
        <ol className="list-decimal pl-5 space-y-2 text-[15px]">
          <li>Entre em contato pelo WhatsApp <a href="tel:+554734293200" className="text-primary underline">(47) 3429-3200</a> descrevendo o problema.</li>
          <li>Traga o veículo até nossa loja em Joinville para diagnóstico gratuito.</li>
          <li>Se o defeito for coberto, realizamos o reparo ou substituição da peça sem custo.</li>
          <li>Peças de reposição fora da garantia têm preço tabelado e estoque local.</li>
        </ol>
        <p className="text-xs text-white/50 pt-4">
          Estas condições são um resumo. As condições completas de garantia constam no manual do proprietário entregue no ato da compra.
        </p>
      </SectionCard>
    </PageLayout>
  );
}
