// SERVER-ONLY. O sufixo ".server.ts" impede que este arquivo (e o Access Token) entre no bundle do navegador.
const MP_API_ORIGIN = "https://api.mercadopago.com";
const MP_TIMEOUT_MS = 12_000;

type MpFetchOptions = RequestInit & { idempotencyKey?: string };

/** O token é lido dentro de cada handler e nunca é incluído no bundle do navegador. */
export async function mpFetch(token: string, path: string, init: MpFetchOptions = {}) {
  if (!token) throw new Error("Credencial do Mercado Pago não configurada");
  if (!path.startsWith("/v1/")) throw new Error("Caminho inválido da API do Mercado Pago");
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");
  if (init.idempotencyKey) headers.set("X-Idempotency-Key", init.idempotencyKey);
  const { idempotencyKey: _k, ...rest } = init;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MP_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${MP_API_ORIGIN}${path}`, { ...rest, headers, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
  const text = await res.text();
  if (!res.ok) {
    // Nunca registra headers, token, dados do comprador ou corpo integral.
    console.error("Mercado Pago error", { status: res.status, path, requestId: res.headers.get("x-request-id") });
    throw new Error(`Mercado Pago respondeu ${res.status}`);
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("Resposta inválida do Mercado Pago");
  }
}

export type SafeStatus = "approved" | "pending" | "rejected" | "cancelled" | "not_found" | "unknown";

/** Status da Order (Checkout Pro / Orders API) → status exibido ao visitante. */
export function mapOrderStatus(o: { status?: string; transactions?: { payments?: { status?: string }[] } }): SafeStatus {
  const s = o.status ?? "";
  if (s === "processed") return "approved";
  if (s === "canceled" || s === "expired") return "cancelled";
  if (s === "failed") return "rejected";
  const pays = o.transactions?.payments ?? [];
  if (pays.some((p) => p.status === "processed")) return "approved";
  if (pays.length && pays.every((p) => p.status === "failed")) return "rejected";
  return "pending"; // created, action_required, processing…
}
