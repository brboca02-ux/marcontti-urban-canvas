import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "klug.cookie-consent.v1";

export type CookieCategories = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

type StoredConsent = CookieCategories & { decidedAt: string };

function readConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredConsent) : null;
  } catch {
    return null;
  }
}

function writeConsent(c: CookieCategories) {
  const payload: StoredConsent = { ...c, decidedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent("klug:consent", { detail: payload }));
  } catch {
    /* ignore */
  }
}

/** Read the current consent (safe on SSR). */
export function getConsent(): StoredConsent | null {
  return readConsent();
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      // slight delay so banner doesn't compete with LCP
      const t = window.setTimeout(() => setOpen(true), 400);
      return () => window.clearTimeout(t);
    }
    setAnalytics(existing.analytics);
    setMarketing(existing.marketing);
  }, []);

  const acceptAll = () => {
    writeConsent({ essential: true, analytics: true, marketing: true });
    setOpen(false);
  };
  const rejectAll = () => {
    writeConsent({ essential: true, analytics: false, marketing: false });
    setOpen(false);
  };
  const saveSelection = () => {
    writeConsent({ essential: true, analytics, marketing });
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-w-md z-50 rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl shadow-black/50 p-5 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="grid place-items-center h-9 w-9 rounded-xl bg-primary/15 text-primary shrink-0">
          <Cookie className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2
            id="cookie-consent-title"
            className="font-display font-black uppercase tracking-wider text-sm text-foreground"
          >
            Este site usa cookies
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-white/70">
            Usamos cookies para operar o site, entender como ele é usado e
            personalizar sua experiência. Você pode escolher o que aceitar.{" "}
            <Link to="/privacidade" className="text-primary underline underline-offset-2">
              Saiba mais
            </Link>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={rejectAll}
          aria-label="Recusar cookies opcionais e fechar"
          className="shrink-0 text-white/50 hover:text-white p-1 -mt-1 -mr-1"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {details && (
        <ul className="mt-4 space-y-2.5 text-xs">
          <li className="flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-background/60 px-3 py-2.5">
            <div>
              <p className="font-bold text-white">Essenciais</p>
              <p className="text-white/55 mt-0.5">Necessários para o site funcionar. Sempre ativos.</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/80 mt-1">
              Sempre
            </span>
          </li>
          <li className="flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-background/60 px-3 py-2.5">
            <div>
              <p className="font-bold text-white">Analytics</p>
              <p className="text-white/55 mt-0.5">Medem visitas e desempenho, de forma agregada.</p>
            </div>
            <Toggle checked={analytics} onChange={setAnalytics} label="Analytics" />
          </li>
          <li className="flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-background/60 px-3 py-2.5">
            <div>
              <p className="font-bold text-white">Marketing</p>
              <p className="text-white/55 mt-0.5">Personalizam campanhas e conteúdo relevante.</p>
            </div>
            <Toggle checked={marketing} onChange={setMarketing} label="Marketing" />
          </li>
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {!details ? (
          <>
            <button
              type="button"
              onClick={acceptAll}
              className="flex-1 min-w-[110px] rounded-full bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-[11px] px-4 py-2.5"
            >
              Aceitar tudo
            </button>
            <button
              type="button"
              onClick={rejectAll}
              className="flex-1 min-w-[110px] rounded-full border border-border bg-background/60 text-white font-display font-black uppercase tracking-widest text-[11px] px-4 py-2.5 hover:border-white/40"
            >
              Só essenciais
            </button>
            <button
              type="button"
              onClick={() => setDetails(true)}
              className="w-full text-[11px] uppercase tracking-widest font-bold text-white/60 hover:text-primary pt-1"
            >
              Personalizar
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={saveSelection}
              className="flex-1 min-w-[110px] rounded-full bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-[11px] px-4 py-2.5"
            >
              Salvar escolhas
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="flex-1 min-w-[110px] rounded-full border border-border bg-background/60 text-white font-display font-black uppercase tracking-widest text-[11px] px-4 py-2.5 hover:border-white/40"
            >
              Aceitar tudo
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`shrink-0 mt-0.5 relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-white/15"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
