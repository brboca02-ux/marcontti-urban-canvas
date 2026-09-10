/**
 * Padroniza uma imagem hero: recorta o espaço vazio/transparente ao redor do
 * veículo, centraliza o objeto e devolve um PNG numa proporção fixa (4:3 por
 * padrão), com uma margem interna consistente.
 *
 * Executa 100% no browser via canvas — não altera imagens já publicadas.
 */

export type NormalizeOptions = {
  /** Proporção final (largura / altura). Padrão 4/3, igual aos cards. */
  aspect?: number;
  /** Largura do canvas final em px. */
  width?: number;
  /** Margem interna (0–0.3) em relação ao menor lado. Padrão 0.06. */
  padding?: number;
  /** Tolerância de alpha para considerar um pixel "vazio". */
  alphaThreshold?: number;
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

/** Encontra a bounding box do conteúdo visível (alpha > threshold). */
function findContentBox(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  alphaThreshold: number,
) {
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = data[(y * w + x) * 4 + 3];
      if (a > alphaThreshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

export async function normalizeHeroImage(
  file: File,
  opts: NormalizeOptions = {},
): Promise<File> {
  const aspect = opts.aspect ?? 4 / 3;
  const minW = opts.width ?? 1600;
  const maxW = 2000;
  const padding = opts.padding ?? 0.06;
  const alphaThreshold = opts.alphaThreshold ?? 12;

  try {
    const img = await loadImage(file);
    const sw = img.naturalWidth;
    const sh = img.naturalHeight;
    if (!sw || !sh) return file;

    // 1) Detecta a área útil
    const probe = document.createElement("canvas");
    probe.width = sw;
    probe.height = sh;
    const pctx = probe.getContext("2d", { willReadFrequently: true });
    if (!pctx) return file;
    pctx.drawImage(img, 0, 0);

    let box = { x: 0, y: 0, w: sw, h: sh };
    try {
      const { data } = pctx.getImageData(0, 0, sw, sh);
      const found = findContentBox(data, sw, sh, alphaThreshold);
      if (found) box = found;
    } catch {
      // imagem cross-origin: mantém o quadro inteiro
    }

    // 2) Dimensiona o canvas para preservar a resolução original do conteúdo
    //    (evita reamostrar para cima e perder nitidez).
    const fitW = box.w / (1 - padding * 2);
    const fitH = (box.h / (1 - padding * 2)) * aspect;
    const nativeW = Math.max(fitW, fitH);
    const outW = Math.round(Math.min(maxW, Math.max(minW, nativeW)));
    const outH = Math.round(outW / aspect);

    const out = document.createElement("canvas");
    out.width = outW;
    out.height = outH;
    const ctx = out.getContext("2d");
    if (!ctx) return file;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const availW = outW * (1 - padding * 2);
    const availH = outH * (1 - padding * 2);
    const scale = Math.min(availW / box.w, availH / box.h);
    const dw = box.w * scale;
    const dh = box.h * scale;
    const dx = (outW - dw) / 2;
    const dy = (outH - dh) / 2;

    ctx.drawImage(img, box.x, box.y, box.w, box.h, dx, dy, dw, dh);


    // WebP com alpha: mesma nitidez com ~5% do peso de um PNG equivalente.
    let blob: Blob | null = await new Promise((res) =>
      out.toBlob((b) => res(b), "image/webp", 0.92),
    );
    if (blob && blob.type === "image/webp") {
      const base = file.name.replace(/\.[^.]+$/, "");
      return new File([blob], `${base}-hero.webp`, { type: "image/webp" });
    }
    blob = await new Promise((res) => out.toBlob((b) => res(b), "image/png"));
    if (!blob) return file;

    const base = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${base}-hero.png`, { type: "image/png" });
  } catch (err) {
    console.error("[normalizeHeroImage] falhou, usando original:", err);
    return file;
  }
}
