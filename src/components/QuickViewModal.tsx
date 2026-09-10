import { useEffect } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { X, MessageCircle, ArrowRight, Zap } from "lucide-react";
import type { Product } from "@/components/ProductCard";
import { buildWhatsAppFallbackUrl, openWhatsAppWithFallback } from "@/lib/models";

const displayFont = "'Bebas Neue', 'Urbanist', sans-serif";

type Props = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
};

export function QuickViewModal({ product, open, onClose }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  // Pré-carrega rota + dados + imagens quando o modal abre
  useEffect(() => {
    if (!open || !product?.slug) return;
    router
      .preloadRoute({ to: "/modelos/$slug", params: { slug: product.slug } })
      .catch(() => {});
    if (typeof window !== "undefined" && product.imagem) {
      const img = new Image();
      img.src = product.imagem;
    }
  }, [open, product?.slug, product?.imagem, router]);


  if (!open || !product) return null;

  const message = `Olá, Klug Motors! Tenho interesse na *${product.nome}${product.potencia ? " " + product.potencia : ""}*${product.preco ? ` (${product.preco})` : ""}. Pode me passar mais informações e condições?`;
  const waHref = buildWhatsAppFallbackUrl(message);

  const handleWa = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    openWhatsAppWithFallback(message);
  };


  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes de ${product.nome}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center transition"
        >
          <X size={18} />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative bg-white flex items-center justify-center p-6 min-h-[260px]">
            <span aria-hidden className="absolute top-3 left-3 text-primary">
              <Zap className="w-6 h-6" strokeWidth={2.4} fill="currentColor" />
            </span>
            {product.imagem && (
              <img
                src={product.imagem}
                alt={product.nome}
                className="max-h-[320px] w-auto object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.35)]"
              />
            )}
          </div>

          <div className="p-6 md:p-8 flex flex-col gap-4">
            <div>
              <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-2">
                Klug Motors
              </p>
              <h2
                className="text-primary italic uppercase leading-[0.9] tracking-[-0.01em] text-4xl md:text-5xl"
                style={{ fontFamily: displayFont, fontWeight: 400 }}
              >
                {product.nome}
                {product.potencia && (
                  <span className="text-white/90 text-2xl md:text-3xl not-italic ml-2">
                    {product.potencia}
                  </span>
                )}
              </h2>
            </div>

            {product.preco && (
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">A partir de</p>
                <p className="text-2xl font-black text-white">{product.preco}</p>
              </div>
            )}

            <p className="text-sm text-white/70 leading-relaxed">
              Fale agora com um consultor da Klug Motors pelo WhatsApp e receba condições, disponibilidade em estoque e simulação de financiamento personalizada.
            </p>

            <div className="mt-auto flex flex-col gap-2 pt-2">
              <a
                href={waHref}
                onClick={handleWa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-black font-display font-black uppercase tracking-widest text-xs px-5 py-3 rounded-full shadow-[0_10px_25px_-10px_rgba(37,211,102,0.7)] transition"
              >
                <MessageCircle size={16} strokeWidth={2.5} />
                Falar no WhatsApp
              </a>

              {product.slug ? (
                <Link
                  to="/modelos/$slug"
                  params={{ slug: product.slug }}
                  preload="intent"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-black uppercase tracking-widest text-xs px-5 py-3 rounded-full transition"
                >
                  Ver página completa <ArrowRight size={14} />
                </Link>
              ) : null}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;
