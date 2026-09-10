import { createFileRoute } from "@tanstack/react-router";

const PROMPT =
  "Remove the background of this photo completely. Keep the vehicle/product exactly as it is: " +
  "same pose, same angle, same colors, same lighting, sharp edges, no distortion, no added reflections, " +
  "no motion streaks and no extra elements. Cut it out cleanly (including between wheels and spokes) and " +
  "place the subject centered on a pure, uniform solid white background (#FFFFFF). Output only the image.";

export const Route = createFileRoute("/api/remove-bg")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const { imageBase64, mimeType } = (await request.json()) as {
          imageBase64?: string;
          mimeType?: string;
        };
        if (!imageBase64) return Response.json({ error: "Imagem ausente" }, { status: 400 });

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-3-pro-image",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: PROMPT },
                  {
                    type: "image_url",
                    image_url: { url: `data:${mimeType || "image/png"};base64,${imageBase64}` },
                  },
                ],
              },
            ],
            modalities: ["image", "text"],
          }),
        });

        if (!upstream.ok) {
          const detail = await upstream.text().catch(() => "");
          const message =
            upstream.status === 429
              ? "Limite de uso da IA atingido. Tente novamente em instantes."
              : upstream.status === 402
                ? "Créditos de IA esgotados."
                : `A IA não conseguiu processar a imagem (${upstream.status}).`;
          console.error("[remove-bg]", upstream.status, detail.slice(0, 500));
          return Response.json({ error: message }, { status: upstream.status });
        }

        const json = (await upstream.json()) as { data?: Array<{ b64_json?: string }> };
        const b64 = json?.data?.[0]?.b64_json;
        if (!b64) return Response.json({ error: "A IA não retornou uma imagem." }, { status: 502 });
        return Response.json({ b64 });
      },
    },
  },
});
