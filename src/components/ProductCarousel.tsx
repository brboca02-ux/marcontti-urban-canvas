import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard, type Product } from "./ProductCard";

export function ProductCarousel({
  items,
  title,
  eyebrow,
}: {
  items: Product[];
  title?: React.ReactNode;
  eyebrow?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, items.length]);

  const scrollByDir = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.85;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {(title || eyebrow) && (
          <div className="flex items-end justify-between gap-6 mb-8 sm:mb-12">
            <div>
              {eyebrow && (
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-3">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="font-display font-black uppercase text-3xl sm:text-5xl tracking-tighter leading-none">
                  {title}
                </h2>
              )}
            </div>

            {/* desktop arrows */}
            <div className="hidden md:flex gap-2">
              <button
                type="button"
                onClick={() => scrollByDir(-1)}
                disabled={!canPrev}
                aria-label="Anterior"
                className="w-11 h-11 rounded-full border border-white/15 grid place-items-center text-white transition hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => scrollByDir(1)}
                disabled={!canNext}
                aria-label="Próximo"
                className="w-11 h-11 rounded-full border border-white/15 grid place-items-center text-white transition hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        <div
          ref={trackRef}
          className="
            flex gap-2 sm:gap-3
            overflow-x-auto
            snap-x snap-mandatory
            scroll-px-4 sm:scroll-px-8
            pb-4 -mx-4 px-4 sm:mx-0 sm:px-0
            [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          "
        >

          {items.map((p, i) => (
            <div
              key={p.id}
              data-card
              className="
                snap-start shrink-0 flex
                basis-[85%] sm:basis-[55%] md:basis-[calc((100%-1.5rem)/3)] lg:basis-[calc((100%-2.25rem)/4)]
                aspect-[290/420]
              "
              style={{ animation: `fade-in 0.5s ease-out ${i * 90}ms both` }}
            >
              <ProductCard product={p} priority={i < 2} />
            </div>
          ))}


        </div>
      </div>
    </section>
  );
}

export default ProductCarousel;
