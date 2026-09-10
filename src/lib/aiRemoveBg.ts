/**
 * Remoção de fundo com IA (Lovable AI Gateway).
 *
 * A IA devolve o veículo recortado sobre fundo branco sólido; aqui esse branco
 * é convertido em transparência real (com suavização de borda) no browser.
 */

function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      const base64 = result.split(",")[1] ?? "";
      resolve({ base64, mimeType: file.type || "image/png" });
    };
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    reader.readAsDataURL(file);
  });
}

/** Converte fundo branco em alpha, preservando o objeto. */
async function whiteToTransparent(blob: Blob, name: string): Promise<File> {
  const bitmap = await createImageBitmap(blob);
  const cv = document.createElement("canvas");
  cv.width = bitmap.width;
  cv.height = bitmap.height;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    bitmap.close();
    return new File([blob], name, { type: "image/png" });
  }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const img = ctx.getImageData(0, 0, cv.width, cv.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    // branco = claro e sem saturação
    if (min >= 236 && max - min <= 12) {
      d[i + 3] = 0;
    } else if (min >= 216 && max - min <= 18) {
      // borda: transparência parcial para evitar serrilhado
      d[i + 3] = Math.round(((236 - min) / 20) * 255);
    }
  }
  ctx.putImageData(img, 0, 0);

  const out: Blob | null = await new Promise((res) => cv.toBlob((b) => res(b), "image/png"));
  return new File([out ?? blob], name, { type: "image/png" });
}

export async function aiRemoveBackground(
  file: File,
  onProgress?: (label: string, pct: number) => void,
): Promise<File> {
  onProgress?.("Enviando imagem para a IA...", 10);
  const { base64, mimeType } = await fileToBase64(file);

  onProgress?.("A IA está recortando o veículo...", 35);
  const res = await fetch("/api/remove-bg", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64: base64, mimeType }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as { error?: string });
    throw new Error(body?.error || "A IA não conseguiu remover o fundo.");
  }

  const { b64 } = (await res.json()) as { b64: string };
  onProgress?.("Aplicando transparência...", 80);

  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const blob = new Blob([bytes], { type: "image/png" });

  const base = file.name.replace(/\.[^.]+$/, "");
  return whiteToTransparent(blob, `${base}-ia-nobg.png`);
}
