import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/**
 * Escuta mudanças na tabela `models` (Realtime) e invalida o cache do catálogo
 * e das páginas de produto — assim, qualquer edição no painel admin aparece
 * imediatamente em todos os navegadores abertos, sem recarregar a página.
 */
export function useModelsRealtime() {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("models-catalog-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "models" }, () => {
        void queryClient.invalidateQueries({ queryKey: ["models"], refetchType: "all" });
        void router.invalidate();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, router]);
}
