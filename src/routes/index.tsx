import { createFileRoute } from "@tanstack/react-router";
import { WeddingSite } from "@/components/wedding/WeddingSite";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Lucas e Cherlane — Nosso Casamento" },
    { name: "description", content: "Todos os detalhes do casamento de Lucas e Cherlane, em 19 de dezembro de 2026." },
    { property: "og:title", content: "Lucas e Cherlane — Nosso Casamento" },
    { property: "og:description", content: "Celebre conosco este dia tão especial." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

function Index() {
  return <WeddingSite />;
}
