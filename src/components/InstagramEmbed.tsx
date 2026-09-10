import { useEffect, useRef } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const SCRIPT_SRC = "https://www.instagram.com/embed.js";

function ensureScript() {
  if (typeof window === "undefined") return;
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
    window.instgrm?.Embeds.process();
    return;
  }
  const s = document.createElement("script");
  s.src = SCRIPT_SRC;
  s.async = true;
  document.body.appendChild(s);
}

/** Renders an official Instagram post/reel embed via the blockquote + embed.js flow. */
export function InstagramEmbed({ url, captioned = true }: { url: string; captioned?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureScript();
    // Re-process on prop change once script is available.
    const t = setTimeout(() => window.instgrm?.Embeds.process(), 300);
    return () => clearTimeout(t);
  }, [url]);

  return (
    <div ref={ref} className="ig-embed-wrap">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        {...(captioned ? { "data-instgrm-captioned": "" } : {})}
        style={{
          background: "#000",
          border: 0,
          margin: 0,
          maxWidth: "540px",
          minWidth: "260px",
          width: "100%",
          padding: 0,
        }}
      >
        <a href={url} target="_blank" rel="noreferrer" className="text-white/60 text-xs">
          Ver post no Instagram
        </a>
      </blockquote>
    </div>
  );
}
