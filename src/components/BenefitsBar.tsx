import { CreditCard, Wallet, BadgePercent, Store, ShieldCheck, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import klugSymbol from "@/assets/klug/klug-symbol-white.png.asset.json";

export type Benefit = {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
};

const DEFAULT_BENEFITS: Benefit[] = [
  { id: "financ",   icon: CreditCard,   title: "Financiamento",       desc: "em até 36x (WhatsApp)" },
  { id: "cartao",   icon: Wallet,       title: "Pagamento Facilitado", desc: "em até 21x no cartão" },
  { id: "pix",      icon: BadgePercent, title: "No PIX",       desc: "ganhe desconto na hora!" },
  { id: "nacional", icon: Store,        title: "Fabricação Nacional",  desc: "scooters produzidas no Brasil" },
  { id: "oficial",  icon: ShieldCheck,  title: "Loja Oficial",         desc: "Unidade de Joinville" },
];

function useInViewOnce<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { setInView(true); io.disconnect(); }
      }),
      { threshold: 0.15 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

export function BenefitsBar({ items = DEFAULT_BENEFITS }: { items?: Benefit[] }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const scrollerRef = useRef<HTMLUListElement | null>(null);
  const pausedRef = useRef(false);

  // Auto-scroll horizontal em todas as telas (loop, pausa em interação)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (!reduce.matches && !pausedRef.current && el.scrollWidth > el.clientWidth + 4) {
        el.scrollLeft += (dt / 1000) * 40;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const pause = () => { pausedRef.current = true; };
    const resume = () => { pausedRef.current = false; };
    el.addEventListener("pointerdown", pause);
    el.addEventListener("pointerup", resume);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("pointerup", resume);
      el.removeEventListener("pointerleave", resume);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, []);

  return (
    <section aria-label="Benefícios" className="bg-black border-b border-white/5">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-8 py-5 sm:py-6">
        <ul
          ref={scrollerRef}
          className="
            flex gap-6
            overflow-x-auto scroll-smooth scroll-px-4
            [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          "
        >
          {items.map((b, i) => (
            <li
              key={b.id}
              className="shrink-0 basis-[75%] sm:basis-[45%] md:basis-[30%] lg:basis-[22%]"
              style={
                inView
                  ? { animation: `fade-in 0.5s ease-out ${i * 80}ms both` }
                  : { opacity: 0 }
              }
            >
              <div className="group flex items-center gap-3 md:justify-center md:text-left h-full">
                <span
                  className="
                    shrink-0 w-11 h-11 rounded-xl grid place-items-center
                    bg-primary text-primary-foreground
                    transition-all duration-300
                    group-hover:bg-primary/90
                    motion-safe:group-hover:scale-110
                  "
                  aria-hidden="true"
                >
                  <img
                    src={klugSymbol.url}
                    alt=""
                    className="w-6 h-6 object-contain"
                    loading="lazy"
                  />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold text-sm leading-tight break-words">
                    {b.title}
                  </p>
                  <p className="text-white/55 text-xs leading-snug mt-0.5 break-words">
                    {b.desc}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default BenefitsBar;
