import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/modelos/sudu")({
  loader: () => {
    throw redirect({ to: "/modelos", search: { marca: "sudu" } });
  },
  component: () => null,
});
