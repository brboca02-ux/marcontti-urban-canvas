import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import klugSymbol from "../assets/klug/klug-symbol.png.asset.json";
import { BackToTop } from "../components/BackToTop";
import { CookieConsent } from "../components/CookieConsent";
import { captureAttribution } from "../lib/attribution";
import { useModelsRealtime } from "../hooks/useModelsRealtime";

const PUBLIC_ORIGIN = "https://klugmotors.com.br";

/** Slim top progress bar that reflects vertical scroll position. */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const compute = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent"
    >
      <div
        className="h-full bg-primary origin-left transition-transform duration-150 ease-out motion-reduce:transition-none"
        style={{ transform: `scaleX(${progress})`, width: "100%" }}
      />
    </div>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Esta página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado. Você pode tentar novamente ou voltar para o início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Klug Motors — Motos e Scooters Elétricas em Joinville" },
      { name: "description", content: "Klug Motors: motos, scooters e triciclos elétricos em Joinville/SC. Sem CNH, econômicas e sustentáveis. R. Albano Schmidt, 1882." },
      { name: "author", content: "Klug Motors" },
      { property: "og:site_name", content: "Klug Motors" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:title", content: "Klug Motors — Motos e Scooters Elétricas em Joinville" },
      { property: "og:description", content: "Motos, scooters e triciclos elétricos em Joinville/SC. Sem CNH, econômicas e sustentáveis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Klug Motors — Motos e Scooters Elétricas em Joinville" },
      { name: "twitter:description", content: "Motos, scooters e triciclos elétricos em Joinville/SC. Sem CNH, econômicas e sustentáveis." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: klugSymbol.url },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700;900&family=Epilogue:wght@400;500;600;700&family=Bebas+Neue&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${PUBLIC_ORIGIN}/#organizacao`,
              name: "Klug Motors",
              alternateName: ["Klug Motor's", "Klug Motors Joinville"],
              url: `${PUBLIC_ORIGIN}/`,
              logo: {
                "@type": "ImageObject",
                url: `${PUBLIC_ORIGIN}${klugSymbol.url}`,
              },
              image: `${PUBLIC_ORIGIN}${klugSymbol.url}`,
              description:
                "Concessionária de motos, scooters e triciclos elétricos em Joinville/SC, com oficina especializada e financiamento facilitado.",
              email: "klugmotors@gmail.com",
              telephone: "+5547934293200",
              taxID: "51.728.597/0001-26",
              vatID: "51.728.597/0001-26",
              foundingLocation: { "@type": "Place", name: "Joinville, SC" },
              address: {
                "@type": "PostalAddress",
                streetAddress: "R. Albano Schmidt, 1882 - Boa Vista",
                addressLocality: "Joinville",
                addressRegion: "SC",
                postalCode: "89205-100",
                addressCountry: "BR",
              },
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+5547934293200",
                  contactType: "customer service",
                  areaServed: "BR",
                  availableLanguage: ["Portuguese"],
                },
              ],
              sameAs: ["https://www.instagram.com/klugmotors/"],
            },
            {
              "@type": "WebSite",
              "@id": `${PUBLIC_ORIGIN}/#website`,
              url: `${PUBLIC_ORIGIN}/`,
              name: "Klug Motors",
              inLanguage: "pt-BR",
              publisher: { "@id": `${PUBLIC_ORIGIN}/#organizacao` },
            },
          ],
        }),
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* Meta Pixel — a fila (fbq) fica pronta na hora, mas o script pesado
            só baixa quando o navegador está ocioso ou na 1ª interação, para não
            competir com o conteúdo visível. */}
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
f.__klugLoadPixel=function(){if(f.__klugPixelLoaded)return;f.__klugPixelLoaded=!0;
t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','1002813009427833');fbq('track','PageView');
(function(w,d){var go=function(){w.__klugLoadPixel&&w.__klugLoadPixel()};
['pointerdown','keydown','touchstart','scroll'].forEach(function(ev){
d.addEventListener(ev,go,{once:true,passive:true})});
if(w.requestIdleCallback)w.requestIdleCallback(go,{timeout:5000});
else setTimeout(go,3000)})(window,document);
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1002813009427833&ev=PageView&noscript=1"
/></noscript>
            `.trim(),
          }}
        />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/** Assina o Realtime do catálogo (precisa estar dentro do QueryClientProvider). */
function CatalogRealtime() {
  useModelsRealtime();
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    captureAttribution();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CatalogRealtime />
      <ScrollProgress />
      <Outlet />
      <BackToTop />
      <CookieConsent />
    </QueryClientProvider>
  );
}

