import { createEnv } from "@t3-oss/env-nextjs";

// Variáveis novas entram em server ou client, e de novo em runtimeEnv.
// O app ainda não tem nenhuma. O import em next.config.ts dispara a validação.
export const env = createEnv({
  server: {},
  client: {},
  runtimeEnv: {},
});
