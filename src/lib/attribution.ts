export type Attribution = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referrer: string | null;
  landing_page: string | null;
};

const STORAGE_KEY = "klug_attr_v1";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

function empty(): Attribution {
  return {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
    referrer: null,
    landing_page: null,
  };
}

/**
 * Captures UTMs + referrer + landing page on first pageview and persists
 * for the whole session. Safe to call repeatedly.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    const hasUtm = UTM_KEYS.some((k) => url.searchParams.get(k));
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing && !hasUtm) return;

    const attr: Attribution = empty();
    for (const k of UTM_KEYS) {
      attr[k] = url.searchParams.get(k);
    }
    attr.referrer = document.referrer ? document.referrer.slice(0, 500) : null;
    attr.landing_page = `${url.pathname}${url.search}`.slice(0, 500);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attr));
  } catch {
    /* ignore */
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return empty();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return { ...empty(), ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return empty();
}

export function getOriginPage(): string | null {
  if (typeof window === "undefined") return null;
  return `${window.location.pathname}${window.location.search}`.slice(0, 500);
}
