import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { models as staticModels } from "@/lib/models";

const BASE_URL = "https://klugmotors.com.br";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: string;
}

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/modelos", changefreq: "weekly", priority: "0.9" },
          { path: "/modelos?marca=yamaha", changefreq: "weekly", priority: "0.9" },
          { path: "/modelos?marca=sudu", changefreq: "weekly", priority: "0.9" },
          { path: "/modelos?marca=klug", changefreq: "weekly", priority: "0.9" },
          { path: "/modelos?cat=triciclo", changefreq: "weekly", priority: "0.8" },
          { path: "/modelos?cat=seminovos", changefreq: "weekly", priority: "0.8" },
          { path: "/comparar", changefreq: "monthly", priority: "0.7" },
          { path: "/financiamento", changefreq: "monthly", priority: "0.8" },
          { path: "/garantia", changefreq: "yearly", priority: "0.5" },
          { path: "/sobre", changefreq: "yearly", priority: "0.6" },
          { path: "/faq", changefreq: "monthly", priority: "0.7" },
          { path: "/contato", changefreq: "monthly", priority: "0.8" },
          { path: "/privacidade", changefreq: "yearly", priority: "0.3" },
        ];

        // Consulta modelos ativos direto do banco (mesma política pública
        // `is_active = true` usada por usePublicModels no cliente). Fallback
        // para o catálogo estático se a query falhar.
        let modelSlugs: { slug: string; updated_at?: string | null }[] = [];
        try {
          const supabase = createClient<Database>(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLISHABLE_KEY!,
            {
              auth: {
                storage: undefined,
                persistSession: false,
                autoRefreshToken: false,
              },
            },
          );
          const { data, error } = await supabase
            .from("models")
            .select("slug, updated_at")
            .eq("is_active", true);
          if (error) throw error;
          modelSlugs = (data ?? []).filter((m) => typeof m.slug === "string" && m.slug);
        } catch {
          modelSlugs = staticModels.map((m) => ({ slug: m.slug, updated_at: null }));
        }

        const modelEntries: SitemapEntry[] = modelSlugs.map((m) => ({
          path: `/modelos/${m.slug}`,
          lastmod: m.updated_at ? new Date(m.updated_at).toISOString().slice(0, 10) : undefined,
          changefreq: "monthly",
          priority: "0.8",
        }));

        const all = [...staticEntries, ...modelEntries];

        const urls = all
          .map((e) => {
            const parts = [
              `  <url>`,
              `    <loc>${escapeXml(BASE_URL + e.path)}</loc>`,
              e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
              `    <changefreq>${e.changefreq}</changefreq>`,
              `    <priority>${e.priority}</priority>`,
              `  </url>`,
            ].filter(Boolean);
            return parts.join("\n");
          })
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
