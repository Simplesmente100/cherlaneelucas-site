import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, CreditCard, Lock, QrCode, X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { wedding } from "@/content/wedding";
import { paymentConfig } from "@/config/payment";
import { cardTotals, toBRL } from "@/lib/fees";
import { buildPixPayload, isPixConfigured } from "@/lib/pix";
import { createCardCheckout } from "@/lib/payments.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const CART_KEY = "wedding-cart";
export const PENDING_KEY = "wedding-pending-payment";

function newRef() {
  return crypto.randomUUID();
}

export function Checkout({ cart, onClose }: { cart: string[]; onClose: () => void }) {
  const gifts = wedding.gifts.filter((g) => cart.includes(g.name));
  const subtotalCents = gifts.reduce((s, g) => s + Math.round(g.price * 100), 0);
  const card = useMemo(() => (subtotalCents > 0 ? cardTotals(subtotalCents) : null), [subtotalCents]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<"pix" | "card">("pix");
  const [step, setStep] = useState<"form" | "pix">("form");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string>("");
  const [qr, setQr] = useState("");
  // Uma referência por tentativa: reenviar reutiliza a mesma chave de idempotência.
  const [reference] = useState(newRef);
  const createCard = useServerFn(createCardCheckout);
  const pixReady = isPixConfigured(paymentConfig.PIX_KEY);
  const pixCode = useMemo(() => pixReady && subtotalCents > 0 ? buildPixPayload({ key: paymentConfig.PIX_KEY, name: paymentConfig.PIX_RECEIVER_NAME, city: paymentConfig.PIX_CITY, amountCents: subtotalCents, txid: "LC" + reference.replace(/-/g, "").slice(0, 20) }) : "", [pixReady, subtotalCents, reference]);

  useEffect(() => { if (pixCode) QRCode.toDataURL(pixCode, { margin: 1, width: 240 }).then(setQr); }, [pixCode]);
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);

  const copy = async (text: string, what: string) => { await navigator.clipboard.writeText(text); setCopied(what); setTimeout(() => setCopied(""), 2000); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!gifts.length) return setError("Seu carrinho está vazio.");
    if (name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(email)) return setError("Informe seu nome e um e-mail válido.");
    if (method === "pix") {
      if (!pixReady) return setError("A chave Pix ainda não foi configurada pelos noivos.");
      return setStep("pix");
    }
    if (loading) return;
    setLoading(true);
    try {
      const r = await createCard({ data: { reference, buyer: { name, email }, items: cart } });
      if (!r.ok) { setError(r.error); setLoading(false); return; }
      localStorage.setItem(PENDING_KEY, JSON.stringify({ reference, orderId: r.orderId, at: Date.now() }));
      window.location.href = r.url;
    } catch { setError("Erro de conexão. Tente novamente."); setLoading(false); }
  };

  return <div className="checkout-overlay" role="dialog" aria-modal="true" aria-label="Finalizar presente" onClick={onClose}>
    <div className="checkout-panel" onClick={(e) => e.stopPropagation()}>
      <Button variant="ghost" size="icon" className="checkout-close" aria-label="Fechar" onClick={onClose}><X /></Button>
      <h3>Presentear os noivos</h3>
      <ul className="checkout-items">{gifts.map((g) => <li key={g.name}><span>{g.name}</span><strong>{toBRL(Math.round(g.price * 100))}</strong></li>)}</ul>

      {step === "form" ? <form onSubmit={submit}>
        <label className="field"><span>Seu nome</span><Input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required /></label>
        <label className="field"><span>E-mail</span><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required /></label>
        <div className="pay-options" role="radiogroup">
          <button type="button" role="radio" aria-checked={method === "pix"} className={method === "pix" ? "active" : ""} onClick={() => setMethod("pix")}><QrCode /><span>Pix</span><small>sem acréscimo</small></button>
          <button type="button" role="radio" aria-checked={method === "card"} className={method === "card" ? "active" : ""} onClick={() => setMethod("card")}><CreditCard /><span>Cartão de crédito</span><small>até {paymentConfig.MAX_INSTALLMENTS}x via Mercado Pago</small></button>
        </div>
        <div className="checkout-summary">
          <div><span>Subtotal</span><span>{toBRL(subtotalCents)}</span></div>
          {method === "card" && card && <div><span>Acréscimo do cartão (definido pelos noivos)</span><span>{toBRL(card.feeCents)}</span></div>}
          <div className="total"><span>Total {method === "card" ? "no cartão" : "no Pix"}</span><strong>{toBRL(method === "card" && card ? card.totalCents : subtotalCents)}</strong></div>
          {method === "card" && <p>Acréscimo configurado pelos noivos para cobrir custos de pagamento ({paymentConfig.CREDIT_CARD_FEE_PERCENTAGE}% + {toBRL(Math.round(paymentConfig.CREDIT_CARD_FIXED_FEE * 100))} por compra) — não é a tarifa oficial do Mercado Pago. Juros de parcelamento, se houver, são mostrados pelo Mercado Pago antes de você confirmar.</p>}
        </div>
        {error && <p className="checkout-error" role="alert">{error}</p>}
        <Button type="submit" disabled={loading || !gifts.length}>{loading ? "Abrindo Mercado Pago…" : method === "card" ? "Continuar para o Mercado Pago" : "Gerar Pix"}</Button>
        <p className="checkout-secure"><Lock />{method === "card" ? "Os dados do cartão são digitados apenas no ambiente seguro do Mercado Pago." : "O Pix vai direto para a conta dos noivos."}</p>
      </form> : <div className="pix-step">
        <p>Pague <strong>{toBRL(subtotalCents)}</strong> pelo app do seu banco:</p>
        {qr && <img src={qr} alt="QR Code Pix" width={220} height={220} />}
        <Button variant="outline" onClick={() => copy(pixCode, "code")}>{copied === "code" ? <><Check />Copiado!</> : <><Copy />Copiar Pix Copia e Cola</>}</Button>
        <div className="pix-key"><span>Chave Pix: <strong>{paymentConfig.PIX_KEY}</strong></span><Button variant="ghost" size="sm" onClick={() => copy(paymentConfig.PIX_KEY, "key")}>{copied === "key" ? "Copiada" : "Copiar chave"}</Button></div>
        <small>Recebedor: {paymentConfig.PIX_RECEIVER_NAME} · Identificador: {reference.slice(0, 8).toUpperCase()}</small>
        <p className="checkout-secure"><Lock />Confira o nome do recebedor antes de confirmar no seu banco. A confirmação do Pix é feita pelos noivos no extrato.</p>
        <Button variant="ghost" onClick={() => setStep("form")}>Voltar</Button>
      </div>}
    </div>
  </div>;
}
