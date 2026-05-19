# VR Marketplace

Teste técnico — micro frontends com Module Federation consumindo a [DummyJSON](https://dummyjson.com). Shell + 3 remotes (Header, Footer, Cards).

## Rodando

Requer Node 20.19+ (LTS) ou 22.13+ — restrição vinda de `jsdom@26` / `jest@30`. Testado em Node 22.

```bash
npm install
npm start            # sobe os 4 dev servers
```

App em `http://localhost:3000`. Cada remote também sobe standalone em 3001/3002/3003 pra desenvolvimento isolado. Se a 3000 estiver ocupada o shell pula pra próxima livre (e avisa no log).

Outros scripts úteis: `npm test`, `npm run lint`, `npm run storybook`. Build de produção: `npm run build` (gera os 4 `dist/` independentes) ou `npm run build:static` (mesma coisa + Storybook + junta tudo em `out/` pra hospedagem estática).

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

**Zustand** no lugar de Redux — o estado do carrinho é um slice só, compartilhado entre Header e Cards. Redux Toolkit dava pra usar, mas exigiria `Provider` no shell e boilerplate desproporcional. Zustand cobre o caso sem Provider e ainda permite o pin em `globalThis.__VR_CART_STORE__` ([cartStore.ts:72-76](packages/shared/src/store/cartStore.ts#L72-L76)) que blinda contra dupla-instanciação quando um remote roda standalone.

**TanStack Query** pra todo I/O — listagem com `useInfiniteQuery` (cache, refetch ao trocar filtro, cancelamento via `AbortSignal`), categorias com `staleTime: Infinity`, checkout via `useMutation`. Substituiu o `useState<LoadingState>` manual que daria pra fazer na unha.

**Singletons no Module Federation** — `react`, `react-dom`, `zustand`, `axios` e `@tanstack/react-query` marcados como singleton em todos os MFEs. Sem isso o store dupla-instancia e o carrinho do header não enxerga o que o Cards adicionou.

**Tailwind v4** com tokens da marca em `@theme` ([theme.css](packages/shared/src/styles/theme.css)) — evita reescrever a paleta em cada componente.

## Testes

Jest + Testing Library + `jest-environment-jsdom`, configurado via `jest --projects` (cada package roda os próprios). 67 testes cobrindo store, API client, hooks, componentes e o fluxo end-to-end do carrinho. Mocks via `jest.spyOn(http, "get")` em vez de `global.fetch`.

Storybook cobre os componentes principais isolados — `npm run storybook` (porta 6006). Stories setam o estado do store via `parameters.cart` / `parameters.filters` (decorator em [.storybook/preview.tsx](.storybook/preview.tsx)) e stubam o fetch por padrão.

## Build de produção

`npm run build` gera o `dist/` de cada package independente. `npm run build:static` empilha tudo (incluindo o Storybook) em `out/` pra hospedagem estática — o shell resolve os remotes por path relativo (`header@/header/remoteEntry.js`) e `publicPath: "auto"` cuida do resto. Em dev, o shell aponta pra URL absoluta (`http://localhost:3001/...`).

Pra testar o bundle de produção localmente: `npm run build:static && npx serve out`.

## Notas

Sem autenticação — `POST /carts/add` usa `userId: 1` fixo (DummyJSON é mock). `isOpen` do carrinho fica fora do `persist` propositalmente: F5 não reabre o modal.
