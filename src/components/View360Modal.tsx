import { useEffect, useRef, useState } from "react";
import { X, RotateCw, Pause, Play } from "lucide-react";

/**
 * 360° view modal. Uses provided frames as rotation steps; when few frames are
 * available it cycles them to simulate rotation. Supports drag/scrub, auto-play,
 * keyboard arrows and ESC to close.
 */
export function View360Modal({
  open,
  onClose,
  frames,
  title,
}: {
  open: boolean;
  onClose: () => void;
  frames: string[];
  title: string;
}) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startIdx = useRef(0);

  const total = frames.length;

  useEffect(() => {
    if (!open) return;
    setIdx(0);
    setPlaying(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") { setPlaying(false); setIdx((i) => (i + 1) % total); }
      if (e.key === "ArrowLeft") { setPlaying(false); setIdx((i) => (i - 1 + total) % total); }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, total]);

  useEffect(() => {
    if (!open || !playing || total < 2) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % total), 120);
    return () => window.clearInterval(id);
  }, [open, playing, total]);

  if (!open) return null;

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startIdx.current = idx;
    setPlaying(false);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || total < 2) return;
    const dx = e.clientX - startX.current;
    const step = Math.round(dx / 20);
    const next = ((startIdx.current + step) % total + total) % total;
    setIdx(next);
  };
  const onPointerUp = () => { dragging.current = false; };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Visualização 360 graus — ${title}`}
    >
      <div
        className="relative w-full max-w-5xl bg-neutral-100 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-200 bg-white">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Visualização 360°</div>
            <div className="text-sm font-semibold text-neutral-900">{title}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="grid place-items-center w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
              aria-label={playing ? "Pausar rotação" : "Retomar rotação"}
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="grid place-items-center w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          className="relative aspect-[4/3] bg-gradient-to-b from-neutral-200 to-neutral-100 cursor-grab active:cursor-grabbing select-none touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {frames.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt=""
              draggable={false}
              className="absolute inset-0 w-full h-full object-contain p-6 transition-opacity duration-100"
              style={{ opacity: i === idx ? 1 : 0 }}
            />
          ))}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 shadow text-[11px] font-semibold text-neutral-700">
            <RotateCw className="w-3.5 h-3.5" />
            Arraste para girar
          </div>
        </div>

        {total > 1 && (
          <div className="px-5 py-3 bg-white border-t border-neutral-200">
            <input
              type="range"
              min={0}
              max={total - 1}
              value={idx}
              onChange={(e) => { setPlaying(false); setIdx(Number(e.target.value)); }}
              className="w-full accent-neutral-900"
              aria-label="Ângulo de rotação"
            />
          </div>
        )}
      </div>
    </div>
  );
}
