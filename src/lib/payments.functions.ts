import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import { z } from "zod";
import { wedding } from "@/content/wedding";
import { paymentConfig } from "@/config/payment";
import { cardTotals } from "@/lib/fees";
import { mapOrderStatus, mpFetch } from "./mercadopago.server";

const refSchema = z.string().regex(/^[A-Za-z0-9-]{8,64}$/);
const orderIdSchema = z.string().regex(/^[A-Za-z0-9]{6,64}$/);
const money = (cents: number) => (cents / 100).toFixed(2);

type MpOrder = {
  id?: string | number;
  checkout_url?: string;
  external_reference?: string;
  status?: string;
  total_amount?: string | number;
  transactions?: { payments?: { status?: string }[] };
};

const MERCADO_PAGO_CHECKOUT_HOST = /(^|\.)mercadopago\.(?:com(?:\.[a-z]{2,3})?|cl)$/i;

/** Checkout Pro via Orders API (POST /v1/orders, type "online", processing_mode "manual"). */
export const createCardCheckout = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      reference: refSchema,
      buyer: z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(255) }),
      items: z.array(z.string().max(200)).min(1).max(50),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const secretName = paymentConfig.MERCADO_PAGO_ENVIRONMENT === "prod"
        ? "MERCADO_PAGO_ACCESS_TOKEN_PROD"
        : "MERCADO_PAGO_ACCESS_TOKEN_TEST";
      const token = process.env[secretName];
      if (!token) throw new Error(`Secret ${secretName} não configurado`);

      if (paymentConfig.MERCADO_PAGO_ENVIRONMENT === "test" && !data.buyer.email.toLowerCase().endsWith("@testuser.com")) {
        return { ok: false as const, error: "No ambiente de teste, use o e-mail da conta compradora de teste do Mercado Pago (@testuser.com)." };
      }

      // Preços SEMPRE recalculados no servidor a partir do arquivo do casamento.
      const unique = [...new Set(data.items)];
      const gifts = unique.map((n) => wedding.gifts.find((g) => g.name === n));
      if (gifts.some((g) => !g)) return { ok: false as const, error: "Algum presente não existe mais na lista." };
      const priced = gifts.flatMap((gift) => gift ? [{ name: gift.name, cents: Math.round(gift.price * 100) }] : []);
      const t = cardTotals(priced.reduce((s, g) => s + g.cents, 0));

      const items = priced.map((g, i) => ({ external_code: `GIFT-${i + 1}`, title: g.name.slice(0, 250), quantity: 1, unit_price: money(g.cents) }));
      if (t.feeCents > 0) items.push({ external_code: "ACRESCIMO-CARTAO", title: "Acréscimo do cartão (definido pelos noivos)", quantity: 1, unit_price: money(t.feeCents) });

      const origin = new URL(getRequestUrl()).origin;
      const back = (s: string) => `${origin}/pagamento?status=${s}&ref=${data.reference}`;
      const [first, ...rest] = data.buyer.name.split(/\s+/);
      const order = await mpFetch(token, "/v1/orders", {
        method: "POST",
        idempotencyKey: data.reference,
        body: JSON.stringify({
          type: "online",
          processing_mode: "manual",
          total_amount: money(t.totalCents), // = soma de items[].unit_price * quantity
          external_reference: data.reference,
          payer: { email: data.buyer.email, first_name: first, ...(rest.length ? { last_name: rest.join(" ") } : {}) },
          config: {
            statement_descriptor: "CASAMENTO LC",
            online: {
              success_url: back("success"), pending_url: back("pending"), failure_url: back("failure"),
              ...(origin.startsWith("https://") ? { auto_return: "approved" } : {}),
            },
            payment_method: {
              max_installments: Math.min(12, Math.max(1, paymentConfig.MAX_INSTALLMENTS)),
              not_allowed_types: ["ticket", "bank_transfer", "atm"],
            },
          },
          items,
        }),
      }) as MpOrder;
      if (!order?.checkout_url || !order?.id) throw new Error("Order sem checkout_url");
      const checkoutUrl = new URL(String(order.checkout_url));
      // O Mercado Pago usa domínios nacionais, como mercadopago.com.br e mercadopago.com.ar.
      if (checkoutUrl.protocol !== "https:" || !MERCADO_PAGO_CHECKOUT_HOST.test(checkoutUrl.hostname)) {
        throw new Error("checkout_url inválida");
      }
      return { ok: true as const, url: checkoutUrl.toString(), orderId: String(order.id), totalCents: t.totalCents };
    } catch (e) {
      console.error(e);
      return { ok: false as const, error: "Não foi possível iniciar o pagamento agora. Tente novamente em instantes." };
    }
  });

/** Consulta o status REAL da order no Mercado Pago (ignora o ?status= da URL de retorno). */
export const getPaymentStatus = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ reference: refSchema, orderId: orderIdSchema }).parse(d))
  .handler(async ({ data }) => {
    try {
      const secretName = paymentConfig.MERCADO_PAGO_ENVIRONMENT === "prod"
        ? "MERCADO_PAGO_ACCESS_TOKEN_PROD"
        : "MERCADO_PAGO_ACCESS_TOKEN_TEST";
      const token = process.env[secretName];
      if (!token) throw new Error(`Secret ${secretName} não configurado`);
      const o = await mpFetch(token, `/v1/orders/${encodeURIComponent(data.orderId)}`) as MpOrder;
      // A order precisa pertencer a esta compra.
      if (o?.external_reference !== data.reference) return { ok: true as const, status: "not_found" as const };
      return { ok: true as const, status: mapOrderStatus(o) };
    } catch {
      return { ok: false as const, status: "unknown" as const };
    }
  });
