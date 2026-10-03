import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { z } from "zod";
import { getPaymentStatus } from "@/lib/payments.functions";
import { CART_KEY, PENDING_KEY } from "@/components/wedding/Checkout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pagamento")({
  validateSearch: z.object({ status: z.string().optional(), ref: z.string().optional() }),
  head: () => ({ meta: [
    { title: "Status do presente — Lucas e Cherlane" },
    { name: "description", content: "Acompanhe o status do seu presente para Lucas e Cherlane." },
    { property: "og:title", content: "Status do presente — Lucas e Cherlane" },
    { property: "og:description", content: "Acompanhe o status do seu presente." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: PaymentReturn,
});

const texts: Record<string, [string, string]> = {
  approved: ["Muito obrigado!", "Seu pagamento foi aprovado. Os noivos agradecem o carinho 💙"],
  pending: ["Pagamento em análise", "Assim que o Mercado Pago confirmar, o presente estará garantido. Você pode voltar aqui para conferir."],
  in_process: ["Pagamento em análise", "Assim que o Mercado Pago confirmar, o presente estará garantido."],
  rejected: ["Pagamento não aprovado", "Nenhum valor foi cobrado. Você pode tentar novamente com outro cartão ou usar o Pix."],
  cancelled: ["Pagamento cancelado", "Nenhum valor foi cobrado."],
  not_found: ["Pagamento não encontrado", "Ainda não localizamos o pagamento. Se você acabou de pagar, aguarde alguns instantes e atualize."],
  unknown: ["Não foi possível verificar", "Tente atualizar a página em instantes."],
};

function PaymentReturn() {
  const { ref } = Route.useSearch();
  const check = useServerFn(getPaymentStatus);
  const [status, setStatus] = useState<string>("loading");
  const load = () => {
    if (!ref || !/^[A-Za-z0-9-]{8,64}$/.test(ref)) return setStatus("not_found");
    let orderId = "";
    try { const p = JSON.parse(localStorage.getItem(PENDING_KEY) ?? "{}"); if (p.reference === ref) orderId = String(p.orderId ?? ""); } catch { /* ignora */ }
    if (!/^[A-Za-z0-9]{6,64}$/.test(orderId)) return setStatus("not_found");
    setStatus("loading");
    check({ data: { reference: ref, orderId } }).then((r) => {
      setStatus(r.status);
      // Carrinho só é limpo com pagamento APROVADO confirmado pela API.
      if (r.status === "approved") { localStorage.removeItem(CART_KEY); localStorage.removeItem(PENDING_KEY); }
    }).catch(() => setStatus("unknown"));
  };
  useEffect(load, [ref]);
  const [title, text]: [string, string] = texts[status] ?? (status === "loading" ? ["Verificando pagamento…", "Consultando o Mercado Pago."] : texts["pending"]!);
  return <div className="wedding-site"><main className="payment-return content-width"><div className="success">
    <h3>{title}</h3><p>{text}</p>
    <div className="payment-actions">
      {status !== "approved" && status !== "loading" && <Button variant="outline" onClick={load}>Atualizar status</Button>}
      <Button asChild><Link to="/" hash="presentes">Voltar ao site</Link></Button>
    </div>
  </div></main></div>;
}
