import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Busca a capa (og:image) de um post público do Instagram pelo servidor
 * (o navegador é bloqueado por redirect de login) e salva no bucket
 * `model-images`, devolvendo a URL pública servida via /api/public.
 */
export const fetchInstagramCover = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ url: z.string().url() }))
  .handler(async ({ data, context }) => {
    const match = data.url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/i);
    if (!match) throw new Error("URL do Instagram inválida");
    const shortcode = match[1];

    // Verifica se o usuário é admin antes de escrever (RLS aplicada)
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (!roles?.some((r) => r.role === "admin")) throw new Error("Forbidden");

    // 1) Tenta oEmbed público do Instagram (sem token) — em geral falha, então
    //    caímos direto no scrape do HTML público.
    const canonical = `https://www.instagram.com/p/${shortcode}/`;

    const res = await fetch(canonical, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
      },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`Instagram respondeu ${res.status}`);
    const html = await res.text();

    const og =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
    if (!og) throw new Error("Capa não encontrada no post (pode estar privado).");

    const decoded = og.replace(/&amp;/g, "&");
    const imgRes = await fetch(decoded, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!imgRes.ok) throw new Error(`Falha ao baixar imagem (${imgRes.status})`);
    const contentType = imgRes.headers.get("content-type") || "image/jpeg";
    const buf = new Uint8Array(await imgRes.arrayBuffer());

    const ext = contentType.includes("png") ? "png" : "jpg";
    const path = `instagram/cover-${shortcode}-${Date.now()}.${ext}`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage
      .from("model-images")
      .upload(path, buf, { upsert: true, contentType });
    if (error) throw new Error(error.message);

    return { thumbnail_url: `/api/public/model-images/${path}` };
  });
