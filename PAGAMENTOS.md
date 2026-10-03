# Pagamentos — como configurar

## Valores públicos — `src/config/payment.ts`
| Campo | O que é |
|---|---|
| `PIX_KEY` | Sua chave Pix (CPF, e-mail, +55telefone ou aleatória). Pix vai direto para sua conta, sem acréscimo. |
| `PIX_RECEIVER_NAME` / `PIX_CITY` | Nome (≤25) e cidade (≤15) do recebedor, sem acentos. |
| `CREDIT_CARD_FEE_PERCENTAGE` / `CREDIT_CARD_FIXED_FEE` | Acréscimo que **vocês** definem para cobrir custos do cartão (não é a tarifa oficial do MP; ajuste conforme seu painel). |
| `MAX_INSTALLMENTS` | Parcelas máximas (1–12). |
| `MERCADO_PAGO_ENVIRONMENT` | `"test"` ou `"prod"`. |

Fórmula do cartão: `total = (subtotal + taxa_fixa) / (1 − percentual/100)`, arredondado para cima em centavos.
O acréscimo aparece assim que o convidado escolhe "Cartão", antes de ir ao Mercado Pago.

## Segredos — Lovable → Configurações do Projeto → Secrets (nunca no código)
- `MERCADO_PAGO_ACCESS_TOKEN_TEST` — Access Token **de produção da conta vendedora de teste** (a Orders API não aceita credenciais "TEST-").
- `MERCADO_PAGO_ACCESS_TOKEN_PROD` — Access Token de produção da sua conta real.
- `MERCADO_PAGO_WEBHOOK_SECRET` — "Assinatura secreta" em Suas integrações → Webhooks.

Esses nomes precisam existir nos Secrets deste projeto Lovable publicado. Segredos cadastrados apenas em outro ambiente de funções não são automaticamente disponibilizados ao servidor do site.
Os tokens são lidos somente dentro dos handlers do servidor e enviados ao helper `src/lib/mercadopago.server.ts`; nunca são retornados ao navegador. Nenhuma Public Key é necessária.

## Cartão — Checkout Pro via Orders API
`POST /v1/orders` (`type: "online"`, `processing_mode: "manual"`) com `X-Idempotency-Key` = referência única da compra.
Preços recalculados no servidor. O convidado é levado ao `checkout_url` do Mercado Pago.
Na volta, `/pagamento` consulta `GET /v1/orders/{id}` e confere o `external_reference` — o `?status=` da URL é ignorado.
O carrinho só é limpo com status aprovado (`processed`).

## Webhook
Em Suas integrações → Webhooks, URL `https://cherlaneelucas.life/api/public/mercadopago-webhook`, evento **Order (Mercado Pago)**.
Assinatura `x-signature` validada (HMAC + limite de 10 min) e o status é buscado na API.

## Primeiro teste sem dinheiro real
1. Crie contas de teste (vendedor e comprador) em Suas integrações → Contas de teste.
2. Na conta vendedora de teste, copie o Access Token de produção → `MERCADO_PAGO_ACCESS_TOKEN_TEST`.
3. Deixe `MERCADO_PAGO_ENVIRONMENT: "test"`, use no formulário o e-mail do comprador de teste terminado em `@testuser.com`, entre no Mercado Pago com essa conta e use um cartão de teste oficial.
4. Retorno automático e webhook exigem o site publicado (https).
