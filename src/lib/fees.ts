import { paymentConfig } from "@/config/payment";

/** Trabalha em centavos. Gross-up: total = (subtotal + fixa) / (1 - pct/100), arredondado para cima. */
export function cardTotals(subtotalCents: number) {
  const pct = Number(paymentConfig.CREDIT_CARD_FEE_PERCENTAGE);
  const fixedCents = Math.round(Number(paymentConfig.CREDIT_CARD_FIXED_FEE) * 100);
  if (!Number.isFinite(pct) || pct < 0 || pct >= 100) throw new Error("CREDIT_CARD_FEE_PERCENTAGE inválida");
  if (!Number.isFinite(fixedCents) || fixedCents < 0) throw new Error("CREDIT_CARD_FIXED_FEE inválida");
  if (!Number.isInteger(subtotalCents) || subtotalCents <= 0) throw new Error("Subtotal inválido");
  const totalCents = Math.ceil((subtotalCents + fixedCents) / (1 - pct / 100) - 1e-9);
  return { subtotalCents, feeCents: totalCents - subtotalCents, totalCents };
}

export const toBRL = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
