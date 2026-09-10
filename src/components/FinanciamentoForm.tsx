import { useState } from "react";
import { toast } from "sonner";

import { ArrowRight, Loader2, CheckCircle2, MessageCircle, RotateCcw, AlertCircle } from "lucide-react";
import { z } from "zod";
import { models, openWhatsAppWithFallback, openWhatsAppNewTab, buildWhatsAppFallbackUrl } from "@/lib/models";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { buildFinanciamentoMessage } from "@/lib/whatsapp-templates";
import { getAttribution, getOriginPage } from "@/lib/attribution";

const PAYMENT_TYPES = ["Financiamento", "À vista", "Cartão de crédito"] as const;
type PaymentType = (typeof PAYMENT_TYPES)[number];

const onlyDigits = (s: string) => s.replace(/\D+/g, "");

const cpfSchema = z
  .string()
  .transform(onlyDigits)
  .refine((v) => v.length === 11, "CPF deve ter 11 dígitos");

const baseSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  phone: z
    .string()
    .trim()
    .min(8, "Telefone inválido")
    .max(20)
    .regex(/^[0-9()\s+-]+$/, "Use apenas números"),
  email: z.string().trim().email("E-mail inválido").max(255),
  model: z.string().min(1, "Escolha um modelo"),
  paymentType: z.enum(PAYMENT_TYPES, { message: "Escolha a forma de pagamento" }),
  entry: z.string().optional(),
  term: z.string().optional(),
  message: z.string().trim().max(500).optional(),
});

const entries = [
  "Sem entrada",
  "Até R$ 1.500",
  "R$ 1.500 – R$ 3.000",
  "R$ 3.000 – R$ 5.000",
  "Acima de R$ 5.000",
];

const terms = ["12x", "18x", "24x", "36x", "A combinar"];

const incomes = [
  "Até R$ 1.500",
  "R$ 1.500 – R$ 3.000",
  "R$ 3.000 – R$ 5.000",
  "R$ 5.000 – R$ 10.000",
  "Acima de R$ 10.000",
];



export function FinanciamentoForm({
  defaultModel,
  compact = false,
}: {
  defaultModel?: string;
  compact?: boolean;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentType | "">("");
  const [lgpd, setLgpd] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [neighborhoodOptions, setNeighborhoodOptions] = useState<string[]>([]);



  const isFinancing = paymentType === "Financiamento";

  const setFieldValue = (id: string, value: string) => {
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
    if (el) el.value = value;
  };

  // Preserva edições manuais: só sobrescreve se o campo estiver vazio
  // ou tiver sido preenchido automaticamente antes (e não editado pelo usuário).
  const fillIfEditable = (
    id: string,
    value: string,
    opts: { onlyIfEmpty?: boolean } = {}
  ) => {
    const el = document.getElementById(id) as (HTMLInputElement | HTMLSelectElement) & { dataset: DOMStringMap } | null;
    if (!el) return;
    const isAutofilled = el.dataset.autofilled === "true";
    const isEmpty = !el.value;
    if (opts.onlyIfEmpty && !isEmpty) return;
    if (!isEmpty && !isAutofilled) return; // usuário editou manualmente — não sobrescreve
    el.value = value;
    el.dataset.autofilled = value ? "true" : "";
  };

  // Handler para marcar como "editado manualmente" quando o usuário digita/altera
  const markUserEdited = (e: React.SyntheticEvent<HTMLInputElement | HTMLSelectElement>) => {
    (e.currentTarget as HTMLElement).dataset.autofilled = "";
  };


  const maskCep = (v: string) => {
    const d = v.replace(/\D+/g, "").slice(0, 8);
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.currentTarget.value = maskCep(e.currentTarget.value);
    // Limpa erro assim que o usuário edita novamente
    if (cepError) setCepError(null);
    // Auto-lookup ao completar 8 dígitos (silencioso — sem toast)
    const digits = e.currentTarget.value.replace(/\D+/g, "");
    if (digits.length === 8) void lookupCep(digits, { notify: false });
  };

  const handleCepBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const digits = e.currentTarget.value.replace(/\D+/g, "");
    if (digits.length === 0) return;
    if (digits.length !== 8) {
      setCepError("CEP incompleto — informe os 8 dígitos");
      return;
    }
    void lookupCep(digits, { notify: true });
  };

  const fetchNeighborhoodSuggestions = async (uf?: string, city?: string, street?: string) => {
    if (!uf || !city) return;
    try {
      // ViaCEP requires street >= 3 chars; use street prefix when available, else common fallback tokens
      const prefixes = street && street.length >= 3
        ? [street.slice(0, Math.min(street.length, 6))]
        : ["rua", "avenida", "travessa"];
      const bairros = new Set<string>();
      await Promise.all(
        prefixes.map(async (p) => {
          const url = `https://viacep.com.br/ws/${encodeURIComponent(uf)}/${encodeURIComponent(city)}/${encodeURIComponent(p)}/json/`;
          const r = await fetch(url);
          if (!r.ok) return;
          const arr = (await r.json()) as Array<{ bairro?: string }>;
          if (!Array.isArray(arr)) return;
          arr.forEach((it) => {
            if (it.bairro) bairros.add(it.bairro);
          });
        })
      );

      setNeighborhoodOptions(Array.from(bairros).sort((a, b) => a.localeCompare(b, "pt-BR")).slice(0, 50));

    } catch {
      // silencioso — autocomplete é opcional
    }
  };

  const lookupCep = async (digits: string, opts: { notify: boolean }) => {

    setCepError(null);
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data?.erro) {
        const msg = "CEP não encontrado. Verifique e tente novamente.";
        setCepError(msg);
        if (opts.notify) toast.error(msg);
        return;
      }
      // Rua/bairro/complemento respeitam edições manuais…
      fillIfEditable("fin-address_street", data.logradouro ?? "");
      fillIfEditable("fin-address_neighborhood", data.bairro ?? "");
      fillIfEditable("fin-address_complement", data.complemento ?? "", { onlyIfEmpty: true });
      // …mas cidade e UF são determinadas pelo CEP: sempre sobrescreve para manter consistência.
      setFieldValue("fin-address_city", data.localidade ?? "");
      setFieldValue("fin-address_state", (data.uf ?? "").toUpperCase());
      const cityEl = document.getElementById("fin-address_city") as HTMLInputElement | null;
      const stateEl = document.getElementById("fin-address_state") as HTMLSelectElement | null;
      if (cityEl) cityEl.dataset.autofilled = "true";
      if (stateEl) stateEl.dataset.autofilled = "true";


      if (opts.notify) toast.success("Endereço preenchido pelo CEP");
      (document.getElementById("fin-address_number") as HTMLInputElement | null)?.focus();

      // Carrega sugestões de bairro/cidade para autocomplete
      void fetchNeighborhoodSuggestions(data.uf, data.localidade, data.logradouro);

    } catch {
      const msg = "Não foi possível consultar o CEP agora. Preencha manualmente.";
      setCepError(msg);
      if (opts.notify) toast.error(msg);
    } finally {
      setCepLoading(false);
    }
  };



  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      model: String(fd.get("model") ?? ""),
      paymentType: String(fd.get("paymentType") ?? "") as PaymentType,
      entry: String(fd.get("entry") ?? ""),
      term: String(fd.get("term") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const parsed = baseSchema.safeParse(raw);
    const errs: Record<string, string> = {};
    if (!parsed.success) {
      parsed.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
    }
    const d = parsed.success ? parsed.data : (raw as unknown as z.infer<typeof baseSchema>);

    // Financiamento extras
    let cpfDigits = "";
    let rg = "";
    let birthDate = "";
    let income = "";
    const addr = {
      street: String(fd.get("address_street") ?? "").trim(),
      number: String(fd.get("address_number") ?? "").trim(),
      complement: String(fd.get("address_complement") ?? "").trim(),
      neighborhood: String(fd.get("address_neighborhood") ?? "").trim(),
      city: String(fd.get("address_city") ?? "").trim(),
      state: String(fd.get("address_state") ?? "").trim(),
      zip: onlyDigits(String(fd.get("address_zip") ?? "")),
    };

    if (d.paymentType === "Financiamento") {
      if (!d.entry) errs.entry = "Selecione uma entrada";
      if (!d.term) errs.term = "Selecione um prazo";

      const cpfParse = cpfSchema.safeParse(String(fd.get("cpf") ?? ""));
      if (!cpfParse.success) errs.cpf = cpfParse.error.issues[0].message;
      else cpfDigits = cpfParse.data;

      rg = String(fd.get("rg") ?? "").trim();
      if (rg.length < 5) errs.rg = "Informe o RG";

      birthDate = String(fd.get("birth_date") ?? "");
      if (!birthDate) errs.birth_date = "Informe a data de nascimento";

      income = String(fd.get("income") ?? "");
      if (!income) errs.income = "Selecione sua renda";

      if (!addr.street) errs.address_street = "Informe a rua";
      if (!addr.number) errs.address_number = "Nº";
      if (!addr.neighborhood) errs.address_neighborhood = "Bairro";
      if (!addr.city) errs.address_city = "Cidade";
      if (!addr.state) errs.address_state = "UF";
      if (addr.zip.length !== 8) errs.address_zip = "CEP inválido";
      if (cepError) errs.address_zip = cepError;
      if (cepLoading) errs.address_zip = "Aguarde a consulta do CEP finalizar";
    }

    if (!lgpd) errs.lgpd = "É necessário aceitar o compartilhamento dos dados";

    if (Object.keys(errs).length) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      const el = document.getElementById(`fin-${firstKey}`) as HTMLElement | null;
      el?.focus();
      return;
    }

    setErrors({});
    setSaveError(null);
    setSubmitting(true);

    // Abre a aba do WhatsApp AGORA (dentro do gesto do usuário) para evitar bloqueio de pop-up.
    const waWindow = typeof window !== "undefined" ? window.open("about:blank", "_blank", "noopener,noreferrer") : null;

    const text = buildFinanciamentoMessage({
      name: d.name,
      phone: d.phone,
      email: d.email,
      model: d.model,
      paymentType: d.paymentType,
      message: d.message,
      entry: d.entry,
      term: d.term,
      cpf: cpfDigits,
      rg,
      birthDate,
      income,
      address: addr,
    });

    const attr = getAttribution();
    const originPage = getOriginPage();

    const { error } = await supabase.from("leads").insert({
      name: d.name,
      phone: d.phone,
      email: d.email,
      model: d.model,
      payment_type: d.paymentType,
      entry: d.paymentType === "Financiamento" ? d.entry : null,
      term: d.paymentType === "Financiamento" ? d.term : null,
      message: d.message || null,
      source: "financiamento",
      cpf: d.paymentType === "Financiamento" ? cpfDigits : null,
      rg: d.paymentType === "Financiamento" ? rg : null,
      birth_date: d.paymentType === "Financiamento" ? birthDate : null,
      income: d.paymentType === "Financiamento" ? income : null,
      address_street: d.paymentType === "Financiamento" ? addr.street : null,
      address_number: d.paymentType === "Financiamento" ? addr.number : null,
      address_complement: d.paymentType === "Financiamento" ? (addr.complement || null) : null,
      address_neighborhood: d.paymentType === "Financiamento" ? addr.neighborhood : null,
      address_city: d.paymentType === "Financiamento" ? addr.city : null,
      address_state: d.paymentType === "Financiamento" ? addr.state.toUpperCase() : null,
      address_zip: d.paymentType === "Financiamento" ? addr.zip : null,
      lgpd_consent: lgpd,
      lgpd_consent_at: lgpd ? new Date().toISOString() : null,
      utm_source: attr.utm_source,
      utm_medium: attr.utm_medium,
      utm_campaign: attr.utm_campaign,
      utm_term: attr.utm_term,
      utm_content: attr.utm_content,
      referrer: attr.referrer,
      landing_page: attr.landing_page,
      origin_page: originPage,
    });

    setSubmitting(false);

    if (error) {
      setSaveError("Não foi possível salvar sua solicitação. Tente novamente ou envie pelo WhatsApp.");
      setLastMessage(text);
      if (waWindow) waWindow.close();
      return;
    }

    setLastMessage(text);
    setSent(true);
    trackEvent("financiamento_submit", {
      source: "financiamento_form",
      meta: { model: d.model, payment_type: d.paymentType, entry: d.entry, term: d.term },
    });
    const waUrl = buildWhatsAppFallbackUrl(text);
    // O evento é disparado UMA única vez por envio: aqui (aba pré-aberta) ou
    // dentro de openWhatsAppNewTab (fallback), nunca nos dois caminhos.
    if (waWindow && !waWindow.closed) {
      waWindow.location.href = waUrl;
      trackEvent("whatsapp_redirected", {
        source: "financiamento_form",
        meta: { name: d.name, phone: d.phone, model: d.model, payment_type: d.paymentType },
      });
    } else {
      openWhatsAppNewTab(text, {
        source: "financiamento_form",
        event: "whatsapp_redirected",
        meta: { name: d.name, phone: d.phone, model: d.model, payment_type: d.paymentType },
      });
    }
  }

  function reset() {
    setSent(false);
    setLastMessage(null);
    setSaveError(null);
    setErrors({});
    setPaymentType("");
    setLgpd(false);
  }

  const inputCls =
    "w-full bg-background border border-border px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-0 transition-all";
  const labelCls =
    "block text-[10px] uppercase font-display font-black text-white/70 tracking-widest mb-2";

  if (sent) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={
          compact
            ? "space-y-4"
            : "bg-card border border-border p-8 sm:p-10 animate-fade-up"
        }
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 grid place-items-center border border-primary text-primary mb-5 animate-pulse-ring">
            <CheckCircle2 size={26} />
          </div>
          <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-3">
            Solicitação recebida
          </p>
          <h3 className="font-display font-black uppercase text-2xl sm:text-3xl tracking-tight mb-3">
            Obrigado! Já recebemos seus dados
          </h3>
          <p className="text-white/70 text-sm max-w-sm mb-6">
            Nossa equipe entrará em contato em breve pelo WhatsApp, telefone ou e-mail informado.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => lastMessage && openWhatsAppWithFallback(lastMessage)}
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-display font-black uppercase text-xs tracking-widest px-6 py-3 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(37,211,102,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <MessageCircle size={16} fill="white" strokeWidth={0} />
              Enviar pelo WhatsApp
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 border border-border text-white/80 hover:border-primary hover:text-primary font-display font-black uppercase text-xs tracking-widest px-6 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <RotateCcw size={14} />
              Nova solicitação
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Solicitar proposta"
      className={
        compact
          ? "space-y-4"
          : "bg-card border border-border p-8 sm:p-10"
      }
    >
      {!compact && (
        <div className="mb-8">
          <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-3">
            Consulte agora
          </p>
          <h3 className="font-display font-black uppercase text-2xl sm:text-3xl tracking-tight mb-2">
            Solicite sua proposta
          </h3>
          <p className="text-white/60 text-sm">
            Escolha a forma de pagamento. Se optar por financiamento, preencha os dados para análise de crédito.
          </p>
        </div>
      )}

      {saveError && (
        <div role="alert" className="mb-5 flex items-start gap-2 border border-destructive/50 bg-destructive/10 text-destructive text-xs p-3 rounded-md">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{saveError}</span>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label htmlFor="fin-name" className={labelCls}>Nome completo</label>
          <input
            id="fin-name"
            name="name"
            maxLength={100}
            placeholder="Como podemos te chamar?"
            className={inputCls}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.name}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="fin-phone" className={labelCls}>WhatsApp</label>
            <input
              id="fin-phone"
              name="phone"
              type="tel"
              maxLength={20}
              placeholder="(DDD) + número"
              className={inputCls}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="fin-email" className={labelCls}>E-mail</label>
            <input
              id="fin-email"
              name="email"
              type="email"
              maxLength={255}
              placeholder="voce@email.com"
              className={inputCls}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="fin-model" className={labelCls}>Modelo de interesse</label>
          <select
            id="fin-model"
            name="model"
            defaultValue={defaultModel ?? ""}
            className={inputCls}
            aria-invalid={!!errors.model}
          >
            <option value="" disabled>Selecione um modelo</option>
            {models.map((m) => (
              <option key={m.slug} value={m.name}>{m.name}</option>
            ))}
            <option>Outro / Catálogo completo</option>
          </select>
          {errors.model && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.model}</p>}
        </div>

        <div>
          <span className={labelCls}>Forma de pagamento</span>
          <div
            id="fin-paymentType"
            role="radiogroup"
            aria-invalid={!!errors.paymentType}
            className="grid grid-cols-1 sm:grid-cols-3 gap-2"
          >
            {PAYMENT_TYPES.map((p) => {
              const active = paymentType === p;
              return (
                <label
                  key={p}
                  className={`cursor-pointer border px-4 py-3 text-center text-xs font-display font-black uppercase tracking-widest transition-all ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-white/80 hover:border-primary/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentType"
                    value={p}
                    className="sr-only"
                    checked={active}
                    onChange={() => setPaymentType(p)}
                  />
                  {p}
                </label>
              );
            })}
          </div>
          {errors.paymentType && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.paymentType}</p>}
        </div>

        {isFinancing && (
          <>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="fin-entry" className={labelCls}>Entrada estimada</label>
                <select
                  id="fin-entry"
                  name="entry"
                  defaultValue=""
                  className={inputCls}
                  aria-invalid={!!errors.entry}
                >
                  <option value="" disabled>Selecione</option>
                  {entries.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                {errors.entry && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.entry}</p>}
              </div>
              <div>
                <label htmlFor="fin-term" className={labelCls}>Prazo desejado</label>
                <select
                  id="fin-term"
                  name="term"
                  defaultValue=""
                  className={inputCls}
                  aria-invalid={!!errors.term}
                >
                  <option value="" disabled>Selecione</option>
                  {terms.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                {errors.term && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.term}</p>}
              </div>
            </div>

            <div className="border border-border/70 p-5 space-y-5">
              <div>
                <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-1">
                  Dados para análise de crédito
                </p>
                <p className="text-xs text-white/60">
                  Suas informações são usadas apenas para análise de financiamento e ficam protegidas conforme a LGPD.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="fin-cpf" className={labelCls}>CPF</label>
                  <input
                    id="fin-cpf"
                    name="cpf"
                    inputMode="numeric"
                    maxLength={14}
                    placeholder="000.000.000-00"
                    className={inputCls}
                    aria-invalid={!!errors.cpf}
                  />
                  {errors.cpf && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.cpf}</p>}
                </div>
                <div>
                  <label htmlFor="fin-rg" className={labelCls}>RG</label>
                  <input
                    id="fin-rg"
                    name="rg"
                    maxLength={20}
                    placeholder="Número + órgão emissor"
                    className={inputCls}
                    aria-invalid={!!errors.rg}
                  />
                  {errors.rg && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.rg}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="fin-birth_date" className={labelCls}>Data de nascimento</label>
                  <input
                    id="fin-birth_date"
                    name="birth_date"
                    type="date"
                    className={inputCls}
                    aria-invalid={!!errors.birth_date}
                  />
                  {errors.birth_date && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.birth_date}</p>}
                </div>
                <div>
                  <label htmlFor="fin-income" className={labelCls}>Renda mensal</label>
                  <select
                    id="fin-income"
                    name="income"
                    defaultValue=""
                    className={inputCls}
                    aria-invalid={!!errors.income}
                  >
                    <option value="" disabled>Selecione</option>
                    {incomes.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  {errors.income && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.income}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] uppercase font-display font-black text-white/70 tracking-widest">
                  Endereço completo
                </p>

                <div className="grid sm:grid-cols-[1fr_120px] gap-5">
                  <div>
                    <label htmlFor="fin-address_zip" className={labelCls}>
                      CEP {cepLoading && <span className="ml-2 text-white/60 normal-case">consultando…</span>}
                    </label>
                    <input
                      id="fin-address_zip"
                      name="address_zip"
                      inputMode="numeric"
                      maxLength={9}
                      placeholder="00000-000"
                      className={inputCls}
                      aria-invalid={!!errors.address_zip || !!cepError}
                      onChange={handleCepChange}
                      onBlur={handleCepBlur}
                    />

                    {errors.address_zip || cepError ? (
                      <p role="alert" className="text-xs text-destructive mt-1.5">
                        {errors.address_zip ?? cepError}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Preenchemos rua, bairro, cidade e UF pelo CEP — você pode editar qualquer campo manualmente.
                      </p>
                    )}
                  </div>


                  <div>
                    <label htmlFor="fin-address_state" className={labelCls}>UF</label>
                    <input
                      id="fin-address_state"
                      name="address_state"
                      maxLength={2}
                      readOnly
                      placeholder="—"
                      className={`${inputCls} bg-muted/50 cursor-not-allowed uppercase`}
                      aria-invalid={!!errors.address_state}
                      title="UF é preenchida automaticamente pelo CEP para garantir consistência"
                    />
                    {errors.address_state && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.address_state}</p>}
                  </div>


                </div>

                <div className="grid sm:grid-cols-[1fr_120px] gap-5">
                  <div>
                    <label htmlFor="fin-address_street" className={labelCls}>Rua / Logradouro</label>
                    <input
                      id="fin-address_street"
                      name="address_street"
                      maxLength={150}
                      placeholder="Ex.: Rua das Palmeiras"
                      className={inputCls}
                      aria-invalid={!!errors.address_street}
                      onInput={markUserEdited}

                    />
                    {errors.address_street && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.address_street}</p>}
                  </div>
                  <div>
                    <label htmlFor="fin-address_number" className={labelCls}>Número</label>
                    <input
                      id="fin-address_number"
                      name="address_number"
                      maxLength={10}
                      placeholder="123"
                      className={inputCls}
                      aria-invalid={!!errors.address_number}
                    />
                    {errors.address_number && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.address_number}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="fin-address_complement" className={labelCls}>Complemento (opcional)</label>
                    <input
                      id="fin-address_complement"
                      name="address_complement"
                      maxLength={80}
                      placeholder="Apto, bloco, etc."
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor="fin-address_neighborhood" className={labelCls}>Bairro</label>
                    <input
                      id="fin-address_neighborhood"
                      name="address_neighborhood"
                      maxLength={80}
                      placeholder="Bairro"
                      className={inputCls}
                      aria-invalid={!!errors.address_neighborhood}
                      onInput={markUserEdited}
                      list="fin-neighborhood-options"
                      autoComplete="address-level3"
                    />
                    <datalist id="fin-neighborhood-options">
                      {neighborhoodOptions.map((b) => (
                        <option key={b} value={b} />
                      ))}
                    </datalist>

                    {errors.address_neighborhood && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.address_neighborhood}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="fin-address_city" className={labelCls}>Cidade</label>
                  <input
                    id="fin-address_city"
                    name="address_city"
                    maxLength={80}
                    placeholder="Preenchida pelo CEP"
                    readOnly
                    className={`${inputCls} bg-muted/50 cursor-not-allowed`}
                    aria-invalid={!!errors.address_city}
                    title="Cidade é preenchida automaticamente pelo CEP para garantir consistência"
                  />
                  {errors.address_city && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.address_city}</p>}
                </div>

              </div>

            </div>
          </>
        )}

        <label
          htmlFor="fin-lgpd"
          className={`flex items-start gap-3 cursor-pointer border p-4 transition-colors ${
            errors.lgpd ? "border-destructive/60" : "border-border hover:border-primary/60"
          }`}
        >
          <input
            id="fin-lgpd"
            type="checkbox"
            checked={lgpd}
            onChange={(e) => {
              setLgpd(e.currentTarget.checked);
              if (e.currentTarget.checked) {
                setErrors((prev) => {
                  const n = { ...prev };
                  delete n.lgpd;
                  return n;
                });
              }
            }}
            className="mt-0.5 h-4 w-4 accent-primary shrink-0"
          />
          <span className="text-xs text-white/80 leading-relaxed">
            Autorizo a Klug Motors a coletar, tratar e compartilhar meus dados pessoais com instituições financeiras parceiras para análise de crédito e formalização do financiamento, conforme a{" "}
            <strong className="text-white">Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018)</strong>. Confirmo que as informações fornecidas são verdadeiras.
          </span>
        </label>
        {errors.lgpd && <p role="alert" className="text-xs text-destructive -mt-2">{errors.lgpd}</p>}

        <div>
          <label htmlFor="fin-msg" className={labelCls}>Observações (opcional)</label>
          <textarea
            id="fin-msg"
            name="message"
            rows={3}
            maxLength={500}
            placeholder="Conte-nos mais sobre o que você procura"
            className={`${inputCls} resize-none`}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary hover:bg-primary-glow disabled:opacity-70 disabled:cursor-not-allowed text-primary-foreground font-display font-black uppercase text-sm tracking-widest py-4 transition-all hover:shadow-[var(--shadow-ember)] hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              <span>Enviando…</span>
            </>
          ) : (
            <>
              Enviar solicitação <ArrowRight size={18} />
            </>
          )}
        </button>
        <p className="text-[10px] text-white/60 text-center uppercase tracking-widest">
          Seus dados são tratados com sigilo conforme a LGPD
        </p>
      </div>
    </form>
  );
}
