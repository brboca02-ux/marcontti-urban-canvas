import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/modelos/yamaha")({
  loader: () => {
    throw redirect({ to: "/modelos", search: { marca: "yamaha" } });
  },
  component: () => null,
});
