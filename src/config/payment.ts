/**
 * CONFIGURAÇÃO DE PAGAMENTOS — edite livremente os valores PÚBLICOS abaixo.
 *
 * NUNCA coloque o Access Token do Mercado Pago aqui. Segredos ficam em
 * Configurações do Projeto → Secrets (veja PAGAMENTOS.md):
 *   - MERCADO_PAGO_ACCESS_TOKEN_TEST  (Access Token de PRODUÇÃO da conta VENDEDORA DE TESTE — a Orders API não aceita "TEST-...")
 *   - MERCADO_PAGO_ACCESS_TOKEN_PROD  (Access Token de produção da sua conta real, "APP_USR-...")
 *   - MERCADO_PAGO_WEBHOOK_SECRET     (assinatura secreta dos webhooks)
 */
export const paymentConfig = {
  // ===== PIX PRÓPRIO (recebido direto na sua chave, sem Mercado Pago) =====
  PIX_KEY: "COLOQUE_SUA_CHAVE_PIX_AQUI", // ✏️ EDITE: CPF, e-mail, telefone (+55...) ou chave aleatória
  PIX_RECEIVER_NAME: "CHERLANE E LUCAS", // ✏️ máx. 25 caracteres, sem acentos
  PIX_CITY: "PARNAIBA", // ✏️ máx. 15 caracteres, sem acentos

  // ===== CARTÃO (Mercado Pago Checkout Pro) =====
  /** Taxa percentual que o casal quer repassar (ex.: 4.98). Não é a tarifa oficial do MP — confira no seu painel. */
  CREDIT_CARD_FEE_PERCENTAGE: 0, // ✏️
  /** Taxa fixa em reais por transação (ex.: 0.40). */
  CREDIT_CARD_FIXED_FEE: 0, // ✏️
  /** Número máximo de parcelas exibidas no Checkout do Mercado Pago (1 a 12). */
  MAX_INSTALLMENTS: 12, // ✏️

  /** "test" usa credenciais/sandbox de teste; "prod" cobra de verdade. */
  MERCADO_PAGO_ENVIRONMENT: "test" as "test" | "prod", // ✏️ troque para "prod" quando for ao ar

  /** Não é necessária no Checkout Pro (redirecionamento). Deixe vazia. */
  MERCADO_PAGO_PUBLIC_KEY: "",
} as const;
