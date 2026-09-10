import { supabase } from "@/integrations/supabase/client";
import { getConsent } from "@/components/CookieConsent";

/**
 * Fire-and-forget analytics event tracker.
 * Inserts a row into `public.analytics_events`. Never blocks navigation
 * e nunca lança erros — falhas são logadas silenciosamente no console.
 *
 * Respeita o consentimento LGPD: se o usuário recusou "Analytics" no banner,
 * nada é enviado. Enquanto o banner não tiver decisão registrada, também
 * NÃO enviamos (opt-in explícito).
 */
export type TrackEventOpts = {
  source?: string;
  modelSlug?: string;
  meta?: Record<string, unknown>;
};

export function trackEvent(eventName: string, opts: TrackEventOpts = {}): void {
  if (typeof window === "undefined") return;
  const consent = getConsent();
  if (!consent || !consent.analytics) return;
  try {
    void supabase
      .from("analytics_events")
      .insert({
        event_name: eventName,
        source: opts.source ?? null,
        page: window.location.pathname + window.location.search,
        model_slug: opts.modelSlug ?? null,
        meta: (opts.meta ?? null) as never,
        user_agent: window.navigator.userAgent,
      })
      .then((res) => {
        if (res.error) {
          // eslint-disable-next-line no-console
          console.warn("[analytics] insert failed:", res.error.message);
        }
      });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[analytics] error:", err);
  }
}

