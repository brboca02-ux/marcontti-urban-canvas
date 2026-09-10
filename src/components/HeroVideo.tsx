import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

type Props = {
  src: string;
  poster: string;
  className?: string;
  /** Texto acessível do botão de play (conexões lentas). */
  label?: string;
};

type Conn = { saveData?: boolean; effectiveType?: string };

/** Conexão lenta / economia de dados: não baixar vídeo automaticamente. */
function isFrugalConnection() {
  if (typeof navigator === "undefined") return false;
  const c = (navigator as Navigator & { connection?: Conn }).connection;
  if (!c) return false;
  if (c.saveData) return true;
  return c.effectiveType === "slow-2g" || c.effectiveType === "2g" || c.effectiveType === "3g";
}

/**
 * Vídeo de hero que só começa a baixar quando entra na tela — antes disso o
 * usuário já vê o poster (imagem leve). Em conexões lentas ou com economia de
 * dados, mostra o poster com um botão de play em vez de baixar sozinho.
 */
export function HeroVideo({ src, poster, className = "", label = "Assistir vídeo" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [load, setLoad] = useState(false);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (isFrugalConnection()) {
      setManual(true);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setLoad(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!load) return;
    const v = videoRef.current;
    if (!v) return;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [load]);

  return (
    <div ref={ref} className="absolute inset-0">
      {load ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          controls={false}
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          className={`pointer-events-none absolute inset-0 w-full h-full object-cover ${className}`}
        />
      ) : (
        <>
          <img
            src={poster}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover ${className}`}
          />
          {manual && (
            <button
              type="button"
              onClick={() => {
                setManual(false);
                setLoad(true);
              }}
              aria-label={label}
              className="absolute inset-0 grid place-items-center bg-black/20 transition-colors hover:bg-black/30"
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <Play size={22} fill="currentColor" strokeWidth={0} />
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default HeroVideo;
