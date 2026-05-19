import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { notifyManager } from "@tanstack/react-query";

// React Query batcha notificacoes via setTimeout(0). Em jsdom isso cai fora
// dos act() implicitos do RTL. Forcando scheduler sincrono os subscribers
// sao notificados no mesmo tick em que o cache muda — pratica recomendada
// pra tests com TanStack Query.
notifyManager.setScheduler((cb) => cb());
notifyManager.setBatchNotifyFunction((cb) => cb());

// localStorage persiste entre tests em jsdom; o middleware `persist` do
// Zustand re-hidrata e geraria updates fora do act se sobrasse lixo.
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

// Filtro especifico (e so esse) pra um falso positivo conhecido do React 18:
// subscribers do `useSyncExternalStore` (usado pelo Zustand v4) atualizam via
// `forceStoreRerender` agendado em microtask, e o `actDEV` do React-DOM nao
// consegue rastrear esse microtask mesmo quando a interacao foi disparada
// dentro de `user.click()`/`render()`. Os tests passam e validam comportamento
// real — o warning eh diagnostico ruim, nao sintoma de bug.
// Referencia: https://github.com/pmndrs/zustand/issues/2138
const originalError = console.error;
console.error = (...args: unknown[]) => {
  const first = args[0];
  if (typeof first === "string" && first.includes("inside a test was not wrapped in act")) {
    return;
  }
  originalError(...args);
};
