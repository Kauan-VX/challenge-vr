/**
 * Configurações injetadas em tempo de build pelo Webpack DefinePlugin de cada MFE.
 * O fallback aqui serve apenas para testes e para o `tsc --noEmit` — em runtime,
 * `process.env.API_BASE_URL` é sempre uma string literal injetada na compilação.
 */
const inject = typeof process !== "undefined" ? process.env.API_BASE_URL : undefined;

export const API_BASE_URL = inject ?? "https://dummyjson.com";
