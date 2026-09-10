import infindaLogo from "@/assets/infinda-white.png.asset.json";

export function CreatedBy({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://infindadigital.store"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Criado por Infinda Digital"
      className={`group inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/80 hover:bg-primary hover:text-black hover:border-primary transition-colors ${className}`}
    >
      <span className="font-semibold">Criado por</span>
      <img
        src={infindaLogo.url}
        alt="Infinda Digital"
        className="h-4 w-auto object-contain transition-transform group-hover:scale-110 group-hover:invert"
      />
    </a>
  );
}
