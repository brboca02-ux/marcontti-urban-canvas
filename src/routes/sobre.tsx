import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, Award, Leaf, Users, Zap } from "lucide-react";
import { PageLayout, SectionCard } from "@/components/PageLayout";
import janainaKlugAsset from "@/assets/janaina-klug.jpg.asset.json";

const BASE_URL = "https://klugmotors.com.br";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a Klug Motors — Concessionária Elétrica em Joinville" },
      { name: "description", content: "Conheça a Klug Motors: concessionária de motos, scooters e triciclos elétricos em Joinville/SC. Nossa história, missão e compromisso com mobilidade sustentável." },
      { property: "og:title", content: "Sobre a Klug Motors" },
      { property: "og:description", content: "História, missão e valores da Klug Motors — mobilidade elétrica em Joinville/SC." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE_URL}/sobre` },
      { property: "og:image", content: `${BASE_URL}/__l5e/assets-v1/78e7624d-b686-4a7e-bab4-74a99ab5fdca/og-sobre.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${BASE_URL}/__l5e/assets-v1/78e7624d-b686-4a7e-bab4-74a99ab5fdca/og-sobre.jpg` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/sobre` }],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <PageLayout
      eyebrow="Institucional"
      title="Missão, visão e valores"
      titleAccent="Klug Motors"
      intro="Na Klug Motors, acreditamos que cada moto e cada scooter entregam muito mais do que mobilidade: entregam liberdade, conquistas e novos começos."
    >
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="flex flex-col gap-8 h-full">
          <SectionCard title="Nossa Missão" className="m-0 border-primary/20 bg-primary/5 flex-1">
            <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground grid place-items-center mb-6 shadow-lg shadow-primary/20">
              <Zap size={24} fill="currentColor" />
            </div>
            <p className="text-white text-lg leading-relaxed font-medium italic">
              "Acolher cada cliente com carinho, ouvir suas necessidades e oferecer a melhor solution com honestidade, respeito e dedicação, fazendo com que cada pessoa saia daqui com a certeza de que fez a escolha certa."
            </p>
          </SectionCard>

          <SectionCard title="Nossa Visão" className="m-0 border-white/10 bg-white/[0.02] flex-1">
            <div className="w-12 h-12 rounded-xl bg-white/10 text-white grid place-items-center mb-6">
              <Users size={24} />
            </div>
            <p className="text-white/80 text-lg leading-relaxed">
              "Queremos ser reconhecidos como uma empresa que conquista clientes pela confiança, pelo atendimento humano e pela paixão em servir. Nosso objetivo é crescer sem perder nossa essência: tratar cada cliente como único e construir relações que durem muito além da entrega das chaves."
            </p>
          </SectionCard>
        </div>
        
        <div className="relative overflow-hidden rounded-3xl border border-white/10 group bg-card shadow-2xl h-full min-h-[500px]">
          <img 
            src={janainaKlugAsset.url} 
            alt="Janaina Klug - Proprietária da Klug Motors" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl">
              <p className="font-display font-black text-3xl text-white uppercase tracking-tighter">Janaina Klug</p>
              <p className="text-primary text-[11px] font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                <span className="w-8 h-px bg-primary" />
                Proprietária & Fundadora
              </p>
            </div>
          </div>
        </div>
      </div>

      <SectionCard title="Nossos Valores">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 not-prose">
          {[
            { text: "Atender com o coração e colocar as pessoas em primeiro lugar.", icon: Zap },
            { text: "Agir sempre com honestidade, ética e transparência.", icon: Award },
            { text: "Respeitar cada história, cada sonho e cada conquista.", icon: Users },
            { text: "Trabalhar com paixão, dedicação e responsabilidade.", icon: Zap },
            { text: "Buscar excelência em tudo o que fazemos.", icon: Award },
            { text: "Valorizar o trabalho em equipe e o respeito entre todos.", icon: Users },
            { text: "Construir relações baseadas na confiança.", icon: Zap },
            { text: "Evoluir constantemente para oferecer a melhor experiência.", icon: Award },
            { text: "Gratidão pela oportunidade de realizar sonhos.", icon: Users },
          ].map((item, idx) => (
            <li key={idx} className="flex gap-4 items-start border border-white/5 rounded-xl p-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
              <span className="w-8 h-8 rounded-lg bg-primary/5 text-primary/40 group-hover:text-primary group-hover:bg-primary/10 grid place-items-center shrink-0 transition-colors">
                <item.icon size={14} />
              </span>
              <p className="text-white/70 text-[13px] leading-snug font-medium">{item.text}</p>
            </li>
          ))}
        </ul>
      </SectionCard>


      <SectionCard title="Por que Klug Motors">
        <ul className="grid sm:grid-cols-2 gap-4 not-prose">
          {[
            { icon: Award, title: "Revenda autorizada", desc: "Modelos homologados, com nota fiscal e garantia oficial." },
            { icon: Users, title: "Atendimento próximo", desc: "Falamos direto com você, sem intermediário — no WhatsApp, telefone ou na loja." },
            { icon: Leaf, title: "Mobilidade sustentável", desc: "Zero emissão local. Reduza sua pegada de carbono no trânsito diário." },
            { icon: Zap, title: "Economia real", desc: "Recarga custa centavos por km — muito mais barato que combustível." },
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

      <SectionCard title="Visite a loja">
        <div className="grid sm:grid-cols-2 gap-6 not-prose">
          <div className="space-y-3 text-sm">
            <p className="inline-flex items-start gap-2"><MapPin size={16} className="text-primary mt-0.5 shrink-0" /> <span>R. Albano Schmidt, 1882 — Boa Vista<br />Joinville/SC · 89205-100</span></p>
            <p className="inline-flex items-start gap-2"><Clock size={16} className="text-primary mt-0.5 shrink-0" /> <span>Seg a Sex: 08:30 às 18:30 (sem fechar para almoço)<br />Sábado: 08:30 às 13:00<br />Domingo: fechado</span></p>
            <p className="text-xs text-white/50 pt-2">CNPJ 51.728.597/0001-26</p>
          </div>
          <div className="border border-border rounded-xl overflow-hidden">
            <iframe
              title="Localização da Klug Motors em Joinville"
              src="https://www.google.com/maps?q=R.+Albano+Schmidt,+1882+-+Boa+Vista,+Joinville+-+SC,+89205-100&output=embed"
              width="100%"
              height="220"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </SectionCard>
    </PageLayout>
  );
}