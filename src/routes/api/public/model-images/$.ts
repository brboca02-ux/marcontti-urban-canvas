import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/model-images/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const raw = (params as unknown as { _splat: string })._splat;
        if (!raw) return new Response("Not found", { status: 404 });

        // Path traversal / enumeração: só permite chaves seguras dentro do bucket.
        // Bloqueia `..`, barras iniciais, backslashes e caracteres de controle.
        const path = raw.replace(/^\/+/, "");
        if (
          path.includes("..") ||
          path.includes("\\") ||
          /[\x00-\x1f]/.test(path) ||
          path.length > 512
        ) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("model-images").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });

        return new Response(data, {
          headers: {
            "Content-Type": data.type || "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
