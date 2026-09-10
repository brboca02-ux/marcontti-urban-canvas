import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import klugSymbol from "@/assets/klug/klug-symbol.png.asset.json";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro na autenticação";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950 text-white">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/30 blur-[140px] animate-pulse" />
        <div
          className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-primary/20 blur-[160px] animate-pulse"
          style={{ animationDelay: "1.2s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
          }}
        />
      </div>

      {/* Back link */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur transition hover:border-primary hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Voltar ao site
      </Link>

      <div className="relative z-10 grid min-h-screen w-full lg:grid-cols-2">
        {/* Left brand panel */}
        <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-black/40 p-12 backdrop-blur-sm lg:flex">
          <div className="animate-fade-in">
            <img src={klugSymbol.url} alt="Klug Motors" className="h-14 w-auto" />
          </div>

          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "150ms" }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Painel administrativo
            </div>
            <h1 className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight">
              Controle total<br />
              <span className="text-primary">da sua frota.</span>
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-white/60">
              Gerencie modelos, imagens, preços e leads da Klug Motors em um só lugar.
              Acesso restrito a administradores autorizados.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.25em] text-white/40 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <span>Joinville · SC</span>
            <span className="h-px w-8 bg-white/20" />
            <span>Desde 2024</span>
          </div>
        </aside>

        {/* Right form panel */}
        <main className="flex items-center justify-center px-5 py-16 sm:px-10">
          <div className="w-full max-w-md animate-scale-in">
            {/* Mobile logo */}
            <div className="mb-8 flex items-center justify-center lg:hidden">
              <img src={klugSymbol.url} alt="Klug Motors" className="h-12 w-auto" />
            </div>

            <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-8 shadow-[0_30px_80px_-40px_rgba(248,96,0,0.35)] backdrop-blur-xl sm:p-10">
              <div className="animate-fade-in space-y-6">
                <div className="space-y-1">
                  <h2 className="font-display text-2xl font-black uppercase tracking-tight">
                    Bem-vindo de volta
                  </h2>
                  <p className="text-sm text-white/50">
                    Entre com suas credenciais para acessar o painel.
                  </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                  <label className="group block">
                    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                      E-mail
                    </span>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 transition group-focus-within:text-primary" />
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="voce@klugmotors.com"
                        className="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-primary focus:bg-black/70 focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </label>

                  <label className="group block">
                    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                      Senha
                    </span>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 transition group-focus-within:text-primary" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-primary focus:bg-black/70 focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Entrar
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-[10px] uppercase tracking-[0.25em] text-white/40">
                  Acesso restrito a administradores
                </p>
              </div>
            </div>


            <p className="mt-6 text-center text-[10px] uppercase tracking-[0.25em] text-white/30">
              © {new Date().getFullYear()} Klug Motors · Acesso restrito
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
