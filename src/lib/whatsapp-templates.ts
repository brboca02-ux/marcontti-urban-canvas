/**
 * Templates parametrizados de mensagens do WhatsApp.
 *
 * Objetivo: manter formatação consistente em todos os pontos de contato
 * (formulários, CTAs, admin) e concentrar a lógica de campos condicionais
 * em um único lugar.
 */

// ---------- Utilitários de formatação ----------

const clean = (v: unknown): string =>
  v === undefined || v === null ? "" : String(v).trim();

/** Formata uma linha "*Rótulo:* valor" ou retorna null se vazio. */
function line(label: string, value: unknown): string | null {
  const v = clean(value);
  return v ? `*${label}:* ${v}` : null;
}

/** Junta linhas descartando vazios/nulos. */
function joinLines(lines: Array<string | null | undefined>): string {
  return lines.filter((l): l is string => Boolean(l && l.length)).join("\n");
}

/** Máscara de CPF: 000.000.000-00 */
export function formatCPF(raw: string): string {
  const d = clean(raw).replace(/\D+/g, "").slice(0, 11);
  if (d.length !== 11) return d;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/** Máscara de CEP: 00000-000 */
export function formatCEP(raw: string): string {
  const d = clean(raw).replace(/\D+/g, "").slice(0, 8);
  if (d.length !== 8) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

/** Data ISO (YYYY-MM-DD) → DD/MM/AAAA. Aceita já formatado. */
export function formatDateBR(raw: string): string {
  const v = clean(raw);
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
  return v;
}

// ---------- Tipos do payload ----------

export type PaymentType = "Financiamento" | "À vista" | "Cartão de crédito";

export interface FinanciamentoAddress {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface FinanciamentoTemplateData {
  // Contato (sempre obrigatório)
  name: string;
  phone: string;
  email: string;

  // Interesse
  model: string;
  paymentType: PaymentType;
  message?: string;

  // Financiamento (obrigatório quando paymentType === "Financiamento")
  entry?: string;
  term?: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  income?: string;
  address?: FinanciamentoAddress;

  // Metadados opcionais
  protocol?: string;
  origin?: string;
}

// ---------- Cabeçalho ----------

const HEADERS: Record<PaymentType, string> = {
  Financiamento:
    "Olá! Quero simular um *financiamento* de moto elétrica na Klug Motors.",
  "À vista":
    "Olá! Quero fechar uma moto elétrica *à vista* na Klug Motors.",
  "Cartão de crédito":
    "Olá! Quero comprar uma moto elétrica *no cartão* na Klug Motors.",
};

// ---------- Blocos ----------

function contactBlock(d: FinanciamentoTemplateData): string {
  return joinLines([
    line("Nome", d.name),
    line("WhatsApp", d.phone),
    line("E-mail", d.email),
  ]);
}

function interestBlock(d: FinanciamentoTemplateData): string {
  const paymentLine =
    d.paymentType === "Financiamento"
      ? `*Financiamento* — entrada: ${clean(d.entry) || "a definir"} · prazo: ${clean(d.term) || "a definir"}`
      : `*Forma de pagamento:* ${d.paymentType}`;

  return joinLines([
    line("Modelo", d.model),
    paymentLine,
  ]);
}

function creditAnalysisBlock(d: FinanciamentoTemplateData): string | null {
  if (d.paymentType !== "Financiamento") return null;

  const a = d.address ?? {};
  const streetLine = [
    clean(a.street),
    clean(a.number) && `nº ${clean(a.number)}`,
    clean(a.complement),
  ]
    .filter(Boolean)
    .join(", ");

  const cityLine = [clean(a.neighborhood), clean(a.city), clean(a.state)]
    .filter(Boolean)
    .join(" · ");

  const addressFull = joinLines([
    streetLine || null,
    cityLine || null,
    a.zip ? `CEP ${formatCEP(a.zip)}` : null,
  ]);

  return joinLines([
    "",
    "*— Dados para análise de crédito —*",
    line("CPF", d.cpf ? formatCPF(d.cpf) : ""),
    line("RG", d.rg),
    line("Data de nascimento", d.birthDate ? formatDateBR(d.birthDate) : ""),
    line("Renda mensal", d.income),
    addressFull ? `*Endereço:*\n${addressFull}` : null,
    "",
    "_Autorizo o tratamento destes dados conforme a LGPD._",
  ]);
}

function footerBlock(d: FinanciamentoTemplateData): string | null {
  return joinLines([
    d.message ? `\n*Observações:* ${clean(d.message)}` : null,
    d.protocol ? `\n_Protocolo: ${d.protocol}_` : null,
    d.origin ? `_Origem: ${d.origin}_` : null,
  ]);
}

// ---------- API pública ----------

/**
 * Monta a mensagem completa do WhatsApp para o formulário de Financiamento.
 * O bloco de análise de crédito só é incluído quando `paymentType === "Financiamento"`.
 */
export function buildFinanciamentoMessage(d: FinanciamentoTemplateData): string {
  const parts: Array<string | null> = [
    HEADERS[d.paymentType],
    "",
    contactBlock(d),
    "",
    interestBlock(d),
    creditAnalysisBlock(d),
    footerBlock(d),
  ];
  return parts
    .filter((p): p is string => p !== null && p !== undefined)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n") // colapsa múltiplas quebras
    .trim();
}
