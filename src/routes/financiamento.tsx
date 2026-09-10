import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, Wallet, MessageCircle, Check } from "lucide-react";
import { PageLayout, SectionCard } from "@/components/PageLayout";
import { buildWhatsAppFallbackUrl, openWhatsAppWithFallback } from "@/lib/models";

const BASE_URL = "https://klugmotors.com.br";
const FINANCE_MSG =
  "Olá, Klug Motors! Quero simular um financiamento e conhecer as condições. Podem me ajudar?";

export const Route = createFileRoute("/financiamento")({
  head: () => ({
    meta: [
      { title: "Financiamento de Moto Elétrica em Joinville | Klug Motors" },
      { name: "description", content: "Financie sua moto ou scooter elétrica na Klug Motors. Consulte condições, parcelas, entrada e prazos direto no WhatsApp com nossa equipe em Joinville/SC." },
      { property: "og:title", content: "Financiamento — Klug Motors" },
      { property: "og:description", content: "Condições facilitadas para motos e scooters elétricas. Simulação rápida via WhatsApp." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE_URL}/financiamento` },
      { property: "og:image", content: `${BASE_URL}/__l5e/assets-v1/fcd10479-04dd-4010-8cae-a09896eb8c78/og-financiamento.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${BASE_URL}/__l5e/assets-v1/fcd10479-04dd-4010-8cae-a09896eb8c78/og-financiamento.jpg` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/financiamento` }],
  }),
  component: FinanciamentoPage,
});

function FinanciamentoPage() {
  return (
    <PageLayout
      eyebrow="Condições comerciais"
      title="Financie sua"
      titleAccent="moto elétrica"
      intro="Sua moto ou scooter elétrica pode caber no seu orçamento. Trabalhamos com parceiros para oferecer condições facilitadas — consulte com nossa equipe as opções para o modelo que você quer."
    >
      <SectionCard title="Formas de pagamento aceitas">
        <ul className="grid sm:grid-cols-2 gap-4 not-prose">
          {[
            { icon: Wallet, title: "À vista", desc: "PIX, dinheiro ou transferência com desconto especial. Consulte." },
            { icon: CreditCard, title: "Cartão de crédito", desc: "Parcelamento em até 12x — condição varia por bandeira." },
            { icon: CreditCard, title: "CDC bancário", desc: "Financiamento via bancos parceiros. Prazo mais longo, análise de crédito." },
            { icon: Wallet, title: "Entrada + saldo", desc: "Combine uma entrada e parcele o restante. Flexibilidade total." },
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

      <SectionCard title="Documentos necessários (financiamento CDC)">
        <ul className="grid sm:grid-cols-2 gap-3 not-prose">
          {[
            "RG e CPF (ou CNH)",
            "Comprovante de residência (últimos 90 dias)",
            "Comprovante de renda (holerite, extrato ou DECORE)",
            "Referência pessoal (nome e telefone)",
          ].map((d) => (
            <li key={d} className="flex items-start gap-2 text-sm">
              <Check size={16} className="text-primary shrink-0 mt-0.5" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-white/50 pt-4">
          A análise de crédito é feita pelo banco parceiro. Aprovação e taxas podem variar conforme perfil.
        </p>
      </SectionCard>

      <SectionCard title="Precisa de CNH?">
        <p>
          Depende do modelo. Motos e scooters de até <strong className="text-primary">1000W</strong>{" "}
          são classificadas pelo <strong>CONTRAN 996/23</strong> como equipamentos autopropelidos —{" "}
          <strong>não exigem CNH nem emplacamento</strong>. Modelos acima de 1000W são
          motocicletas e precisam de CNH categoria A. Veja quais modelos são sem CNH no{" "}
          <Link to="/modelos" className="text-primary underline">catálogo</Link>.
        </p>
      </SectionCard>

      <div className="text-center pt-4">
        <p className="text-white/60 mb-6 text-lg max-w-xl mx-auto">
          Pronto pra simular? Fale com a gente e receba as condições exatas para o modelo que você quer.
        </p>
        <a
          href={buildWhatsAppFallbackUrl(FINANCE_MSG)}
          onClick={(e) => { e.preventDefault(); openWhatsAppWithFallback(FINANCE_MSG); }}
          className="inline-flex items-center gap-2 bg-[#25D366] text-white font-display font-black uppercase text-sm tracking-widest px-8 py-4 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(37,211,102,0.6)]"
          aria-label="Simular financiamento no WhatsApp"
        >
          <MessageCircle size={18} fill="white" strokeWidth={0} />
          Simular no WhatsApp
        </a>
      </div>
    </PageLayout>
  );
}
