# VR Marketplace

Teste técnico de micro frontends com Module Federation consumindo a [DummyJSON](https://dummyjson.com). Um shell e 3 remotes (Header, Footer, Cards).

## Rodando

Precisa de Node 20.19+ ou 22.13+ (jsdom@26 e jest@30 obrigam). Testei em v22.

```bash
npm install
npm start            # sobe os 4 dev servers
```

App em `http://localhost:3000`. Os remotes também sobem standalone nas 3001/3002/3003 se você quiser mexer num isolado. Se a 3000 estiver ocupada o shell escolhe a próxima livre e avisa no log.

Outros scripts: `npm test`, `npm run lint`, `npm run storybook`. Pra build: `npm run build` (4 `dist/` separados) ou `npm run build:static` (junta tudo + Storybook em `out/`).

## Estrutura

```
packages/
├── shared/   store, API client, tipos, ícones, utils  (workspace npm, não publicado)
├── shell/    host: error boundary, query client, federation dos remotes
├── header/   navbar + busca + carrinho/modal + barra de categorias
├── footer/   rodapé institucional
└── cards/    grid de produtos, scroll infinito, stepper, fly-to-cart
```

## Por que estas escolhas

Cart e filtros ficam no **Zustand**. Pensei em Redux Toolkit no começo, mas o estado é um array de items mais duas flags, não compensava o `Provider` no shell nem o boilerplate. O Zustand ainda permite pinar a store em `globalThis.__VR_CART_STORE__` ([cartStore.ts:72-76](packages/shared/src/store/cartStore.ts#L72-L76)), o que evita cada remote instanciar uma cópia própria quando roda standalone (foi o primeiro bug que apareceu).

I/O com **TanStack Query**. A listagem é `useInfiniteQuery` (cancela request com `AbortSignal` ao trocar filtro, reusa páginas no cache), categorias com `staleTime: Infinity` porque não mudam, checkout via `useMutation`. Substituiu um `useState<LoadingState>` manual que dava pra fazer na unha, mas o ganho com refetch e cache compensa.

No Module Federation marquei `react`, `react-dom`, `zustand`, `axios` e `@tanstack/react-query` como **singleton** em todos os MFEs. Sem isso o store duplica e o Header não enxerga o que o Cards adicionou.

Tailwind v4 com tokens da marca em `@theme` ([theme.css](packages/shared/src/styles/theme.css)).

## Testes

Jest + Testing Library + jest-environment-jsdom, via `jest --projects` (cada package roda os próprios). São 81 testes passando hoje, cobrindo store, API client, hooks, componentes e o fluxo end-to-end do carrinho. Os mocks de HTTP saem por `jest.spyOn(http, "get")` em vez de `global.fetch`, fica agnóstico ao adapter do axios.

Storybook em `npm run storybook` (porta 6006). As stories setam o estado da store via `parameters.cart`/`parameters.filters` e stubam o fetch (decorator em [.storybook/preview.tsx](.storybook/preview.tsx)).

## Build de produção

`npm run build` gera os 4 `dist/` independentes. O `build:static` junta tudo (com o Storybook) em `out/` pra hospedagem estática, o shell resolve os remotes por path relativo (`header@/header/remoteEntry.js`) e o `publicPath: "auto"` resolve o resto. Em dev as URLs ficam absolutas (`http://localhost:3001/...`).

Pra ver o bundle de produção localmente: `npm run build:static && npx serve out`.

## Notas

Sem autenticação. O `POST /carts/add` usa `userId: 1` fixo porque a DummyJSON é mock mesmo. O `isOpen` do carrinho fica propositalmente fora do `persist`, então F5 não reabre o modal.
