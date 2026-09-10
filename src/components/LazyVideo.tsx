import { useEffect, useRef, useState, type VideoHTMLAttributes } from "react";

type Props = Omit<VideoHTMLAttributes<HTMLVideoElement>, "src"> & {
  src: string;
  /** Margem de antecipação para começar a carregar antes de entrar na tela. */
  rootMargin?: string;
};

/**
 * Vídeo que só baixa quando chega perto da viewport.
 *
 * Vídeos com `autoPlay` fora da dobra fazem o navegador baixar megabytes
 * concorrendo com o conteúdo visível. Aqui o `src` só é aplicado quando o
 * elemento se aproxima da tela, e o playback começa em seguida.
 */
export function LazyVideo({ src, rootMargin = "300px", ...rest }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const play = el.play();
    if (play && typeof play.catch === "function") play.catch(() => {});
  }, [active]);

  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      preload={active ? "metadata" : "none"}
      muted
      playsInline
      {...rest}
    />
  );
}

export default LazyVideo;
