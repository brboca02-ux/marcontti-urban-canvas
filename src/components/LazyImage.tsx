import { useState, useEffect, type CSSProperties, type ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  /** Wrapper class (skeleton fills this container) */
  wrapperClassName?: string;
  /** Text shown under the spinner while loading (optional) */
  loadingLabel?: string;
  /**
   * Fixed CSS aspect-ratio applied to the wrapper AND the image so the layout
   * never shifts while the image loads. Accepts any CSS aspect-ratio value
   * (e.g. "4 / 3", "16 / 9", "1"). Defaults to "4 / 3".
   */
  aspectRatio?: string | null;
  /**
   * Marca a imagem como crítica (above the fold): carrega imediatamente com
   * prioridade alta. As demais ficam com `loading="lazy"` + `fetchpriority="low"`
   * para não competir com o conteúdo visível.
   */
  priority?: boolean;
};

/**
 * Image with skeleton shimmer + fade-in on load. Uses native `loading="lazy"`
 * so the browser decides when to fetch (avoids intersection edge cases where
 * an image never gets a src on fast scrolls or long grids).
 *
 * The wrapper reserves space via CSS `aspect-ratio` so cards do NOT reflow
 * while images load. Pass `aspectRatio={null}` to opt out when the parent
 * already constrains the box.
 */
export function LazyImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  loadingLabel,
  aspectRatio = "4 / 3",
  priority = false,
  sizes,
  style,
  ...rest
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const wrapperStyle: CSSProperties | undefined = aspectRatio
    ? { aspectRatio }
    : undefined;
  const imgStyle: CSSProperties = {
    ...(aspectRatio ? { aspectRatio } : {}),
    ...style,
  };

  return (
    <span
      style={wrapperStyle}
      className={`relative flex items-center justify-center overflow-hidden ${wrapperClassName}`}
    >
      {/* Skeleton / loading overlay */}
      {!loaded && !errored && (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[inherit] bg-gradient-to-br from-neutral-200/70 via-neutral-100/70 to-neutral-200/70 dark:from-neutral-800/60 dark:via-neutral-700/60 dark:to-neutral-800/60 animate-pulse"
        >
          <span className="h-5 w-5 rounded-full border-2 border-neutral-400/60 border-t-primary animate-spin" />
          {loadingLabel && (
            <span className="text-[10px] font-display uppercase tracking-widest text-neutral-500">
              {loadingLabel}
            </span>
          )}
        </span>
      )}

      {errored && (
        <span className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-neutral-100 dark:bg-neutral-800 text-[10px] uppercase tracking-widest text-neutral-500">
          Imagem indisponível
        </span>
      )}

      <img
        src={src}
        alt={alt}
        loading={
          (rest as { loading?: "eager" | "lazy" }).loading ??
          (priority ? "eager" : "lazy")
        }
        decoding={priority ? "sync" : "async"}
        // @ts-expect-error - fetchpriority é válido no DOM, tipagem do React ainda não cobre
        fetchpriority={priority ? "high" : "low"}
        sizes={sizes ?? "100vw"}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        style={imgStyle}
        className={`${className} transition-opacity duration-500 ${loaded || !isClient ? "opacity-100" : "opacity-0"}`}
        {...rest}
      />
    </span>
  );
}

