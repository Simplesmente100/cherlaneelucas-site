import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { paymentConfig } from "@/config/payment";
import { mapOrderStatus, mpFetch } from "@/lib/mercadopago.server";

const MAX_AGE_MS = 10 * 60 * 1000;
const MAX_BODY_BYTES = 64 * 1024;
const webhookBodySchema = z.object({
  type: z.string().max(40).optional(),
  data: z.object({ id: z.union([z.string(), z.number()]).optional() }).optional(),
}).passthrough();

function hexToBytes(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

async function verifySignature(secret: string, manifest: string, signatureHash: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const expected = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(manifest)));
  const received = hexToBytes(signatureHash);
  if (expected.length !== received.length) return false;
  let difference = 0;
  for (let i = 0; i < expected.length; i += 1) {
    const expectedByte = expected[i] ?? 0;
    const receivedByte = received[i] ?? 0;
    difference |= expectedByte ^ receivedByte;
  }
  return difference === 0;
}

export const Route = createFileRoute("/api/public/mercadopago-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["MERCADO_PAGO_WEBHOOK_SECRET"];
        // Falha temporária: mantém o endpoint seguro e permite que o Mercado Pago tente novamente.
        if (!secret) return Response.json({ ok: false, error: "webhook_not_configured" }, { status: 503 });
        const url = new URL(request.url);
        const contentLength = Number(request.headers.get("content-length") ?? "0");
        if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return new Response("Payload too large", { status: 413 });
        const rawBody = await request.text();
        if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) return new Response("Payload too large", { status: 413 });
        let json: unknown;
        try {
          json = rawBody ? JSON.parse(rawBody) : {};
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const parsed = webhookBodySchema.safeParse(json);
        if (!parsed.success) return new Response("Invalid payload", { status: 400 });
        const body = parsed.data;
        const dataId = String(url.searchParams.get("data.id") ?? body?.data?.id ?? "");
        const sig = request.headers.get("x-signature") ?? "";
        const requestId = request.headers.get("x-request-id") ?? "";
        const parts: Record<string, string> = {};
        for (const p of sig.split(",")) { const [k, v] = p.trim().split("="); if (k && v) parts[k] = v; }
        const signatureTs = parts["ts"];
        const signatureHash = parts["v1"];
        if (!signatureTs || !signatureHash || !/^[a-fA-F0-9]{64}$/.test(signatureHash) || !/^[A-Za-z0-9-]{1,128}$/.test(requestId) || !/^[A-Za-z0-9]{1,64}$/.test(dataId)) return new Response("Invalid", { status: 401 });

        // Manifesto oficial: id:[data.id minúsculo];request-id:[x-request-id];ts:[ts];
        const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${signatureTs};`;
        if (!await verifySignature(secret, manifest, signatureHash)) return new Response("Invalid signature", { status: 401 });
        // Anti-replay (ts pode vir em segundos ou milissegundos).
        const raw = Number(signatureTs); const ts = raw < 1e12 ? raw * 1000 : raw;
        if (!Number.isFinite(ts) || Math.abs(Date.now() - ts) > MAX_AGE_MS) return new Response("Expired", { status: 401 });

        const tokenName = paymentConfig.MERCADO_PAGO_ENVIRONMENT === "prod"
          ? "MERCADO_PAGO_ACCESS_TOKEN_PROD"
          : "MERCADO_PAGO_ACCESS_TOKEN_TEST";
        const token = process.env[tokenName];
        if (!token) return Response.json({ ok: false, error: "payment_provider_not_configured" }, { status: 503 });

        // Sempre busca o status real na API — nunca confia no corpo da notificação.
        const type = String(body?.type ?? url.searchParams.get("type") ?? "");
        if (type === "order") {
          const o = await mpFetch(token, `/v1/orders/${dataId}`).catch(() => null) as { id?: unknown; status?: string; external_reference?: string; total_amount?: unknown } | null;
          if (!o) return Response.json({ ok: false, error: "provider_unavailable" }, { status: 503 });
          console.log("MP order", { id: o.id, status: o.status, mapped: mapOrderStatus(o), ref: o.external_reference, amount: o.total_amount });
        } else if (type === "payment") {
          const p = await mpFetch(token, `/v1/payments/${dataId}`).catch(() => null) as { id?: unknown; status?: string; external_reference?: string; transaction_amount?: unknown } | null;
          if (!p) return Response.json({ ok: false, error: "provider_unavailable" }, { status: 503 });
          console.log("MP payment", { id: p.id, status: p.status, ref: p.external_reference, amount: p.transaction_amount });
        }
        // Ponto de extensão: salvar em banco de dados / enviar e-mail aos noivos.
        return new Response("ok");
      },
    },
  },
});
