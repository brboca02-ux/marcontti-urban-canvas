import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "@/components/ui/animated-sign-in";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Área restrita | Klug Motors" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});
