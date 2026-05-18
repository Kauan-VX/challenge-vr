# VR Marketplace

Teste técnico — micro frontends com Module Federation. Shell central + 3 remotes (Header, Footer, Cards) consumindo a API DummyJSON.

## Rodando

```bash
npm install
npm start
```

Sobe 4 dev servers via `concurrently`. App principal em **http://localhost:3000** (shell). Se a 3000 estiver ocupada, o shell faz fallback automático para a próxima porta livre (pulando 3001/3002/3003 — vai ver o log indicando a porta escolhida).

Cada remote também sobe standalone na sua porta para desenvolvimento isolado:

| Porta | Aplicação                  |
| ----: | -------------------------- |
|  3000 | Shell (entrada do produto) |
|  3001 | Header (standalone)        |
|  3002 | Footer (standalone)        |
|  3003 | Cards (standalone)         |

## Scripts

```
npm start              dev (4 servidores em paralelo)
npm run build          build de produção dos 5 packages
npm test               jest --projects (todos os packages)
npm run test:watch     jest em modo watch
npm run test:coverage  jest com cobertura
npm run lint           eslint nos packages
npm run format         prettier --write
npm run format:check   prettier --check
npm run storybook      Storybook em http://localhost:6006
npm run build-storybook  build estático em storybook-static/
```

### Storybook

Cobre os componentes principais isoladamente. Cada story configura `useCartStore` e `useFiltersStore` via `parameters.cart` / `parameters.filters` (decorator em [.storybook/preview.tsx](.storybook/preview.tsx) faz `setState` antes do render). Fetch é stubado por padrão pra evitar requisições reais.

## Estrutura

```
packages/
├── shared/   biblioteca interna: store, API, tipos, ícones, utils
├── shell/    host: error boundary, query client, federation dos remotes
├── header/   navbar (logo, busca, carrinho, modal), barra de categorias
├── footer/   rodapé institucional
└── cards/    grid de produtos com infinite scroll e stepper de carrinho
```

`@vr/shared` é importado por workspace npm e tem seus módulos `react`, `zustand`, `@tanstack/react-query` compartilhados como **singleton** via Module Federation — garante uma instância única do React e do store em runtime.

## Decisões técnicas

### Gerenciamento de estado: Zustand (não Redux)

O carrinho é estado global compartilhado entre Header e Cards (MFEs separados). Avaliei três caminhos:

- **Context da React**: fica preso ao Provider do MFE que o instancia. Cross-MFE só com Provider montado no shell, e cada remote precisaria importar o hook do mesmo módulo — frágil.
- **Redux Toolkit**: funciona, mas exige `Provider` no shell + boilerplate (slices, actions, thunks). Para um único slice de carrinho, é desproporcional.
- **Zustand** _(escolhido)_: store em módulo, sem Provider, com tipagem direta de actions/state. Cria-se uma instância única registrada em `globalThis.__VR_CART_STORE__` para sobreviver à possível dupla importação de `@vr/shared` em diferentes bundles (`packages/shared/src/store/cartStore.ts:23-26`).

**Persistência** — middleware `persist` salva `items` em `localStorage` com chave `vr.cart` e `version: 1`. `isOpen` fica de fora via `partialize` (não faria sentido o carrinho abrir sozinho ao recarregar). Versionamento permite invalidar dados antigos quando o schema do `CartItem` mudar.

### HTTP: axios + TanStack Query

Todo I/O passa por uma única instância do axios em [packages/shared/src/api/http.ts](packages/shared/src/api/http.ts) (`baseURL` da env, `timeout: 15s`, headers JSON). Em cima dela:

- `useInfiniteQuery` em [`useProducts`](packages/cards/src/hooks/useProducts.ts) para listagem + scroll infinito (cache, refetch automático ao trocar filtro, cancelamento via `AbortSignal`).
- `useQuery` em [`useCategories`](packages/shared/src/hooks/useCategories.ts) com `staleTime: Infinity` — categorias não mudam por sessão.
- `useMutation` em [`useCheckout`](packages/shared/src/hooks/useCheckout.ts) — substitui o `useState<CheckoutState>` manual no CartModal; estado de loading/error/success vem do React Query.

`axios` e `@tanstack/react-query` são compartilhados como **singleton** via Module Federation em todos os MFEs que consomem HTTP.

### Outros

- **React 18 + TypeScript strict** + Webpack 5 + `ModuleFederationPlugin`.
- **Tailwind v4** com tokens da marca em `@theme` ([packages/shared/src/styles/theme.css](packages/shared/src/styles/theme.css)).
- **Jest + Testing Library** com `jest-environment-jsdom`. 67 testes, 13 suites, cobrindo store, API, hooks, componentes e fluxos end-to-end de carrinho. Testes mockam a instância `http` via `jest.spyOn` (não `global.fetch`).

### Recursos implementados

- Listagem com **scroll infinito** (`IntersectionObserver` + fallback de botão para ambientes sem suporte).
- **Busca debounced** no header (300ms), aplicada a `/products/search`.
- **Filtro por categoria** com carrossel horizontal: setas no hover, fade gradient nas extremidades quando há overflow, traduções PT-BR das 24 categorias do DummyJSON.
- **Stepper de carrinho** no card: estado vazio mostra "Adicionar"; com 1 item, lixeira no lugar do "-"; com 2+, controles de incremento/decremento; `+` desabilita ao atingir o stock.
- **Animação fly-to-cart**: thumbnail clona, desenha arco até o botão do carrinho do header (`data-cart-target`), respeita `prefers-reduced-motion`.
- **Modal de checkout** com confirmação detalhada (lista de produtos, subtotal, economia, total).
- **Error boundaries** no shell (top-level + por remote) com sink de telemetria injetável (`setTelemetrySink`).

## APIs

DummyJSON:

| Método | Endpoint                               | Uso                                   |
| ------ | -------------------------------------- | ------------------------------------- |
| GET    | `/products?limit&skip`                 | listagem padrão paginada              |
| GET    | `/products/search?q&limit&skip`        | busca por texto                       |
| GET    | `/products/category/{slug}?limit&skip` | filtro por categoria                  |
| GET    | `/products/categories`                 | lista de categorias (slug, name, url) |
| POST   | `/carts/add`                           | finalização do pedido                 |

Base URL via env: `API_BASE_URL` (fallback `https://dummyjson.com`).

## Deploy (Vercel)

O projeto tem um [vercel.json](vercel.json) e um script `vercel-build` que combinam os 4 `dist/` em um único output:

```
out/
├── index.html        (shell)
├── main.[hash].js
├── favicon.ico
├── header/remoteEntry.js
├── footer/remoteEntry.js
└── cards/remoteEntry.js
```

**Como o shell encontra os remotes em produção?** [packages/shell/webpack.config.js](packages/shell/webpack.config.js) usa URLs distintas dependendo do mode:

- **Dev**: `header@http://localhost:3001/remoteEntry.js` (cada MFE no seu dev server)
- **Prod**: `header@/header/remoteEntry.js` (path relativo no mesmo origin)

Como `publicPath: "auto"` em todos os MFEs, os chunks de cada remote são resolvidos a partir do path do próprio `remoteEntry.js` — Webpack lida com isso sozinho.

**Na Vercel:** os defaults do `vercel.json` já cuidam de tudo. Se o painel da Vercel estiver com algum override (Build Command, Output Directory, Framework Preset), **limpe os campos** para a config do arquivo prevalecer.

Para testar o build local antes do deploy:

```bash
npm run vercel-build
npx serve out -p 5000   # ou qualquer static server
```

## Notas de produção

- Não persiste `isOpen` do carrinho propositalmente — F5 não reabre o modal.
- Não há autenticação: `POST /carts/add` usa `userId: 1` fixo (DummyJSON é mock).
