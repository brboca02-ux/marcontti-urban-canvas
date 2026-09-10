import { useState } from "react";
import { z } from "zod";
import { AlertCircle, CheckCircle2, Loader2, MessageCircle, RotateCcw, Send } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { getAttribution, getOriginPage } from "@/lib/attribution";
import { buildWhatsAppFallbackUrl, openWhatsAppNewTab } from "@/lib/models";

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100, "Nome muito longo"),
  phone: z
    .string()
    .trim()
    .min(8, "Telefone inválido")
    .max(20, "Telefone inválido")
    .regex(/^[0-9()\s+-]+$/, "Use apenas números"),
  email: z.string().trim().max(255).email("E-mail inválido").optional().or(z.literal("")),
  message: z.string().trim().min(5, "Escreva sua mensagem").max(1000, "Máximo de 1000 caracteres"),
});

type Errors = Partial<Record<"name" | "phone" | "email" | "message" | "lgpd", string>>;

function buildContatoMessage(d: { name: string; phone: string; email?: string; message: string }) {
  return [
    "Olá, Klug Motors! Enviei uma mensagem pelo site:",
    "",
    `*Nome:* ${d.name}`,
    `*Telefone:* ${d.phone}`,
    d.email ? `*E-mail:* ${d.email}` : null,
    "",
    `*Mensagem:* ${d.message}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function ContatoForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lgpd, setLgpd] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const inputCls =
    "w-full bg-background border border-border px-4 py-3 text-sm text-white placeholder:text-white/50 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all";
  const labelCls =
    "block text-[10px] uppercase font-display font-black text-white/70 tracking-widest mb-2";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const parsed = schema.safeParse({
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    });

    const errs: Errors = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (!errs[key]) errs[key] = issue.message;
      }
    }
    if (!lgpd) errs.lgpd = "É necessário aceitar o compartilhamento dos dados";

    if (Object.keys(errs).length || !parsed.success) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document.getElementById(`ct-${firstKey}`)?.focus();
      return;
    }

    const d = parsed.data;
    setErrors({});
    setSaveError(null);
    setSubmitting(true);

    // Abre a aba do WhatsApp dentro do gesto do usuário para evitar bloqueio de pop-up.
    const waWindow =
      typeof window !== "undefined" ? window.open("about:blank", "_blank", "noopener,noreferrer") : null;

    const text = buildContatoMessage(d);
    const attr = getAttribution();
    const originPage = getOriginPage();

    const { error } = await supabase.from("leads").insert({
      name: d.name,
      phone: d.phone,
      email: d.email || null,
      message: d.message,
      source: "contato",
      lgpd_consent: true,
      lgpd_consent_at: new Date().toISOString(),
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
      setSaveError("Não foi possível enviar sua mensagem. Tente novamente ou fale pelo WhatsApp.");
      setLastMessage(text);
      if (waWindow) waWindow.close();
      return;
    }

    setLastMessage(text);
    setSent(true);
    trackEvent("contato_submit", {
      source: "contato_form",
      meta: { name: d.name, phone: d.phone, origin_page: originPage },
    });

    // Evento whatsapp_redirected disparado UMA única vez por envio.
    const waUrl = buildWhatsAppFallbackUrl(text);
    if (waWindow && !waWindow.closed) {
      waWindow.location.href = waUrl;
      trackEvent("whatsapp_redirected", {
        source: "contato_form",
        meta: { name: d.name, phone: d.phone, origin_page: originPage },
      });
    } else {
      openWhatsAppNewTab(text, {
        source: "contato_form",
        event: "whatsapp_redirected",
        meta: { name: d.name, phone: d.phone, origin_page: originPage },
      });
    }
  }

  function reset() {
    setSent(false);
    setErrors({});
    setSaveError(null);
    setLgpd(false);
    setLastMessage(null);
  }

  if (sent) {
    return (
      <div className="border border-border rounded-2xl bg-card p-6 sm:p-8 text-center">
        <span className="w-14 h-14 rounded-full bg-primary/10 text-primary grid place-items-center mx-auto mb-4">
          <CheckCircle2 size={26} />
        </span>
        <h3 className="font-display font-black uppercase tracking-wide text-white text-xl mb-2">
          Mensagem enviada
        </h3>
        <p className="text-sm text-white/60 mb-6">
          Recebemos seus dados e nossa equipe vai responder em breve. Se a aba do WhatsApp não abriu, use o botão abaixo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {lastMessage && (
            <a
              href={buildWhatsAppFallbackUrl(lastMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-black font-display font-black uppercase text-[11px] tracking-widest px-5 py-3 rounded-full transition-all hover:-translate-y-0.5"
            >
              <MessageCircle size={15} /> Abrir WhatsApp
            </a>
          )}
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 border border-border text-white font-display font-black uppercase text-[11px] tracking-widest px-5 py-3 rounded-full hover:border-primary transition-colors"
          >
            <RotateCcw size={15} /> Enviar outra
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="border border-border rounded-2xl bg-card p-6 sm:p-8 space-y-5"
    >
      <div>
        <p className="text-[10px] uppercase tracking-widest text-primary font-display font-black mb-1">
          Envie uma mensagem
        </p>
        <h3 className="font-display font-black uppercase tracking-wide text-white text-xl">
          Deixe seus dados
        </h3>
        <p className="text-sm text-white/60 mt-1">
          Respondemos pelo WhatsApp em horário comercial.
        </p>
      </div>

      <div>
        <label htmlFor="ct-name" className={labelCls}>Nome completo *</label>
        <input id="ct-name" name="name" type="text" maxLength={100} placeholder="Seu nome" className={inputCls} />
        {errors.name && <p className="text-xs text-destructive mt-1.5">{errors.name}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ct-phone" className={labelCls}>Telefone / WhatsApp *</label>
          <input id="ct-phone" name="phone" type="tel" inputMode="tel" maxLength={20} placeholder="(47) 90000-0000" className={inputCls} />
          {errors.phone && <p className="text-xs text-destructive mt-1.5">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="ct-email" className={labelCls}>E-mail (opcional)</label>
          <input id="ct-email" name="email" type="email" maxLength={255} placeholder="voce@email.com" className={inputCls} />
          {errors.email && <p className="text-xs text-destructive mt-1.5">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="ct-message" className={labelCls}>Mensagem *</label>
        <textarea
          id="ct-message"
          name="message"
          rows={4}
          maxLength={1000}
          placeholder="Como podemos ajudar?"
          className={`${inputCls} resize-y`}
        />
        {errors.message && <p className="text-xs text-destructive mt-1.5">{errors.message}</p>}
      </div>

      <label className="flex items-start gap-3 text-xs text-white/60 cursor-pointer">
        <input
          id="ct-lgpd"
          type="checkbox"
          checked={lgpd}
          onChange={(e) => setLgpd(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-primary shrink-0"
        />
        <span>
          Autorizo a Klug Motors a usar meus dados para retorno do contato, conforme a{" "}
          <a href="/privacidade" className="text-primary underline underline-offset-2">Política de Privacidade</a> (LGPD).
        </span>
      </label>
      {errors.lgpd && <p className="text-xs text-destructive -mt-3">{errors.lgpd}</p>}

      {saveError && (
        <p className="flex items-start gap-2 text-xs text-destructive border border-destructive/40 bg-destructive/10 rounded-xl p-3">
          <AlertCircle size={14} className="mt-0.5 shrink-0" /> {saveError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase text-[11px] tracking-widest px-6 py-4 rounded-full transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {submitting ? <><Loader2 size={15} className="animate-spin" /> Enviando…</> : <><Send size={15} /> Enviar mensagem</>}
      </button>
    </form>
  );
}
