import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Move, ZoomIn, RotateCcw, Check } from "lucide-react";

type Props = {
  /** URL da imagem a ajustar (mesma origem ou CORS liberado). */
  src: string;
  /** Proporção final do enquadramento. Padrão 4:3 (igual aos cards). */
  aspect?: number;
  open: boolean;
  onClose: () => void;
  /** Recebe o PNG gerado com o encaixe escolhido. */
  onApply: (file: File) => void | Promise<void>;
  busy?: boolean;
};

const OUT_WIDTH = 2000;

export default function HeroFitEditor({
  src,
  aspect = 4 / 3,
  open,
  onClose,
  onApply,
  busy,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // em % do frame
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const reset = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!open) return;
    setLoaded(false);
    reset();
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setLoaded(true);
    };
    img.onerror = () => setLoaded(false);
    img.src = src;
  }, [open, src, reset]);

  function onPointerDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current;
    const frame = frameRef.current;
    if (!d || !frame) return;
    const rect = frame.getBoundingClientRect();
    setOffset({
      x: d.ox + ((e.clientX - d.x) / rect.width) * 100,
      y: d.oy + ((e.clientY - d.y) / rect.height) * 100,
    });
  }
  function onPointerUp() {
    drag.current = null;
  }

  async function apply() {
    const img = imgRef.current;
    if (!img) return;
    const outW = OUT_WIDTH;
    const outH = Math.round(outW / aspect);
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Mesma lógica do preview: "contain" no frame + zoom + deslocamento.
    const base = Math.min(outW / img.naturalWidth, outH / img.naturalHeight);
    const scale = base * zoom;
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = (outW - dw) / 2 + (offset.x / 100) * outW;
    const dy = (outH - dh) / 2 + (offset.y / 100) * outH;
    ctx.drawImage(img, dx, dy, dw, dh);

    const blob: Blob | null = await new Promise((res) =>
      canvas.toBlob((b) => res(b), "image/png"),
    );
    if (!blob) return;
    await onApply(new File([blob], `capa-ajustada-${Date.now()}.png`, { type: "image/png" }));
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl bg-neutral-950 border-neutral-800 text-neutral-100">
        <DialogHeader>
          <DialogTitle>Ajustar encaixe da imagem</DialogTitle>
        </DialogHeader>

        <p className="text-xs text-neutral-400 -mt-2">
          Arraste a imagem para posicionar e use o zoom para preencher o card. O
          quadro abaixo é exatamente o que aparece na página principal.
        </p>

        <div
          ref={frameRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="relative w-full aspect-[4/3] rounded-lg overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none border border-neutral-800"
          style={{
            backgroundImage:
              "linear-gradient(45deg,#262626 25%,transparent 25%),linear-gradient(-45deg,#262626 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#262626 75%),linear-gradient(-45deg,transparent 75%,#262626 75%)",
            backgroundSize: "16px 16px",
            backgroundPosition: "0 0,0 8px,8px -8px,-8px 0px",
          }}
        >
          {loaded ? (
            <img
              src={src}
              alt="Ajuste de enquadramento"
              draggable={false}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              style={{
                transform: `translate(${offset.x}%, ${offset.y}%) scale(${zoom})`,
              }}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-xs text-neutral-500">
              Carregando imagem...
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 border border-dashed border-white/15" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <ZoomIn className="w-4 h-4 text-neutral-400 shrink-0" />
            <Slider
              value={[zoom]}
              min={0.5}
              max={3}
              step={0.01}
              onValueChange={(v) => setZoom(v[0])}
              className="flex-1"
            />
            <span className="text-xs tabular-nums text-neutral-400 w-12 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
            <Move className="w-3.5 h-3.5" /> Arraste dentro do quadro para reposicionar
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={reset} className="text-neutral-300">
            <RotateCcw className="w-4 h-4 mr-2" /> Restaurar
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="text-neutral-300">
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={apply}
              disabled={!loaded || busy}
              className="bg-orange-500 text-black hover:bg-orange-400 font-semibold"
            >
              <Check className="w-4 h-4 mr-2" />
              {busy ? "Salvando..." : "Salvar encaixe"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
