/** Prévia de parcela no boleto — cálculo Price usado apenas para exibição. */
export const INSTALLMENT_MONTHS = 71;
export const INSTALLMENT_RATE = 0.0258; // juros ao mês
export const INSTALLMENT_NOTE = "prévia de parcela no boleto (juros 2,58% a.m.)";

export function fmtBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Parcela pela tabela Price. */
export function pmt(pv: number, i = INSTALLMENT_RATE, n = INSTALLMENT_MONTHS) {
  if (!pv || pv <= 0 || !n || n <= 0) return 0;
  if (i <= 0) return pv / n;
  return (pv * i) / (1 - Math.pow(1 + i, -n));
}

/** Retorna a parcela prevista formatada ou null quando não há preço. */
export function installmentLabel(priceNumber: number, months = INSTALLMENT_MONTHS) {
  if (!priceNumber || priceNumber <= 0) return null;
  return `${months}x ${fmtBRL(pmt(priceNumber, INSTALLMENT_RATE, months))}`;
}

type InstallmentSource = {
  priceNumber?: number;
  installmentMonths?: number;
  installmentValue?: number;
  installmentNote?: string;
};

/**
 * Parcela do modelo respeitando o que o admin cadastrou:
 * nº de parcelas, valor fixo da parcela (opcional) e texto da observação.
 */
export function modelInstallment(m: InstallmentSource) {
  const months = m.installmentMonths && m.installmentMonths > 0 ? m.installmentMonths : INSTALLMENT_MONTHS;
  const note = m.installmentNote?.trim() || INSTALLMENT_NOTE;
  const value =
    m.installmentValue && m.installmentValue > 0
      ? m.installmentValue
      : m.priceNumber && m.priceNumber > 0
        ? pmt(m.priceNumber, INSTALLMENT_RATE, months)
        : 0;
  if (!value) return { label: null as string | null, note, months };
  return { label: `${months}x ${fmtBRL(value)}`, note, months };
}
