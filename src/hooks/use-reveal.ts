import { useEffect, useRef } from "react";

/**
 * Adds `is-visible` to the container the first time it intersects the viewport.
 * Children marked with the `reveal` class animate in via CSS.
 * Respects prefers-reduced-motion by not observing at all.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(options?: {
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      el.classList.add("is-visible");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      {
        threshold: options?.threshold ?? 0,
        rootMargin: options?.rootMargin ?? "0px 0px -10% 0px",
      },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [options?.threshold, options?.rootMargin]);

  return ref;
}
