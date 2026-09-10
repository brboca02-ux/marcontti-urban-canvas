import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import klugLogo from "@/assets/klug/klug-horizontal-white.png.asset.json";
import klugSymbol from "@/assets/klug/klug-symbol.png.asset.json";

const BASE_URL = "https://klugmotors.com.br";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Klug Motors" },
      {
        name: "description",
        content:
          "Política de privacidade e uso de cookies da Klug Motors. Saiba como tratamos seus dados de acordo com a LGPD.",
      },
      { property: "og:title", content: "Política de Privacidade — Klug Motors" },
      {
        property: "og:description",
        content:
          "Como a Klug Motors coleta, usa e protege seus dados pessoais e cookies.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE_URL}/privacidade` },
      { property: "og:image", content: `${BASE_URL}/__l5e/assets-v1/1322be98-c954-4e83-955c-7835355fab91/og-privacidade.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${BASE_URL}/__l5e/assets-v1/1322be98-c954-4e83-955c-7835355fab91/og-privacidade.jpg` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/privacidade` }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const updated = "22/07/2026";

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="Klug Motors — início">
            <img src={klugLogo.url} alt="Klug Motors" className="h-8 w-auto object-contain" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[11px] font-display font-black uppercase tracking-widest text-white/70 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 sm:px-8 py-14 sm:py-20">
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-display font-black mb-4">
          Documento legal
        </p>
        <h1 className="font-display font-black uppercase text-3xl sm:text-4xl md:text-5xl tracking-tight sm:tracking-tighter leading-[1.05]">
          Política de <span className="text-primary">Privacidade</span>
        </h1>
        <p className="mt-5 text-sm text-white/50">Última atualização: {updated}</p>

        <div className="prose prose-invert mt-10 max-w-none space-y-8 text-[15px] leading-relaxed text-white/80">
          <Section title="1. Quem somos">
            <p>
              Klug Motors, inscrita no CNPJ 51.728.597/0001-26, localizada na
              R. Albano Schmidt, 1882 — Boa Vista, Joinville/SC · 89205-100, é a controladora dos
              dados pessoais tratados por este site e responsável por esta
              política, nos termos da Lei Geral de Proteção de Dados
              (Lei nº 13.709/2018 — LGPD).
            </p>
          </Section>

          <Section title="2. Dados que coletamos">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Dados fornecidos por você:</strong> nome, telefone,
                e-mail e mensagens ao preencher o formulário de simulação de
                financiamento ou nos contatar por WhatsApp.
              </li>
              <li>
                <strong>Dados de navegação:</strong> endereço IP, tipo de
                dispositivo, páginas visitadas e origem do acesso, coletados
                automaticamente por cookies e ferramentas de análise.
              </li>
            </ul>
          </Section>

          <Section title="3. Como usamos">
            <ul className="list-disc pl-5 space-y-2">
              <li>Responder a solicitações de simulação de financiamento e atendimento comercial.</li>
              <li>Enviar informações sobre modelos, condições e novidades.</li>
              <li>Medir o desempenho do site e melhorar a experiência.</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
            </ul>
          </Section>

          <Section title="4. Cookies">
            <p>
              Cookies são pequenos arquivos armazenados no seu dispositivo.
              Usamos três categorias:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>
                <strong>Essenciais:</strong> necessários para o site funcionar.
                Não podem ser desativados.
              </li>
              <li>
                <strong>Analytics:</strong> ajudam a entender como o site é
                usado, de forma agregada e anônima.
              </li>
              <li>
                <strong>Marketing:</strong> permitem personalizar anúncios e
                comunicações.
              </li>
            </ul>
            <p className="mt-3">
              Você controla essas categorias no banner de cookies. Para revisar
              suas escolhas, limpe os cookies do site no seu navegador — o
              banner reaparecerá.
            </p>
          </Section>

          <Section title="5. Compartilhamento">
            <p>
              Não vendemos seus dados. Podemos compartilhá-los com prestadores
              que nos apoiam (hospedagem, análise, comunicação) sob contrato e
              apenas para as finalidades descritas aqui, e com autoridades
              quando exigido por lei.
            </p>
          </Section>

          <Section title="6. Retenção">
            <p>
              Mantemos seus dados apenas pelo tempo necessário às finalidades
              acima ou conforme obrigações legais. Depois disso, são excluídos
              ou anonimizados.
            </p>
          </Section>

          <Section title="7. Seus direitos (LGPD)">
            <p>
              Você pode solicitar a qualquer momento: confirmação e acesso aos
              dados, correção, anonimização, portabilidade, eliminação,
              revogação de consentimento e informação sobre compartilhamentos.
              Para exercer seus direitos, entre em contato pelos canais abaixo.
            </p>
          </Section>

          <Section title="8. Contato">
            <p>
              E-mail: <a href="mailto:klugmotors@gmail.com" className="text-primary underline underline-offset-2">klugmotors@gmail.com</a>
              <br />
              Telefone: <a href="tel:+554734293200" className="text-primary underline underline-offset-2">(47) 3429-3200</a>
              <br />
              Endereço: R. Albano Schmidt, 1882 — Boa Vista, Joinville/SC · 89205-100.
            </p>
          </Section>

          <Section title="9. Atualizações">
            <p>
              Podemos atualizar esta política para refletir mudanças legais ou
              operacionais. A data no topo indica a versão vigente.
            </p>
          </Section>
        </div>
      </main>

      <footer className="bg-card border-t border-border py-10">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={klugSymbol.url} alt="" aria-hidden="true" className="w-6 h-6 object-contain opacity-70" />
            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
              © {new Date().getFullYear()} Klug Motors · Joinville / SC
            </span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[11px] font-display font-black uppercase tracking-widest text-white/70 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para a home
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display font-black uppercase tracking-tight text-xl text-white mb-3">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}
