import x12Img from "@/assets/motos/x12.jpg.asset.json";
import miaImg from "@/assets/motos/mia.jpg.asset.json";
import gigaImg from "@/assets/motos/giga.jpg.asset.json";
import retImg from "@/assets/motos/ret.jpg.asset.json";
import somaImg from "@/assets/motos/soma.jpg.asset.json";
import jetImg from "@/assets/motos/jet.jpg.asset.json";
import bigtriImg from "@/assets/motos/bigtri.jpg.asset.json";
import sofiaImg from "@/assets/motos/sofia.jpg.asset.json";
import miatriImg from "@/assets/motos/miatri.jpg.asset.json";
import suduA12Img from "@/assets/motos/sudu-a12.png.asset.json";
import suduA10Img from "@/assets/motos/sudu-a10.png.asset.json";
import suduA3PlusImg from "@/assets/motos/sudu-a3-plus.png.asset.json";
import suduA4Img from "@/assets/motos/sudu-a4.png.asset.json";
import suduA5Img from "@/assets/motos/sudu-a5.png.asset.json";
import suduA6Img from "@/assets/motos/sudu-a6.png.asset.json";
import suduA13TImg from "@/assets/motos/sudu-a13t.png.asset.json";
import yamahaNeosImg from "@/assets/motos/yamaha-neos-connected.png.asset.json";
import yamahaRayZrImg from "@/assets/motos/yamaha-rayzr-hybrid.png.asset.json";
import yamahaFluoImg from "@/assets/motos/yamaha-fluo-hybrid.png.asset.json";
import yamahaAeroxImg from "@/assets/motos/yamaha-aerox.png.asset.json";
import yamahaNmaxImg from "@/assets/motos/yamaha-nmax.png.asset.json";
import yamahaXmaxImg from "@/assets/motos/yamaha-xmax.png.asset.json";
import yamahaFactorImg from "@/assets/motos/yamaha-factor-150.png.asset.json";
import yamahaFactorDxImg from "@/assets/motos/yamaha-factor-150-dx.png.asset.json";
import yamahaFz25Img from "@/assets/motos/yamaha-fz25.png.asset.json";

/** Slots de imagem dos blocos da página de vendas (chave ausente = automático). */
export const SECTION_SLOTS = [
  { key: "hero", label: "Hero (imagem principal)" },
  { key: "terreno", label: "Pronta para qualquer terreno" },
  { key: "tecnologia_a", label: "Tecnologia e conforto — imagem A" },
  { key: "tecnologia_b", label: "Tecnologia e conforto — imagem B" },
  { key: "comodidade", label: "Comodidade — Praticidade que acompanha a sua rotina" },
  { key: "conectividade", label: "Conectividade" },
  { key: "modernidade_a", label: "Modernidade — Painel 100% digital (A)" },
  { key: "modernidade_b", label: "Modernidade — Painel 100% digital (B)" },
  { key: "modernidade_c", label: "Modernidade — Painel 100% digital (C)" },
] as const;

export type SectionSlot = (typeof SECTION_SLOTS)[number]["key"];
export type SectionImages = Partial<Record<SectionSlot, string>>;

export type ColorVariant = {
  name: string;
  hex: string;
  image: string;
  gallery?: string[];
  tagline?: string;
  description?: string;
  /** Imagem escolhida no admin para cada bloco da página de vendas. */
  sections?: SectionImages;
};


export type Model = {
  slug: string;
  name: string;
  tag: string;
  price: string;
  priceNumber: number;
  range: string;
  speed: string;
  power: string;
  short: string;
  description: string;
  colors: ColorVariant[];
  specs: { label: string; value: string }[];
  features: string[];
  gallery?: string[];
  condition?: "zero_km" | "semi_nova";
  installmentMonths?: number;
  installmentValue?: number;
  installmentNote?: string;
};


/** Build a gallery for a model: explicit gallery > color variants > single image. */
export function getGallery(m: Model): string[] {
  if (m.gallery && m.gallery.length > 0) return m.gallery;
  const fromColors = m.colors.map((c) => c.image).filter(Boolean);
  return fromColors.length > 0 ? fromColors : [];
}

export const models: Model[] = [
  {
    slug: "mia",
    name: "MIA 1000W",
    tag: "Scooter · Sem CNH",
    price: "R$ 10.990,00",
    priceNumber: 10990,
    range: "até 45 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Scooter compacta e estilosa para o dia a dia urbano — sem CNH.",
    description:
      "A MIA é a escolha certa para quem busca praticidade, economia e estilo. Autopropelida (não exige CNH), leve, silenciosa e resistente a chuva.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: miaImg.url }],
    specs: [
      { label: "Autonomia", value: "até 45 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 20Ah 60V removível" },
      { label: "Carregador", value: "Turbo 5A bivolt 110/220V" },
      { label: "Recarga", value: "até 5 horas" },
      { label: "Aro", value: "10\" liga leve" },
      { label: "Capacidade", value: "até 180 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Bateria removível", "Painel digital", "Freios a disco hidráulico", "Farol LED full"],
  },
  {
    slug: "x12",
    name: "X12 1000W",
    tag: "Scooter Citycoco · Sem CNH",
    price: "R$ 10.490,40",
    priceNumber: 10490.4,
    range: "até 45 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "A citycoco mais vendida — potência, pneus largos e presença.",
    description:
      "A X12 une visual citycoco robusto, banco duplo com encosto, suspensão dupla e potência de 1.000W. Suporta 2 baterias, chave cartão e alarme com sirene. Sem CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: x12Img.url }],
    specs: [
      { label: "Autonomia", value: "até 45 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 20Ah 60V removível (suporta 2)" },
      { label: "Carregador", value: "Turbo 5A bivolt 110/220V" },
      { label: "Recarga", value: "até 5 horas" },
      { label: "Aro", value: "10\" liga leve" },
      { label: "Suspensão", value: "Dupla dianteira e traseira" },
      { label: "Capacidade", value: "até 180 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: [
      "Suporta 2 baterias",
      "Chave cartão + alarme com sirene",
      "Banco duplo com encosto",
      "Freio a disco hidráulico",
    ],
  },
  {
    slug: "giga",
    name: "GIGA 1000W",
    tag: "Scooter · Sem CNH",
    price: "R$ 10.490,40",
    priceNumber: 10490.4,
    range: "até 50 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Scooter robusta com conforto de suspensão dupla.",
    description:
      "A GIGA entrega performance urbana com bateria de lítio removível, suspensão dupla e acabamento premium. Autopropelida, não exige CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: gigaImg.url }],
    specs: [
      { label: "Autonomia", value: "até 50 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 20Ah 60V removível" },
      { label: "Carregador", value: "Turbo 5A bivolt 110/220V" },
      { label: "Recarga", value: "até 5 horas" },
      { label: "Aro", value: "10\"" },
      { label: "Capacidade", value: "até 180 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Suspensão dupla", "Painel digital", "Farol LED full", "Alarme com sirene"],
  },
  {
    slug: "ret",
    name: "RET 1000W",
    tag: "Moto Elétrica · Sem CNH",
    price: "R$ 8.990,10",
    priceNumber: 8990.1,
    range: "até 50 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Moto elétrica retrô urbana — estilo e economia.",
    description:
      "A RET combina design retrô moderno com a economia da tração 100% elétrica. Bateria de lítio removível e acabamento urbano. Sem CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: retImg.url }],
    specs: [
      { label: "Autonomia", value: "até 50 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 20Ah 60V removível" },
      { label: "Carregador", value: "Turbo 5A bivolt 110/220V" },
      { label: "Recarga", value: "até 5 horas" },
      { label: "Aro", value: "14\"" },
      { label: "Capacidade", value: "até 180 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Design retrô", "Painel digital", "Farol LED", "Alarme com sirene"],
  },
  {
    slug: "soma",
    name: "SOMA 1000W",
    tag: "Moto Elétrica · Sem CNH",
    price: "R$ 8.540,00",
    priceNumber: 8540,
    range: "até 50 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Moto elétrica compacta, ágil e econômica.",
    description:
      "A SOMA é ideal para trocar combustível pela economia elétrica sem abrir mão do design de moto. Bateria removível, freio a disco e alarme. Sem CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: somaImg.url }],
    specs: [
      { label: "Autonomia", value: "até 50 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 20Ah 60V removível" },
      { label: "Carregador", value: "Turbo 5A bivolt 110/220V" },
      { label: "Recarga", value: "até 5 horas" },
      { label: "Aro", value: "14\"" },
      { label: "Capacidade", value: "até 180 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Painel digital", "Freio a disco hidráulico", "Farol LED full", "Alarme com sirene"],
  },
  {
    slug: "jet",
    name: "JET 1000W",
    tag: "Moto Elétrica · Sem CNH",
    price: "R$ 10.490,40",
    priceNumber: 10490.4,
    range: "até 55 km",
    speed: "32 km/h",
    power: "1.000W (pico 3.000W)",
    short: "Moto elétrica esportiva com performance urbana.",
    description:
      "A JET combina design esportivo, motor com pico de 3.000W (excelente em subidas) e a economia total da tração 100% elétrica. Sem CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: jetImg.url }],
    specs: [
      { label: "Autonomia", value: "até 55 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W nominal (pico 3.000W)" },
      { label: "Bateria", value: "Lítio 20Ah 60V removível" },
      { label: "Carregador", value: "Turbo 5A bivolt 110/220V" },
      { label: "Recarga", value: "até 5 horas" },
      { label: "Aro", value: "12\" dianteiro" },
      { label: "Capacidade", value: "até 180 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Pico 3.000W p/ subidas", "Freio a disco hidráulico", "Farol LED full", "Alarme com sirene"],
  },
  {
    slug: "big-tri",
    name: "BIG TRI 1000W",
    tag: "Triciclo · Sem CNH",
    price: "R$ 12.490,02",
    priceNumber: 12490.02,
    range: "até 50 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Triciclo elétrico de 3 lugares — estabilidade e capacidade.",
    description:
      "O BIG TRI oferece estabilidade de três rodas, capacidade para até 3 pessoas e marcha ré elétrica. Ideal para famílias, entregas e mobilidade segura.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: bigtriImg.url }],
    specs: [
      { label: "Autonomia", value: "até 50 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 20Ah 60V removível" },
      { label: "Carregador", value: "Turbo 5A bivolt 110/220V" },
      { label: "Capacidade", value: "3 lugares · até 200 kg" },
      { label: "Marcha ré", value: "Sim (elétrica)" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["3 rodas estáveis", "Marcha ré elétrica", "Bagageiro traseiro", "Painel digital"],
  },
  {
    slug: "sofia",
    name: "SOFIA 1000W",
    tag: "Scooter · Sem CNH",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "até 50 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Design feminino e delicado, sem abrir mão da potência.",
    description:
      "A SOFIA tem design pensado no público feminino, combinando delicadeza, conforto e potência de 1.000W. Consulte disponibilidade.",
    colors: [{ name: "Padrão", hex: "#f4a8a8", image: sofiaImg.url }],
    specs: [
      { label: "Autonomia", value: "até 50 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 20Ah 60V removível" },
      { label: "Carregador", value: "Turbo 5A bivolt 110/220V" },
      { label: "Aro", value: "10\"" },
      { label: "Capacidade", value: "até 150 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Design feminino", "Painel digital", "Cesto frontal", "Farol LED full"],
  },
  {
    slug: "mia-tri",
    name: "MIA TRI 800W",
    tag: "Triciclo · Sem CNH",
    price: "R$ 11.990,80",
    priceNumber: 11990.8,
    range: "até 45 km",
    speed: "25 km/h",
    power: "800W",
    short: "Triciclo compacto e estável — ideal para mobilidade reduzida e passeios.",
    description:
      "O MIA TRI une a estabilidade de três rodas ao design compacto da linha MIA. Perfeito para quem busca segurança extra, mobilidade e conforto no dia a dia — sem exigir CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: miatriImg.url }],
    specs: [
      { label: "Autonomia", value: "até 45 km" },
      { label: "Velocidade máx.", value: "25 km/h" },
      { label: "Potência", value: "800W" },
      { label: "Bateria", value: "Lítio 20Ah 60V removível" },
      { label: "Carregador", value: "Bivolt 110/220V" },
      { label: "Rodas", value: "3 rodas — estabilidade extra" },
      { label: "Capacidade", value: "até 150 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["3 rodas estáveis", "Bagageiro traseiro", "Painel digital", "Ré elétrica"],
  },
  // ==================== SUDU ====================
  {
    slug: "sudu-a12",
    name: "SUDU A12+ 1000W",
    tag: "Scooter SUDU · Sem CNH",
    price: "R$ 10.590",
    priceNumber: 10590,
    range: "até 55 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Scooter SUDU A12 com NFC, Bluetooth e cruise control.",
    description:
      "SUDU A12 combina tecnologia embarcada (NFC, Bluetooth, Cruise Control) com bateria 60V 24Ah de lítio e capacidade de 150 kg. Design urbano e desempenho ideal para o dia a dia.",
    colors: [{ name: "Verde", hex: "#1f8a4c", image: suduA12Img.url }],
    specs: [
      { label: "Autonomia", value: "até 55 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V 24Ah" },
      { label: "Capacidade", value: "até 150 kg" },
      { label: "Tecnologia", value: "NFC · Bluetooth · Cruise Control" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["NFC", "Bluetooth", "Cruise Control", "Painel digital"],
  },
  {
    slug: "sudu-a10",
    name: "SUDU A10 1000W",
    tag: "Scooter SUDU · Sem CNH",
    price: "R$ 6.990",
    priceNumber: 6990,
    range: "até 50 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "SUDU A10 — scooter urbana com bateria de lítio 48V 24Ah.",
    description:
      "SUDU A10 é a opção equilibrada da linha: leve, econômica e com autonomia de até 50 km. Suporta até 140 kg.",
    colors: [{ name: "Padrão", hex: "#7f8c8d", image: suduA10Img.url }],
    specs: [
      { label: "Autonomia", value: "até 50 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 48V 24Ah" },
      { label: "Capacidade", value: "até 140 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Bateria removível", "Painel digital", "Freios a disco"],
  },
  {
    slug: "sudu-a3-plus",
    name: "SUDU A3+ 1000W",
    tag: "Scooter SUDU · Sem CNH",
    price: "R$ 10.590",
    priceNumber: 10590,
    range: "até 60 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "SUDU A3+ com NFC e autonomia de até 60 km.",
    description:
      "SUDU A3+ traz destravamento por NFC e bateria de lítio 60V 20Ah para uma autonomia estendida de até 60 km.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: suduA3PlusImg.url }],
    specs: [
      { label: "Autonomia", value: "até 60 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V 20Ah" },
      { label: "Capacidade", value: "até 150 kg" },
      { label: "Tecnologia", value: "NFC" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["NFC", "Painel digital", "Freios a disco"],
  },
  {
    slug: "sudu-a4",
    name: "SUDU A4 1000W",
    tag: "Scooter SUDU · Sem CNH",
    price: "R$ 10.590",
    priceNumber: 10590,
    range: "até 60 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "SUDU A4 — design urbano e NFC integrado.",
    description:
      "SUDU A4 oferece bateria 60V 20Ah de lítio, autonomia de até 60 km e capacidade de 150 kg. Ideal para deslocamentos diários.",
    colors: [{ name: "Padrão", hex: "#2c3e50", image: suduA4Img.url }],
    specs: [
      { label: "Autonomia", value: "até 60 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V 20Ah" },
      { label: "Capacidade", value: "até 150 kg" },
      { label: "Tecnologia", value: "NFC" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["NFC", "Painel digital", "Freios a disco"],
  },
  {
    slug: "sudu-a5",
    name: "SUDU A5 1000W",
    tag: "Scooter SUDU · Sem CNH",
    price: "R$ 10.990",
    priceNumber: 10990,
    range: "até 60 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "SUDU A5 com NFC, Bluetooth e bateria 60V 24Ah.",
    description:
      "SUDU A5 integra conectividade Bluetooth e NFC com bateria de lítio 60V 24Ah, entregando até 60 km de autonomia.",
    colors: [{ name: "Padrão", hex: "#c0392b", image: suduA5Img.url }],
    specs: [
      { label: "Autonomia", value: "até 60 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V 24Ah" },
      { label: "Capacidade", value: "até 150 kg" },
      { label: "Tecnologia", value: "NFC · Bluetooth" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["NFC", "Bluetooth", "Painel digital"],
  },
  {
    slug: "sudu-a6",
    name: "SUDU A6 1000W",
    tag: "Scooter SUDU · Sem CNH",
    price: "R$ 10.490",
    priceNumber: 10490,
    range: "até 65 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "SUDU A6 — topo de linha com Hill Assist e Bluetooth.",
    description:
      "SUDU A6 é a scooter mais completa da linha: assistente de subida (Hill Assist), Bluetooth, NFC, bateria de lítio 60V 24Ah e autonomia de até 65 km.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: suduA6Img.url }],
    specs: [
      { label: "Autonomia", value: "até 65 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V 24Ah" },
      { label: "Capacidade", value: "até 150 kg" },
      { label: "Tecnologia", value: "NFC · Bluetooth · Hill Assist" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Hill Assist", "NFC", "Bluetooth", "Painel digital"],
  },
  {
    slug: "sudu-a13t",
    name: "SUDU A13T 800W",
    tag: "Triciclo SUDU · 3 lugares",
    price: "R$ 10.990",
    priceNumber: 10990,
    range: "até 55 km",
    speed: "32 km/h",
    power: "800W",
    short: "Triciclo SUDU A13T — 3 lugares e capacidade de 186 kg.",
    description:
      "SUDU A13T é o triciclo elétrico para famílias e transporte utilitário. Comporta até 3 lugares, capacidade de 186 kg, NFC e bateria 60V 24Ah.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: suduA13TImg.url }],
    specs: [
      { label: "Autonomia", value: "até 55 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "800W" },
      { label: "Bateria", value: "Lítio 60V 24Ah" },
      { label: "Capacidade", value: "até 186 kg" },
      { label: "Lugares", value: "3 lugares" },
      { label: "Tecnologia", value: "NFC" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["3 lugares", "NFC", "3 rodas estáveis", "Ré elétrica"],
  },
  {
    slug: "sudu-a2s",
    name: "SUDU A2S 1000W",
    tag: "Scooter SUDU · Sem CNH",
    price: "R$ 8.990",
    priceNumber: 8990,
    range: "até 50 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "SUDU A2S — scooter urbana compacta com bateria de lítio.",
    description:
      "SUDU A2S entrega mobilidade urbana com bateria de lítio, autonomia de até 50 km e capacidade de 140 kg. Ideal para o dia a dia.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: suduA10Img.url }],
    specs: [
      { label: "Autonomia", value: "até 50 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V 20Ah" },
      { label: "Capacidade", value: "até 140 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Painel digital", "Freios a disco", "Bateria removível"],
  },
  {
    slug: "sudu-k3",
    name: "SUDU K3 750W",
    tag: "Scooter SUDU · Sem CNH",
    price: "R$ 9.990",
    priceNumber: 9990,
    range: "até 45 km",
    speed: "32 km/h",
    power: "750W",
    short: "SUDU K3 — scooter compacta e ágil para a cidade.",
    description:
      "SUDU K3 é a scooter mais leve da linha K, com motor de 750W, bateria de lítio e autonomia de até 45 km.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: suduA10Img.url }],
    specs: [
      { label: "Autonomia", value: "até 45 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "750W" },
      { label: "Bateria", value: "Lítio 48V 20Ah" },
      { label: "Capacidade", value: "até 140 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Painel digital", "Freios a disco"],
  },
  {
    slug: "sudu-k6",
    name: "SUDU K6 1000W",
    tag: "Scooter SUDU · Sem CNH",
    price: "R$ 9.990",
    priceNumber: 9990,
    range: "até 55 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "SUDU K6 — equilíbrio entre autonomia e desempenho.",
    description:
      "SUDU K6 combina motor de 1.000W, bateria de lítio 60V 20Ah e autonomia de até 55 km, com capacidade de 150 kg.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: suduA10Img.url }],
    specs: [
      { label: "Autonomia", value: "até 55 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V 20Ah" },
      { label: "Capacidade", value: "até 150 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Painel digital", "Freios a disco", "Bateria removível"],
  },
  {
    slug: "sudu-k6-plus",
    name: "SUDU K6+ 1000W",
    tag: "Scooter SUDU · Sem CNH",
    price: "R$ 10.990",
    priceNumber: 10990,
    range: "até 65 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "SUDU K6+ — versão evoluída com maior autonomia.",
    description:
      "SUDU K6+ evolui o K6 com bateria de lítio 60V 24Ah, autonomia de até 65 km e capacidade de 150 kg.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: suduA10Img.url }],
    specs: [
      { label: "Autonomia", value: "até 65 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V 24Ah" },
      { label: "Capacidade", value: "até 150 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Painel digital", "Freios a disco", "Bateria removível"],
  },
  // ==================== YAMAHA ====================
  {
    slug: "yamaha-neos-connected",
    name: "Yamaha Neo's Connected",
    tag: "Scooter 100% Elétrica",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "até 68 km",
    speed: "62 km/h",
    power: "2.5 kW (≈ 50cc)",
    short: "Neo's Connected — mobilidade elétrica inteligente com conectividade Yamaha.",
    description:
      "A Yamaha Neo's Connected é 100% elétrica, com bateria de lítio removível, app Y-Connect e desempenho equivalente a uma 50cc. Silenciosa, econômica e conectada.",
    colors: [{ name: "Turquesa", hex: "#22b8b0", image: yamahaNeosImg.url }],
    specs: [
      // Dimensões
      { label: "Comprimento x Largura x Altura", value: "1880 x 695 x 1120 mm" },
      { label: "Altura do assento", value: "795 mm" },
      { label: "Altura mínima do solo", value: "135 mm" },
      { label: "Distância entre eixos", value: "1305 mm" },
      { label: "Tipo de chassi", value: "Underbone" },
      { label: "Peso líquido (com bateria)", value: "90 kg" },
      { label: "Pneu dianteiro", value: "INOUE RUBBER SS-570F 110/70-13 M/C 48P" },
      { label: "Pneu traseiro", value: "INOUE RUBBER SS-560R 130/70-13 M/C 63P" },
      // Motor
      { label: "Tipo de motor", value: "Elétrico de ímã permanente, refrigerado a ar" },
      { label: "Potência máxima", value: "2,5 kW (≈ equivalente 50cc)" },
      { label: "Potência nominal", value: "1,5 kW a 200 rpm" },
      { label: "Torque máximo", value: "16,9 N·m a 200 rpm" },
      { label: "Transmissão", value: "Direta / correia" },
      { label: "Velocidade máxima", value: "62 km/h" },
      { label: "Autonomia (1 bateria)", value: "até 37 km" },
      { label: "Autonomia (2 baterias)", value: "até 68 km" },
      // Freios
      { label: "Freio dianteiro", value: "Disco hidráulico Ø 190 mm" },
      { label: "Freio traseiro", value: "Tambor Ø 130 mm" },
      { label: "Sistema de frenagem", value: "UBS (Unified Brake System)" },
      // Suspensão
      { label: "Suspensão dianteira", value: "Garfo telescópico" },
      { label: "Suspensão traseira", value: "Braço oscilante com amortecedor único" },
      // Bateria principal
      { label: "Tipo de bateria", value: "Lítio-íon removível YY503AA" },
      { label: "Tensão nominal", value: "50,4 V" },
      { label: "Capacidade", value: "19,2 Ah / 968 Wh" },
      { label: "Peso por bateria", value: "≈ 8 kg" },
      { label: "Alojamento", value: "2 baterias removíveis" },
      { label: "Tempo de recarga (0–100%)", value: "≈ 8 h por bateria (carregador 220 V)" },
      { label: "Tempo de recarga (rápida 0–80%)", value: "≈ 5 h" },
      // Bateria auxiliar
      { label: "Bateria auxiliar (12V)", value: "Lítio-íon para acessórios e partida" },
      // Instrumentos & conectividade
      { label: "Painel", value: "LCD com Bluetooth Y-Connect" },
      { label: "Conectividade", value: "App Y-Connect (iOS / Android)" },
      { label: "Iluminação", value: "Full LED (farol, lanterna, setas)" },
      { label: "Porta USB", value: "Sim (compartimento frontal)" },
      { label: "Compartimento sob o assento", value: "Espaço para 1 capacete" },
      // Homologação
      { label: "Homologação ANATEL", value: "Módulo CCU homologado (Bluetooth)" },
      { label: "Habilitação exigida", value: "CNH categoria A" },
      { label: "Garantia", value: "4 anos de fábrica (motor e componentes) · bateria conforme manual" },
    ],
    features: ["Bateria removível", "App Y-Connect", "Painel LCD", "Freios CBS"],
  },
  {
    slug: "yamaha-rayzr-hybrid-connected",
    name: "Nova Yamaha ZR Hybrid Connected",
    tag: "Scooter Híbrida · 125cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Alto rendimento",
    speed: "Urbana",
    power: "125cc Hybrid",
    short: "ZR Hybrid Connected — leveza, economia e sistema híbrido inteligente.",
    description:
      "Scooter urbana com motor 125cc Blue Core e sistema Hybrid (Smart Motor Generator) que oferece assistência na partida, reduz consumo e emissões. Conectividade Y-Connect via Bluetooth.",
    colors: [{ name: "Prata Metálico", hex: "#c0c9cf", image: yamahaRayZrImg.url }],
    specs: [
      { label: "Motor", value: "125cc Blue Core Hybrid" },
      { label: "Sistema", value: "SMG (Smart Motor Generator)" },
      { label: "Câmbio", value: "CVT automático" },
      { label: "Partida", value: "Silenciosa (SMG)" },
      { label: "Conectividade", value: "Y-Connect (Bluetooth)" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["Sistema Hybrid", "Y-Connect", "Painel digital", "Stop & Start"],
  },
  {
    slug: "yamaha-fluo-abs-hybrid-connected",
    name: "Fluo ABS Hybrid Connected",
    tag: "Scooter Híbrida · 125cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Econômica",
    speed: "Urbana",
    power: "125cc Hybrid",
    short: "Fluo ABS Hybrid Connected — agilidade urbana com tecnologia híbrida Yamaha.",
    description:
      "Nova Fluo ABS Hybrid Connected combina motor 125cc Blue Core, sistema Hybrid SMG, freios ABS e conectividade Y-Connect. 4 anos de garantia de fábrica.",
    colors: [{ name: "Matt Green", hex: "#2f4a44", image: yamahaFluoImg.url }],
    specs: [
      { label: "Motor", value: "125cc Blue Core Hybrid" },
      { label: "Freios", value: "ABS dianteiro" },
      { label: "Sistema", value: "SMG (Smart Motor Generator)" },
      { label: "Câmbio", value: "CVT automático" },
      { label: "Conectividade", value: "Y-Connect (Bluetooth)" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["ABS", "Hybrid SMG", "Y-Connect", "Painel digital LCD"],
  },
  {
    slug: "yamaha-aerox-abs-connected",
    name: "Aerox ABS Connected",
    tag: "Scooter Esportiva · 160cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Esportiva",
    speed: "Alta performance",
    power: "160cc VVA",
    short: "Aerox ABS Connected — DNA esportivo Yamaha com VVA e conectividade.",
    description:
      "Scooter esportiva com motor 160cc VVA (Variable Valves Actuation), ABS, TCS (controle de tração) e conectividade Y-Connect. Design agressivo inspirado nas MotoGP.",
    colors: [{ name: "Racing Blue", hex: "#1e5bd6", image: yamahaAeroxImg.url }],
    specs: [
      { label: "Motor", value: "155cc SOHC 4T VVA" },
      { label: "Freios", value: "ABS dianteiro" },
      { label: "Controle", value: "TCS (tração)" },
      { label: "Câmbio", value: "CVT automático" },
      { label: "Conectividade", value: "Y-Connect (Bluetooth)" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["VVA", "ABS", "TCS", "Y-Connect", "Keyless"],
  },
  {
    slug: "yamaha-nmax-abs-connected",
    name: "NMAX ABS Connected",
    tag: "Scooter Premium · 160cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Premium",
    speed: "Urbana/Rodovia",
    power: "160cc VVA",
    short: "NMAX ABS Connected — modernidade, conforto e tecnologia premium.",
    description:
      "A NMAX ABS Connected traz motor 160cc VVA, ABS, controle de tração, painel TFT e conectividade Y-Connect. Referência em scooter premium urbana no Brasil.",
    colors: [{ name: "Racing Blue", hex: "#1e40af", image: yamahaNmaxImg.url }],
    specs: [
      { label: "Motor", value: "155cc SOHC 4T VVA" },
      { label: "Freios", value: "ABS dianteiro" },
      { label: "Controle", value: "TCS (tração)" },
      { label: "Painel", value: "TFT colorido" },
      { label: "Conectividade", value: "Y-Connect (Bluetooth)" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["VVA", "ABS", "TCS", "Painel TFT", "Keyless", "Y-Connect"],
  },
  {
    slug: "yamaha-xmax",
    name: "Yamaha XMAX 250",
    tag: "Maxi Scooter · 250cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Rodoviária",
    speed: "Alta performance",
    power: "250cc Blue Core",
    short: "XMAX 250 — a maxi scooter Yamaha para longas distâncias com conforto premium.",
    description:
      "Maxi scooter com motor 250cc Blue Core, ABS, controle de tração, para-brisa regulável, sistema Smart Key e amplo porta-capacete. Estilo MAX com conforto rodoviário.",
    colors: [{ name: "Matte Gray", hex: "#4b5058", image: "https://id-preview--6eaf19e2-66cd-4a54-b5f8-bfaa084b735b.lovable.app/api/public/model-images/yamaha-xmax/xmax-250-2021.png" }],
    specs: [
      { label: "Motor", value: "250cc Blue Core" },
      { label: "Freios", value: "ABS dianteiro e traseiro" },
      { label: "Controle", value: "TCS (tração)" },
      { label: "Partida", value: "Smart Key" },
      { label: "Para-brisa", value: "Regulável" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["ABS duplo", "TCS", "Smart Key", "Para-brisa regulável", "Porta-capacete"],
  },
  {
    slug: "yamaha-factor-150-ubs",
    name: "Yamaha Factor 150 UBS",
    tag: "Street · 150cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Econômica",
    speed: "Urbana",
    power: "150cc Blue Core",
    short: "Factor 150 UBS — a street mais vendida do Brasil, agora ainda mais eficiente.",
    description:
      "Factor 150 UBS combina motor 150cc Blue Core, freios UBS (Unified Brake System), baixo consumo e a robustez que fez dela referência entre as street 150cc.",
    colors: [{ name: "Preto", hex: "#0a0a0a", image: yamahaFactorImg.url }],
    specs: [
      { label: "Motor", value: "150cc Blue Core" },
      { label: "Freios", value: "UBS (freio integrado)" },
      { label: "Câmbio", value: "5 marchas" },
      { label: "Partida", value: "Elétrica" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["Blue Core", "UBS", "Painel digital", "Farol LED"],
  },
  {
    slug: "yamaha-factor-150-dx",
    name: "Yamaha Factor 150 DX",
    tag: "Street · 150cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Econômica",
    speed: "Urbana",
    power: "150cc Blue Core",
    short: "Factor 150 DX — versão top com painel digital e acabamento diferenciado.",
    description:
      "Versão DX da Factor 150 traz painel digital completo, rodas com acabamento esportivo e detalhes exclusivos, mantendo motor 150cc Blue Core e freio UBS.",
    colors: [{ name: "Azul", hex: "#1b46c3", image: yamahaFactorDxImg.url }],
    specs: [
      { label: "Motor", value: "150cc Blue Core" },
      { label: "Freios", value: "UBS (freio integrado)" },
      { label: "Câmbio", value: "5 marchas" },
      { label: "Painel", value: "Digital completo" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["Blue Core", "UBS", "Painel digital", "Acabamento DX"],
  },
  {
    slug: "yamaha-fz25-fazer",
    name: "Yamaha FZ25 Fazer ABS",
    tag: "Naked · 250cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Esportiva",
    speed: "Alta performance",
    power: "250cc Blue Core",
    short: "FZ25 Fazer ABS — naked esportiva Yamaha com motor 250cc Blue Core.",
    description:
      "A FZ25 Fazer ABS entrega motor 250cc Blue Core, ABS de dois canais, painel LCD e estilo agressivo. Torque e resposta rápida para o dia a dia urbano e viagens curtas.",
    colors: [{ name: "Preto", hex: "#111111", image: yamahaFz25Img.url }],
    specs: [
      { label: "Motor", value: "250cc Blue Core" },
      { label: "Freios", value: "ABS 2 canais" },
      { label: "Câmbio", value: "5 marchas" },
      { label: "Painel", value: "LCD digital" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["Blue Core", "ABS 2 canais", "Painel LCD", "Farol LED"],
  },
  {
    slug: "yamaha-xmax-300-connected",
    name: "Nova XMAX 300 Connected",
    tag: "Maxi Scooter · 300cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Rodoviária",
    speed: "Alta performance",
    power: "300cc Blue Core",
    short: "Nova XMAX 300 Connected — maxi scooter premium com conectividade Y-Connect.",
    description:
      "Maxi scooter Yamaha com motor 300cc Blue Core, ABS, TCS, painel TFT colorido, Smart Key e conectividade Y-Connect. 4 anos de garantia.",
    colors: [{ name: "Padrão Yamaha", hex: "#3a3f47", image: "https://yamahamotors.fbitsstatic.net/img/p/nova-xmax-300-connected-155942/354348-1.jpg" }],
    specs: [
      { label: "Motor", value: "300cc Blue Core" },
      { label: "Freios", value: "ABS duplo" },
      { label: "Controle", value: "TCS" },
      { label: "Painel", value: "TFT colorido" },
      { label: "Conectividade", value: "Y-Connect" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["Blue Core 300", "ABS", "TCS", "TFT", "Smart Key", "Y-Connect"],
  },
  {
    slug: "yamaha-fazer-fz15-abs-connected",
    name: "Fazer FZ15 ABS Connected 2026",
    tag: "Naked · 150cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Urbana",
    speed: "Ágil",
    power: "150cc Blue Core",
    short: "Fazer FZ15 ABS Connected — naked urbana com ABS e Y-Connect.",
    description:
      "A Fazer FZ15 ABS Connected 2026 combina motor 150cc Blue Core, freios ABS, painel LCD e conectividade Y-Connect via Bluetooth. Robusta e econômica.",
    colors: [{ name: "Padrão Yamaha", hex: "#1b1b1b", image: "https://yamahamotors.fbitsstatic.net/img/p/fazer-fz15-abs-connected-2026-151299/339824-1.jpg" }],
    specs: [
      { label: "Motor", value: "150cc Blue Core" },
      { label: "Freios", value: "ABS" },
      { label: "Câmbio", value: "5 marchas" },
      { label: "Conectividade", value: "Y-Connect" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["Blue Core", "ABS", "Y-Connect", "Painel LCD"],
  },
  {
    slug: "yamaha-fazer-fz25-connected",
    name: "Fazer FZ25 Connected",
    tag: "Naked · 250cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Esportiva",
    speed: "Alta performance",
    power: "250cc Blue Core",
    short: "Fazer FZ25 Connected — naked 250cc com conectividade Y-Connect.",
    description:
      "FZ25 Connected traz motor 250cc Blue Core, ABS 2 canais, painel digital e conectividade Y-Connect. 4 anos de garantia.",
    colors: [{ name: "Padrão Yamaha", hex: "#111111", image: "https://yamahamotors.fbitsstatic.net/img/p/fazer-fz25-connected-155370/352536-1.jpg" }],
    specs: [
      { label: "Motor", value: "250cc Blue Core" },
      { label: "Freios", value: "ABS 2 canais" },
      { label: "Câmbio", value: "5 marchas" },
      { label: "Conectividade", value: "Y-Connect" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["Blue Core", "ABS", "Y-Connect", "Painel digital"],
  },
  {
    slug: "yamaha-crosser-150-s-abs",
    name: "Crosser 150 S ABS",
    tag: "Trail · 150cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "On/Off-road",
    speed: "Versátil",
    power: "150cc Blue Core",
    short: "Crosser 150 S ABS — versatilidade on/off-road com rodas raiadas.",
    description:
      "Trail 150cc Blue Core com freios ABS, rodas raiadas, suspensão de longo curso e robustez para o dia a dia urbano e trilhas leves.",
    colors: [{ name: "Padrão Yamaha", hex: "#0a0a0a", image: "https://yamahamotors.fbitsstatic.net/img/p/crosser-150-s-abs-151343/340245-1.jpg" }],
    specs: [
      { label: "Motor", value: "150cc Blue Core" },
      { label: "Freios", value: "ABS" },
      { label: "Rodas", value: "Raiadas" },
      { label: "Câmbio", value: "5 marchas" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["ABS", "Rodas raiadas", "Painel digital", "Trail leve"],
  },
  {
    slug: "yamaha-crosser-150-z-abs",
    name: "Crosser 150 Z ABS",
    tag: "Trail · 150cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "On/Off-road",
    speed: "Versátil",
    power: "150cc Blue Core",
    short: "Crosser 150 Z ABS — versão Z com rodas de liga e acabamento premium.",
    description:
      "Versão Z da Crosser 150 traz rodas de liga leve, ABS e acabamento diferenciado, mantendo motor 150cc Blue Core e proposta on/off-road.",
    colors: [{ name: "Padrão Yamaha", hex: "#1b1b1b", image: "https://yamahamotors.fbitsstatic.net/img/p/crosser-150-z-abs-150320/337234-1.jpg" }],
    specs: [
      { label: "Motor", value: "150cc Blue Core" },
      { label: "Freios", value: "ABS" },
      { label: "Rodas", value: "Liga leve" },
      { label: "Câmbio", value: "5 marchas" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["ABS", "Rodas de liga", "Painel digital", "Trail Z"],
  },
  {
    slug: "yamaha-lander-connected",
    name: "Lander Connected",
    tag: "Trail · 250cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "On/Off-road",
    speed: "Versátil",
    power: "250cc Blue Core",
    short: "Lander Connected — trail 250cc com ABS e conectividade Y-Connect.",
    description:
      "Trail Yamaha 250cc Blue Core com ABS comutável, painel digital, conectividade Y-Connect e capacidade para trilhas e viagens.",
    colors: [{ name: "Padrão Yamaha", hex: "#1b3a6b", image: "https://yamahamotors.fbitsstatic.net/img/p/lander-connected-150305/337216-1.jpg" }],
    specs: [
      { label: "Motor", value: "250cc Blue Core" },
      { label: "Freios", value: "ABS comutável" },
      { label: "Câmbio", value: "5 marchas" },
      { label: "Conectividade", value: "Y-Connect" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["ABS comutável", "Y-Connect", "Painel digital", "Trail 250"],
  },
  {
    slug: "yamaha-tenere-700",
    name: "Ténéré 700",
    tag: "Big Trail · 700cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Aventura",
    speed: "Rodovia/Off-road",
    power: "689cc CP2",
    short: "Ténéré 700 — big trail Yamaha com DNA rally e motor CP2 689cc.",
    description:
      "Big trail com motor bicilíndrico CP2 689cc, chassi robusto, suspensão de longo curso e ABS comutável. Herança rally Dakar Yamaha.",
    colors: [{ name: "Padrão Yamaha", hex: "#1e5bd6", image: "https://yamahamotors.fbitsstatic.net/img/p/tenere-700-156320/356058-1.jpg" }],
    specs: [
      { label: "Motor", value: "689cc CP2 bicilíndrico" },
      { label: "Freios", value: "ABS comutável" },
      { label: "Câmbio", value: "6 marchas" },
      { label: "Painel", value: "TFT" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["CP2 689cc", "ABS comutável", "TFT", "Suspensão longo curso"],
  },
  {
    slug: "yamaha-r15-abs",
    name: "R15 ABS",
    tag: "Esportiva · 150cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Esportiva",
    speed: "Alta performance",
    power: "150cc VVA",
    short: "R15 ABS — esportiva 150cc com tecnologia VVA e DNA R-Series.",
    description:
      "Esportiva com motor 155cc SOHC VVA, ABS, embreagem assistida A&S, quadro Deltabox e visual inspirado na R1.",
    colors: [{ name: "Padrão Yamaha", hex: "#1e40af", image: "https://yamahamotors.fbitsstatic.net/img/p/r15-abs-151514/340944-1.jpg" }],
    specs: [
      { label: "Motor", value: "155cc SOHC VVA" },
      { label: "Freios", value: "ABS" },
      { label: "Embreagem", value: "A&S (assistida)" },
      { label: "Câmbio", value: "6 marchas" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["VVA", "ABS", "A&S", "Deltabox", "Farol LED"],
  },
  {
    slug: "yamaha-r15-abs-70th",
    name: "R15 ABS 70TH",
    tag: "Esportiva · 150cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Esportiva",
    speed: "Alta performance",
    power: "150cc VVA",
    short: "R15 ABS 70TH — edição comemorativa 70 anos Yamaha Racing.",
    description:
      "Edição comemorativa 70 anos Yamaha Racing com pintura especial Speed Block. Motor 155cc VVA, ABS e embreagem A&S.",
    colors: [{ name: "70TH Anniversary", hex: "#f5c518", image: "https://yamahamotors.fbitsstatic.net/img/p/r15-abs-70th-765196/977720-1.jpg" }],
    specs: [
      { label: "Motor", value: "155cc SOHC VVA" },
      { label: "Freios", value: "ABS" },
      { label: "Edição", value: "70th Anniversary" },
      { label: "Câmbio", value: "6 marchas" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["VVA", "ABS", "Edição 70TH", "Deltabox"],
  },
  {
    slug: "yamaha-r3-abs-connected",
    name: "R3 ABS Connected",
    tag: "Esportiva · 320cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Esportiva",
    speed: "Alta performance",
    power: "321cc bicilíndrico",
    short: "R3 ABS Connected — esportiva 321cc com Y-Connect e DNA R-Series.",
    description:
      "Esportiva com motor bicilíndrico 321cc, ABS, embreagem A&S, painel TFT e conectividade Y-Connect. Herança R-Series Yamaha.",
    colors: [{ name: "Padrão Yamaha", hex: "#1e5bd6", image: "https://yamahamotors.fbitsstatic.net/img/p/r3-abs-connected-156021/355234-1.jpg" }],
    specs: [
      { label: "Motor", value: "321cc bicilíndrico" },
      { label: "Freios", value: "ABS" },
      { label: "Embreagem", value: "A&S" },
      { label: "Painel", value: "TFT" },
      { label: "Conectividade", value: "Y-Connect" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["Bicilíndrico 321cc", "ABS", "A&S", "TFT", "Y-Connect"],
  },
  {
    slug: "yamaha-r3-abs-70th",
    name: "R3 ABS 70th",
    tag: "Esportiva · 320cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Esportiva",
    speed: "Alta performance",
    power: "321cc bicilíndrico",
    short: "R3 ABS 70th — edição especial 70 anos Yamaha Racing.",
    description:
      "Edição 70 anos Yamaha Racing com pintura Speed Block. Motor bicilíndrico 321cc, ABS, TFT e Y-Connect.",
    colors: [{ name: "70TH Anniversary", hex: "#f5c518", image: "https://yamahamotors.fbitsstatic.net/img/p/r3-abs-70th-765195/977719-1.jpg" }],
    specs: [
      { label: "Motor", value: "321cc bicilíndrico" },
      { label: "Freios", value: "ABS" },
      { label: "Edição", value: "70th Anniversary" },
      { label: "Painel", value: "TFT" },
      { label: "Conectividade", value: "Y-Connect" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["321cc", "ABS", "Edição 70TH", "TFT", "Y-Connect"],
  },
  {
    slug: "yamaha-mt-07-connected",
    name: "Nova MT-07 Connected",
    tag: "Naked · 690cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Esportiva",
    speed: "Alta performance",
    power: "689cc CP2",
    short: "Nova MT-07 Connected — hyper naked bicilíndrica CP2 689cc.",
    description:
      "Hyper naked com motor CP2 689cc bicilíndrico, ABS, TFT colorido e Y-Connect. Torque forte e comportamento ágil.",
    colors: [{ name: "Padrão Yamaha", hex: "#0f172a", image: "https://yamahamotors.fbitsstatic.net/img/p/nova-mt-07-connected-155684/353555-1.jpg" }],
    specs: [
      { label: "Motor", value: "689cc CP2 bicilíndrico" },
      { label: "Freios", value: "ABS" },
      { label: "Câmbio", value: "6 marchas" },
      { label: "Painel", value: "TFT" },
      { label: "Conectividade", value: "Y-Connect" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["CP2 689cc", "ABS", "TFT", "Y-Connect"],
  },
  {
    slug: "yamaha-mt-03-connected",
    name: "Nova MT-03 Connected",
    tag: "Naked · 320cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Esportiva",
    speed: "Alta performance",
    power: "321cc bicilíndrico",
    short: "Nova MT-03 Connected — hyper naked 321cc com Y-Connect.",
    description:
      "Hyper naked 321cc bicilíndrico, ABS, TFT e Y-Connect. Design MT agressivo e comportamento ágil.",
    colors: [{ name: "Padrão Yamaha", hex: "#1b1b1b", image: "https://yamahamotors.fbitsstatic.net/img/p/nova-mt-03-connected-155521/353244-1.jpg" }],
    specs: [
      { label: "Motor", value: "321cc bicilíndrico" },
      { label: "Freios", value: "ABS" },
      { label: "Câmbio", value: "6 marchas" },
      { label: "Painel", value: "TFT" },
      { label: "Conectividade", value: "Y-Connect" },
      { label: "Habilitação", value: "Exige CNH categoria A" },
    ],
    features: ["321cc", "ABS", "TFT", "Y-Connect"],
  },
  {
    slug: "yamaha-tt-r-230",
    name: "TT-R 230",
    tag: "Off-road · 230cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Off-road",
    speed: "Trilha",
    power: "223cc SOHC",
    short: "TT-R 230 — trilha 4T com partida elétrica e suspensão de longo curso.",
    description:
      "Motocicleta off-road com motor 223cc 4T, partida elétrica, suspensão de longo curso e chassi leve. Ideal para trilha e enduro amador.",
    colors: [{ name: "Team Yamaha Blue", hex: "#1e5bd6", image: "https://yamahamotors.fbitsstatic.net/img/p/tt-r-230-150290/337257-1.jpg" }],
    specs: [
      { label: "Motor", value: "223cc SOHC 4T" },
      { label: "Partida", value: "Elétrica" },
      { label: "Câmbio", value: "6 marchas" },
      { label: "Uso", value: "Off-road" },
    ],
    features: ["4T", "Partida elétrica", "Suspensão longo curso", "Off-road"],
  },
  {
    slug: "yamaha-pw50",
    name: "PW50",
    tag: "Off-road Kids · 50cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Kids",
    speed: "Iniciante",
    power: "50cc 2T",
    short: "PW50 — a primeira moto ideal para pilotos mirins.",
    description:
      "Off-road infantil com motor 50cc 2T, transmissão automática, freios a tambor e limitador de aceleração. Segurança e diversão para iniciantes.",
    colors: [{ name: "Team Yamaha Blue", hex: "#1e5bd6", image: "https://yamahamotors.fbitsstatic.net/img/p/pw50-150324/337238-1.jpg" }],
    specs: [
      { label: "Motor", value: "50cc 2T" },
      { label: "Transmissão", value: "Automática" },
      { label: "Uso", value: "Off-road infantil" },
    ],
    features: ["2T", "Automática", "Limitador de aceleração", "Kids"],
  },
  {
    slug: "yamaha-yz65",
    name: "YZ65",
    tag: "Motocross · 65cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Competição",
    speed: "Racing",
    power: "65cc 2T",
    short: "YZ65 — motocross júnior de competição com motor 65cc 2T.",
    description:
      "Motocross júnior com motor 65cc 2T de alta performance, suspensão KYB e chassi de competição. Formação para pilotos em ascensão.",
    colors: [{ name: "Team Yamaha Blue", hex: "#1e5bd6", image: "https://yamahamotors.fbitsstatic.net/img/p/yz65-150291/337201-1.jpg" }],
    specs: [
      { label: "Motor", value: "65cc 2T" },
      { label: "Suspensão", value: "KYB" },
      { label: "Câmbio", value: "6 marchas" },
      { label: "Uso", value: "Motocross" },
    ],
    features: ["Motocross júnior", "KYB", "Racing"],
  },
  {
    slug: "yamaha-yz85lw",
    name: "YZ85LW",
    tag: "Motocross · 85cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Competição",
    speed: "Racing",
    power: "85cc 2T",
    short: "YZ85LW — motocross 85cc com rodas grandes para pilotos em transição.",
    description:
      "Motocross 85cc 2T versão Large Wheel (LW) com rodas maiores para pilotos em transição para categorias superiores. Suspensão KYB.",
    colors: [{ name: "Team Yamaha Blue", hex: "#1e5bd6", image: "https://yamahamotors.fbitsstatic.net/img/p/yz85lw-150322/337236-1.jpg" }],
    specs: [
      { label: "Motor", value: "85cc 2T" },
      { label: "Rodas", value: "Large Wheel" },
      { label: "Suspensão", value: "KYB" },
      { label: "Uso", value: "Motocross" },
    ],
    features: ["LW", "KYB", "Racing"],
  },
  {
    slug: "yamaha-yz125",
    name: "YZ125 2025",
    tag: "Motocross · 125cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Competição",
    speed: "Racing",
    power: "125cc 2T",
    short: "YZ125 2025 — clássico motocross 125cc 2T renovado.",
    description:
      "Motocross 125cc 2T com chassi de alumínio bilateral, suspensão KYB SSS e motor de alta rotação. Ícone das pistas.",
    colors: [{ name: "Team Yamaha Blue", hex: "#1e5bd6", image: "https://yamahamotors.fbitsstatic.net/img/p/yz125-2025-157094/361839-1.jpg" }],
    specs: [
      { label: "Motor", value: "125cc 2T" },
      { label: "Chassi", value: "Alumínio bilateral" },
      { label: "Suspensão", value: "KYB SSS" },
      { label: "Uso", value: "Motocross" },
    ],
    features: ["125 2T", "KYB SSS", "Racing"],
  },
  {
    slug: "yamaha-yz250",
    name: "YZ250",
    tag: "Motocross · 250cc",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Competição",
    speed: "Racing",
    power: "250cc 2T",
    short: "YZ250 — motocross 250cc 2T de alta potência.",
    description:
      "Motocross 250cc 2T, torque forte, chassi de alumínio e suspensão KYB SSS. Referência entre as 2T de competição.",
    colors: [{ name: "Team Yamaha Blue", hex: "#1e5bd6", image: "https://yamahamotors.fbitsstatic.net/img/p/yz250-150321/337235-1.jpg" }],
    specs: [
      { label: "Motor", value: "250cc 2T" },
      { label: "Chassi", value: "Alumínio" },
      { label: "Suspensão", value: "KYB SSS" },
      { label: "Uso", value: "Motocross" },
    ],
    features: ["250 2T", "KYB SSS", "Racing"],
  },
  {
    slug: "yamaha-yz250f",
    name: "YZ250F 2025",
    tag: "Motocross · 250cc 4T",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Competição",
    speed: "Racing",
    power: "250cc 4T",
    short: "YZ250F 2025 — motocross 4T de ponta com app Power Tuner.",
    description:
      "Motocross 250cc 4T com injeção eletrônica, launch control, mapas de motor e conectividade Power Tuner via smartphone.",
    colors: [{ name: "Team Yamaha Blue", hex: "#1e5bd6", image: "https://yamahamotors.fbitsstatic.net/img/p/yz250f-2025-157217/362187-1.jpg" }],
    specs: [
      { label: "Motor", value: "250cc 4T" },
      { label: "Injeção", value: "Eletrônica" },
      { label: "App", value: "Power Tuner" },
      { label: "Suspensão", value: "KYB SSS" },
      { label: "Uso", value: "Motocross" },
    ],
    features: ["4T EFI", "Launch control", "Power Tuner", "KYB SSS"],
  },
  {
    slug: "yamaha-yz450f",
    name: "YZ450F",
    tag: "Motocross · 450cc 4T",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Competição",
    speed: "Racing",
    power: "450cc 4T",
    short: "YZ450F — motocross topo de linha 450cc 4T Yamaha.",
    description:
      "Motocross 450cc 4T com injeção eletrônica, launch control, mapas comutáveis e app Power Tuner. Máxima performance de competição.",
    colors: [{ name: "Team Yamaha Blue", hex: "#1e5bd6", image: "https://yamahamotors.fbitsstatic.net/img/p/yz450f-157341/362428-1.jpg" }],
    specs: [
      { label: "Motor", value: "450cc 4T" },
      { label: "Injeção", value: "Eletrônica" },
      { label: "App", value: "Power Tuner" },
      { label: "Suspensão", value: "KYB SSS" },
      { label: "Uso", value: "Motocross" },
    ],
    features: ["450 4T", "Launch control", "Power Tuner", "KYB SSS"],
  },
  {
    slug: "yamaha-wr250f",
    name: "WR250F 2025",
    tag: "Enduro · 250cc 4T",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Enduro",
    speed: "Off-road",
    power: "250cc 4T",
    short: "WR250F 2025 — enduro 250cc 4T com app Power Tuner.",
    description:
      "Enduro 250cc 4T com injeção eletrônica, mapas de motor, tanque de maior capacidade e conectividade Power Tuner. Preparada para longos trechos off-road.",
    colors: [{ name: "Team Yamaha Blue", hex: "#1e5bd6", image: "https://yamahamotors.fbitsstatic.net/img/p/wr250f-2025-156727/360221-1.jpg" }],
    specs: [
      { label: "Motor", value: "250cc 4T" },
      { label: "Injeção", value: "Eletrônica" },
      { label: "App", value: "Power Tuner" },
      { label: "Uso", value: "Enduro/Off-road" },
    ],
    features: ["4T EFI", "Power Tuner", "Enduro", "KYB"],
  },
  {
    slug: "yamaha-wr450f",
    name: "WR450F 2025",
    tag: "Enduro · 450cc 4T",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "Enduro",
    speed: "Off-road",
    power: "450cc 4T",
    short: "WR450F 2025 — enduro 450cc 4T topo de linha Yamaha.",
    description:
      "Enduro 450cc 4T com injeção eletrônica, mapas comutáveis, app Power Tuner e chassi otimizado para provas de longa distância.",
    colors: [{ name: "Team Yamaha Blue", hex: "#1e5bd6", image: "https://yamahamotors.fbitsstatic.net/img/p/wr450f-2025-156852/360463-1.jpg" }],
    specs: [
      { label: "Motor", value: "450cc 4T" },
      { label: "Injeção", value: "Eletrônica" },
      { label: "App", value: "Power Tuner" },
      { label: "Uso", value: "Enduro/Off-road" },
    ],
    features: ["450 4T", "Power Tuner", "Enduro", "KYB"],
  },
];

// Klug Motors - Joinville
export const WHATSAPP_NUMBER = "554734293200";
const WHATSAPP_FALLBACK_DELAY = 1800;

export function getModel(slug: string): Model | undefined {
  return models.find((m) => m.slug === slug);
}

export function buildWhatsAppUrl(message: string, phone = WHATSAPP_NUMBER): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppFallbackUrl(message: string, phone = WHATSAPP_NUMBER): string {
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}

export function openWhatsAppWithFallback(
  message: string,
  phoneOrOpts?: string | { phone?: string; source?: string; modelSlug?: string; event?: string },
): void {
  if (typeof window === "undefined") return;

  const opts =
    typeof phoneOrOpts === "string" || phoneOrOpts === undefined
      ? { phone: (phoneOrOpts as string | undefined) ?? WHATSAPP_NUMBER }
      : { phone: phoneOrOpts.phone ?? WHATSAPP_NUMBER, ...phoneOrOpts };
  const phone = opts.phone ?? WHATSAPP_NUMBER;

  // Fire-and-forget analytics — never blocks navigation
  try {
    // Lazy import so this module stays framework-agnostic
    void import("@/lib/analytics").then(({ trackEvent }) => {
      trackEvent(opts.event ?? "whatsapp_click", {
        source: opts.source,
        modelSlug: opts.modelSlug,
      });
    });
  } catch {
    /* noop */
  }

  const primaryUrl = buildWhatsAppUrl(message, phone);
  const fallbackUrl = buildWhatsAppFallbackUrl(message, phone);
  const fallbackTimer = window.setTimeout(() => {
    if (document.visibilityState === "visible") window.location.assign(fallbackUrl);
  }, WHATSAPP_FALLBACK_DELAY);

  const clearFallback = () => window.clearTimeout(fallbackTimer);


  window.addEventListener("pagehide", clearFallback, { once: true });
  window.addEventListener("blur", clearFallback, { once: true });
  window.location.assign(primaryUrl);
}

/**
 * Opens WhatsApp in a new tab (does not navigate the current page).
 * Fires a `whatsapp_redirected` analytics event by default.
 * Must be called during a user gesture (e.g. from a form submit handler)
 * to avoid popup blockers.
 */
export function openWhatsAppNewTab(
  message: string,
  opts: { phone?: string; source?: string; modelSlug?: string; event?: string; meta?: Record<string, unknown> } = {},
): Window | null {
  if (typeof window === "undefined") return null;
  const phone = opts.phone ?? WHATSAPP_NUMBER;
  try {
    void import("@/lib/analytics").then(({ trackEvent }) => {
      trackEvent(opts.event ?? "whatsapp_redirected", {
        source: opts.source,
        modelSlug: opts.modelSlug,
        meta: opts.meta,
      });
    });
  } catch { /* noop */ }
  const url = buildWhatsAppUrl(message, phone);
  return window.open(url, "_blank", "noopener,noreferrer");
}


/** Modelo semi novo (usado, tag/slug ou coluna condition). */
export function isSemiNovaModel(m: Pick<Model, "slug" | "tag"> & { condition?: string }): boolean {
  return (
    m.condition === "semi_nova" ||
    m.slug.startsWith("semi-nova") ||
    /semi\s*nova/i.test(m.tag ?? "")
  );
}

/** Triciclo elétrico. */
export function isTricicloModel(m: Pick<Model, "tag">): boolean {
  return (m.tag ?? "").toLowerCase().includes("triciclo");
}

/**
 * A parcela prevista só é exibida para scooters Moto Chefe (klug),
 * SUDU e triciclos elétricos. Yamaha 0km e semi novas mostram só o valor.
 */
export function supportsInstallment(
  m: Pick<Model, "slug" | "tag"> & { condition?: string },
): boolean {
  if (isSemiNovaModel(m)) return false;
  if (isTricicloModel(m)) return true;
  if (m.slug.startsWith("yamaha")) return false;
  return true;
}
