import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { Loader2, CheckCircle2, MessageCircle, RotateCcw, AlertCircle, ArrowRight } from "lucide-react";
import { z } from "zod";
import { models, openWhatsAppWithFallback, openWhatsAppNewTab, buildWhatsAppFallbackUrl } from "@/lib/models";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { getAttribution, getOriginPage } from "@/lib/attribution";

const CREDIT_RANGES = [
  "Até R$ 10.000",
  "R$ 10.000 – R$ 20.000",
  "R$ 20.000 – R$ 35.000",
  "R$ 35.000 – R$ 50.000",
  "Acima de R$ 50.000",
] as const;

const MONTHLY_BUDGETS = [
  "Até R$ 300",
  "R$ 300 – R$ 500",
  "R$ 500 – R$ 800",
  "R$ 800 – R$ 1.200",
  "Acima de R$ 1.200",
] as const;

const CONTEMPLATION = ["Sorteio", "Lance", "Sorteio ou Lance", "Ainda não sei"] as const;

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  phone: z
    .string()
    .trim()
    .min(8, "Telefone inválido")
    .max(20)
    .regex(/^[0-9()\s+-]+$/, "Use apenas números"),
  email: z.string().trim().email("E-mail inválido").max(255),
  model: z.string().min(1, "Escolha um modelo"),
  credit: z.enum(CREDIT_RANGES, { message: "Selecione o valor da carta" }),
  budget: z.enum(MONTHLY_BUDGETS, { message: "Selecione o orçamento mensal" }),
  contemplation: z.enum(CONTEMPLATION, { message: "Selecione a preferência" }),
  message: z.string().trim().max(500).optional(),
  lgpd: z.literal(true, { message: "É necessário aceitar o tratamento de dados" }),
});

export function ConsorcioForm({
  defaultModel,
  compact = true,
}: {
  defaultModel?: string;
  compact?: boolean;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [summary, setSummary] = useState<z.infer<typeof schema> | null>(null);
  const [sentAt, setSentAt] = useState<Date | null>(null);
  const [protocol, setProtocol] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      model: String(fd.get("model") ?? ""),
      credit: String(fd.get("credit") ?? "") as (typeof CREDIT_RANGES)[number],
      budget: String(fd.get("budget") ?? "") as (typeof MONTHLY_BUDGETS)[number],
      contemplation: String(fd.get("contemplation") ?? "") as (typeof CONTEMPLATION)[number],
      message: String(fd.get("message") ?? ""),
      lgpd: fd.get("lgpd") === "on",
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      const el = document.getElementById(`con-${firstKey}`) as HTMLElement | null;
      el?.focus();
      return;
    }
    const d = parsed.data;

    setErrors({});
    setSaveError(null);
    setSubmitting(true);

    // Abre a aba do WhatsApp AGORA (dentro do gesto do usuário) para evitar bloqueio de pop-up.
    // A URL final é definida após o insert.
    const waWindow = typeof window !== "undefined" ? window.open("about:blank", "_blank", "noopener,noreferrer") : null;

    const text = [
      `Olá! Tenho interesse em Consórcio Klug.`,
      ``,
      `*Nome:* ${d.name}`,
      `*Telefone:* ${d.phone}`,
      `*E-mail:* ${d.email}`,
      `*Modelo:* ${d.model}`,
      `*Carta de crédito:* ${d.credit}`,
      `*Parcela mensal:* ${d.budget}`,
      `*Contemplação:* ${d.contemplation}`,
      d.message ? `*Observações:* ${d.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const attr = getAttribution();
    const originPage = getOriginPage();

    const { error } = await supabase.from("leads").insert({
      name: d.name,
      phone: d.phone,
      email: d.email,
      model: d.model,
      payment_type: "Consórcio",
      entry: d.credit,
      term: d.budget,
      message: [
        `Contemplação: ${d.contemplation}`,
        d.message ? `Observações: ${d.message}` : null,
      ]
        .filter(Boolean)
        .join(" | "),
      source: "consorcio",
      utm_source: attr.utm_source,
      utm_medium: attr.utm_medium,
      utm_campaign: attr.utm_campaign,
      utm_term: attr.utm_term,
      utm_content: attr.utm_content,
      referrer: attr.referrer,
      landing_page: attr.landing_page,
      origin_page: originPage,
      lgpd_consent: d.lgpd,
      lgpd_consent_at: d.lgpd ? new Date().toISOString() : null,
    });

    setSubmitting(false);

    if (error) {
      setSaveError("Não foi possível salvar sua solicitação. Tente novamente ou envie pelo WhatsApp.");
      setLastMessage(text);
      if (waWindow) waWindow.close();
      return;
    }

    setLastMessage(text);
    setSummary(d);
    setSentAt(new Date());
    setProtocol(`KLG-${Date.now().toString(36).toUpperCase().slice(-6)}`);
    setSent(true);
    trackEvent("consorcio_submit", {
      source: "consorcio_form",
      meta: {
        model: d.model,
        credit: d.credit,
        budget: d.budget,
        contemplation: d.contemplation,
        utm_source: attr.utm_source,
        utm_medium: attr.utm_medium,
        utm_campaign: attr.utm_campaign,
        origin_page: originPage,
      },
    });
    // Redireciona a aba pré-aberta para o WhatsApp com a mensagem pronta.
    // O evento whatsapp_redirected é disparado UMA única vez por envio.
    const waUrl = buildWhatsAppFallbackUrl(text);
    if (waWindow && !waWindow.closed) {
      waWindow.location.href = waUrl;
      trackEvent("whatsapp_redirected", {
        source: "consorcio_form",
        meta: { name: d.name, phone: d.phone, model: d.model, payment_type: "Consórcio", origin_page: originPage },
      });
    } else {
      // Fallback: pop-up foi bloqueado — abre agora (pode disparar bloqueador em alguns navegadores).
      openWhatsAppNewTab(text, {
        source: "consorcio_form",
        event: "whatsapp_redirected",
        meta: { name: d.name, phone: d.phone, model: d.model, payment_type: "Consórcio", origin_page: originPage },
      });
    }
  }

  function reset() {
    setSent(false);
    setLastMessage(null);
    setSaveError(null);
    setErrors({});
    setSummary(null);
    setSentAt(null);
    setProtocol(null);
  }

  const inputCls =
    "w-full bg-background border border-border px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-0 transition-all";
  const labelCls =
    "block text-[10px] uppercase font-display font-black text-white/70 tracking-widest mb-2";

  if (sent) {
    const rows: Array<[string, string]> = summary
      ? [
          ["Nome", summary.name],
          ["WhatsApp", summary.phone],
          ["E-mail", summary.email],
          ["Modelo", summary.model],
          ["Carta de crédito", summary.credit],
          ["Parcela mensal", summary.budget],
          ["Contemplação", summary.contemplation],
          ...(summary.message ? ([["Observações", summary.message]] as Array<[string, string]>) : []),
        ]
      : [];

    return (
      <div role="status" aria-live="polite" className={compact ? "space-y-5" : "bg-card border border-border p-8"}>
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 grid place-items-center border border-primary text-primary mb-5">
            <CheckCircle2 size={26} />
          </div>
          <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-3">
            Solicitação recebida
          </p>
          <h3 className="font-display font-black uppercase text-2xl tracking-tight mb-2">
            Obrigado! Entraremos em contato
          </h3>
          <p className="text-white/70 text-sm max-w-sm mb-2">
            Um consultor Klug retornará com as opções de grupos, prazos e taxa de administração disponíveis.
          </p>
          {protocol && (
            <p className="text-[11px] text-white/50 font-mono mb-5">
              Protocolo <span className="text-white/80">{protocol}</span>
              {sentAt && <> · {sentAt.toLocaleString("pt-BR")}</>}
            </p>
          )}
        </div>

        {rows.length > 0 && (
          <div className="border border-border">
            <div className="px-4 py-2.5 border-b border-border bg-white/[0.02]">
              <p className="text-[10px] font-display font-black uppercase tracking-[0.25em] text-white/60">
                Resumo da solicitação
              </p>
            </div>
            <dl className="divide-y divide-border">
              {rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[130px_1fr] gap-3 px-4 py-2.5 text-xs">
                  <dt className="text-white/50 uppercase tracking-wider text-[10px] font-display font-black self-center">{k}</dt>
                  <dd className="text-white/90 break-words">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => lastMessage && openWhatsAppWithFallback(lastMessage)}
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-display font-black uppercase text-xs tracking-widest px-6 py-3"
          >
            <MessageCircle size={16} fill="white" strokeWidth={0} />
            Enviar pelo WhatsApp
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 border border-border text-white/80 hover:border-primary hover:text-primary font-display font-black uppercase text-xs tracking-widest px-6 py-3"
          >
            <RotateCcw size={14} />
            Nova solicitação
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Solicitar consórcio" className="space-y-5">
      {saveError && (
        <div role="alert" className="flex items-start gap-2 border border-destructive/50 bg-destructive/10 text-destructive text-xs p-3 rounded-md">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{saveError}</span>
        </div>
      )}

      <div>
        <label htmlFor="con-name" className={labelCls}>Nome completo</label>
        <input id="con-name" name="name" maxLength={100} placeholder="Como podemos te chamar?" className={inputCls} aria-invalid={!!errors.name} />
        {errors.name && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.name}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="con-phone" className={labelCls}>WhatsApp</label>
          <input id="con-phone" name="phone" type="tel" maxLength={20} placeholder="(DDD) + número" className={inputCls} aria-invalid={!!errors.phone} />
          {errors.phone && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="con-email" className={labelCls}>E-mail</label>
          <input id="con-email" name="email" type="email" maxLength={255} placeholder="voce@email.com" className={inputCls} aria-invalid={!!errors.email} />
          {errors.email && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="con-model" className={labelCls}>Modelo de interesse</label>
        <select id="con-model" name="model" defaultValue={defaultModel ?? ""} className={inputCls} aria-invalid={!!errors.model}>
          <option value="" disabled>Selecione um modelo</option>
          {models.map((m) => (
            <option key={m.slug} value={m.name}>{m.name}</option>
          ))}
          <option>Outro / Catálogo completo</option>
        </select>
        {errors.model && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.model}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="con-credit" className={labelCls}>Carta de crédito desejada</label>
          <select id="con-credit" name="credit" defaultValue="" className={inputCls} aria-invalid={!!errors.credit}>
            <option value="" disabled>Selecione</option>
            {CREDIT_RANGES.map((s) => <option key={s}>{s}</option>)}
          </select>
          {errors.credit && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.credit}</p>}
        </div>
        <div>
          <label htmlFor="con-budget" className={labelCls}>Parcela mensal que cabe no bolso</label>
          <select id="con-budget" name="budget" defaultValue="" className={inputCls} aria-invalid={!!errors.budget}>
            <option value="" disabled>Selecione</option>
            {MONTHLY_BUDGETS.map((s) => <option key={s}>{s}</option>)}
          </select>
          {errors.budget && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.budget}</p>}
        </div>
      </div>

      <div>
        <span className={labelCls}>Preferência de contemplação</span>
        <div id="con-contemplation" role="radiogroup" aria-invalid={!!errors.contemplation} className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CONTEMPLATION.map((p) => (
            <label
              key={p}
              className="cursor-pointer border border-border text-white/80 hover:border-primary/60 px-3 py-3 text-center text-[11px] font-display font-black uppercase tracking-widest transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary"
            >
              <input type="radio" name="contemplation" value={p} className="sr-only" />
              {p}
            </label>
          ))}
        </div>
        {errors.contemplation && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.contemplation}</p>}
      </div>

      <div>
        <label htmlFor="con-message" className={labelCls}>Observações (opcional)</label>
        <textarea id="con-message" name="message" rows={3} maxLength={500} placeholder="Conte um pouco mais sobre o que você procura" className={inputCls} />
      </div>

      <div>
        <label
          htmlFor="con-lgpd"
          className="flex items-start gap-3 border border-border p-3 cursor-pointer hover:border-primary/60 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5"
        >
          <input
            id="con-lgpd"
            name="lgpd"
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-primary shrink-0"
            aria-invalid={!!errors.lgpd}
            aria-describedby={errors.lgpd ? "con-lgpd-err" : undefined}
          />
          <span className="text-[11px] leading-relaxed text-white/70">
            Li e autorizo o tratamento dos meus dados pela Klug para contato sobre esta solicitação,
            conforme a <Link to="/privacidade" target="_blank" rel="noreferrer" className="text-primary underline underline-offset-2">Política de Privacidade</Link> e a LGPD (Lei nº 13.709/2018). <span className="text-destructive">*</span>
          </span>
        </label>
        {errors.lgpd && <p id="con-lgpd-err" role="alert" className="text-xs text-destructive mt-1.5">{errors.lgpd}</p>}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase text-xs tracking-widest px-6 py-4 disabled:opacity-70 hover:brightness-110 transition-all"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              Solicitar Consórcio
              <ArrowRight size={16} />
            </>
          )}
        </button>
        <p className="text-[11px] text-white/40 leading-relaxed mt-3 text-center">
          Grupos administrados por administradoras autorizadas Bacen. Condições, prazos e taxa de
          administração sujeitos à análise.
        </p>
      </div>
    </form>
  );
}
