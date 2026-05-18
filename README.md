# VR Marketplace — Micro Frontend com Module Federation

Aplicação React composta por **um shell host e três micro frontends remotos** (Header, Footer e Cards), integrados em tempo de execução via Webpack 5 Module Federation. O Header expõe um modal de carrinho que reflete, em tempo real, os produtos selecionados na lista renderizada pelo Cards — comunicação feita por meio de um store Redux compartilhado como singleton entre os MFEs.

Projeto desenvolvido como teste técnico para a vaga de Desenvolvedor Front End da VR.

## Stack

- **React 18** + **TypeScript** (strict mode)
- **Webpack 5** com `ModuleFederationPlugin`
- **Tailwind CSS v4** + **PostCSS** — tokens VR expostos via `@theme` em `packages/shared/src/styles/theme.css`
- **Redux Toolkit** + **react-redux** como singletons compartilhados entre MFEs
- **TanStack Query 5** (`@tanstack/react-query`) também singleton — cache de produtos atravessa as fronteiras de MFE
- **RxJS** para o debounce reativo da busca (`Subject` + `debounceTime` + `distinctUntilChanged`)
- **DummyJSON** como fonte de produtos e carrinho (`/products`, `/products/search`, `/carts/add`)
- **Jest** + **React Testing Library** para testes unitários e de integração
- **Storybook 8** para o catálogo de componentes
- **npm workspaces** organizando o monorepo
- **concurrently** orquestrando os dev servers

## Arquitetura

```
packages/
├── shared/   tipos, slice do cart, client HTTP, design tokens
├── shell/    host (porta 3000) — consome e compõe os remotes
├── header/   remote (porta 3001) — barra superior + modal do carrinho
├── footer/   remote (porta 3002) — rodapé institucional
└── cards/    remote (porta 3003) — listagem paginada de produtos
```

### Comunicação entre micro frontends

O ponto mais sensível em uma arquitetura de MFEs é o estado compartilhado. A escolha aqui foi um **store Redux único, mantido pelo shell e injetado via `Provider`**, com `react-redux` e `@reduxjs/toolkit` declarados como `singleton` no `ModuleFederationPlugin` de todos os pacotes.

Resultado:

- O Cards despacha `addItem(produto)` ao clicar em "Adicionar ao carrinho".
- O Header, em outro MFE, lê o estado via `useSelector(selectCartCount)` e o modal é renderizado reagindo às mesmas mudanças.
- Nenhum event bus, `window` event ou hack — apenas Redux atravessando os limites de bundle.

A definição do slice (`cartReducer`, actions, selectors) vive em `@vr/shared` e é importada por shell, header e cards. O Footer não consome estado.

### TanStack Query como singleton

O shell instancia um único `QueryClient` (`packages/shell/src/query/client.ts`) e o injeta via `QueryClientProvider`. Nos webpacks de shell e cards, `@tanstack/react-query` é declarado como `singleton`. Resultado: o Cards usa `useInfiniteQuery` para paginação, `useQuery` para categorias, e o **cache vive no shell** — se outro MFE precisar dos mesmos produtos no futuro, hit no cache, zero refetch. Cancellation, dedupe, retry e refetch on focus saem de graça.

### RxJS no debounce da busca

`useDebounced` é implementado com `BehaviorSubject` + `pipe(debounceTime, distinctUntilChanged)`. A escolha não é gratuita: é a forma idiomática de fazer streams reativos e o mesmo padrão adotado em projetos Angular (stack original da vaga). Trocar `setTimeout` por um Subject permite, no futuro, multiplexar a busca com outros streams (filtros, ordenação, paginação infinita por scroll) sem reescrever a base.

### Design system: Tailwind v4 + tokens VR

Toda a paleta, sombras, animações e largura máxima estão centralizadas em [`packages/shared/src/styles/theme.css`](packages/shared/src/styles/theme.css) dentro de um bloco `@theme` do Tailwind v4. Os tokens viram simultaneamente custom properties CSS (`var(--color-vr-primary)`) e classes utilitárias (`bg-vr-primary`, `text-vr-text-muted`, `animate-vr-shimmer`, `shadow-(--shadow-vr-md)`), garantindo coerência visual nos 4 MFEs sem duplicar valores.

Cada MFE tem seu próprio `src/styles/main.css` que faz:

```css
@import "tailwindcss";
@import "@vr/shared/src/styles/theme.css";
@source "../../../packages/<mfe>/src/**/*.{ts,tsx}";
```

Resultado: cada MFE compila só as classes que usa (Tailwind purga via `@source`), evitando bloat global. Os keyframes (`vrFade`, `vrSlide`, `vrShimmer`) ficam no `theme.css` para reuso e os componentes consomem via `animate-vr-fade`, `animate-vr-slide-in`, `animate-vr-shimmer`.

### Outras decisões de design

- **`React.lazy` + `Suspense`** no shell para carregar os remotes só quando aparecem em tela. Cada remote é envolvido por um `ErrorBoundary` que continua renderizando os demais MFEs caso um deles falhe.
- **Debounce reativo de 350ms** na busca, via RxJS, para evitar requisições a cada tecla.
- **`AbortController`** nas requisições, cancelando chamadas obsoletas quando filtros mudam ou o componente desmonta — TanStack Query injeta o `signal` automaticamente.
- **Paginação incremental** (botão "Carregar mais") com `useInfiniteQuery`.
- **Modal acessível**: `role="dialog"`, `aria-modal`, foco gerenciado, fechamento via Escape e clique no overlay, scroll lock no `<body>`. Render via `createPortal` para `document.body` (evita problemas de empilhamento entre MFEs).
- **Imagens com `loading="lazy"`** e fallback embutido em SVG para 404.
- **Layout responsivo** com `grid auto-fill`, breakpoints em 800px e 480px e variáveis CSS centralizadas em `packages/shared/src/styles/tokens.css`.

## Pré-requisitos

- Node.js 18+ (testado em **Node 22**)
- npm 9+

## Instalação

```bash
npm install
```

O comando instala o monorepo inteiro (workspaces). Os pacotes locais (`@vr/shared`, `@vr/header`, etc.) são linkados automaticamente.

## Scripts

Todos os scripts são executados a partir da raiz do projeto.

| Script                  | Descrição                                                                |
| ----------------------- | ------------------------------------------------------------------------ |
| `npm start`             | Sobe os 4 dev servers em paralelo (shell, header, footer, cards)         |
| `npm run build`         | Gera os artefatos de produção de todos os pacotes                        |
| `npm test`              | Executa toda a suíte de testes (Jest + RTL) dos 5 pacotes                |
| `npm run test:watch`    | Roda os testes em modo watch                                             |
| `npm run lint`          | Linta TS/TSX em todos os pacotes                                         |
| `npm run storybook`     | Inicia o Storybook em http://localhost:6006                              |
| `npm run build-storybook` | Gera build estático do Storybook em `storybook-static/`                |

### Portas usadas em desenvolvimento

| MFE     | URL                       |
| ------- | ------------------------- |
| Shell   | http://localhost:3000     |
| Header  | http://localhost:3001     |
| Footer  | http://localhost:3002     |
| Cards   | http://localhost:3003     |

Cada remote também pode ser aberto isoladamente na sua porta (`bootstrap.tsx` monta uma versão standalone para desenvolvimento e debug).

### Subir individualmente

Se preferir não usar o `concurrently`:

```bash
npm start -w @vr/header   # porta 3001
npm start -w @vr/footer   # porta 3002
npm start -w @vr/cards    # porta 3003
npm start -w @vr/shell    # porta 3000 — abra esta URL no navegador
```

Os 3 remotes precisam estar no ar **antes** do shell tentar consumir o `remoteEntry.js`. Se algum remote estiver offline, o `ErrorBoundary` correspondente mostra um aviso, mas o restante da aplicação continua funcionando.

## Build de produção

```bash
npm run build
```

Cada pacote escreve em `packages/<nome>/dist`. Em produção, basta servir os 4 diretórios `dist` em URLs públicas e ajustar `webpack.config.js` do shell para apontar para essas URLs (hoje fixadas em `localhost:300x`).

## Testes

```bash
npm test
```

Cobertura atual: **37 testes em 10 suites**, com `*.stories.*` ignorados via `testPathIgnorePatterns`, distribuídos assim:

- `@vr/shared` — reducer, selectors e formatter
- `@vr/header` — `Header` (badge e abertura do modal) e `CartModal` (lista, total, decremento, remoção, ESC, estado vazio, checkout via `POST /carts/add` em sucesso e erro)
- `@vr/footer` — renderização e semântica
- `@vr/cards` — `ProductCard` (preço com desconto, badge, dispatch), hook `useDebounced`, e `Cards` em integração com `fetch` mockado (carregamento, paginação, erro)
- `@vr/shell` — composição dos 3 remotes via Suspense (com mocks em `__tests__/mocks`) e configuração do store

## APIs externas

| Recurso        | Endpoint                                                  | Uso                                              |
| -------------- | --------------------------------------------------------- | ------------------------------------------------ |
| Produtos       | `GET https://dummyjson.com/products?limit=&skip=`         | Listagem paginada                                |
| Busca          | `GET https://dummyjson.com/products/search?q=&limit=`     | Campo de busca (debounce reativo via RxJS)       |
| Finalizar cart | `POST https://dummyjson.com/carts/add`                    | Botão "Finalizar pedido" no modal do Header      |

O `<link rel="preconnect">` para `dummyjson.com` no HTML do shell antecipa o handshake TLS.

## Estrutura de pastas detalhada

```
vr-frontend-teste-mfe/
├── jest.setup.ts                      # importa @testing-library/jest-dom para todos os pacotes
├── tsconfig.base.json                 # tsconfig herdado por todos os pacotes
├── package.json                       # workspaces + scripts orquestradores
└── packages/
    ├── shared/
    │   └── src/
    │       ├── api/products.ts        # GET /products, /products/search
    │       ├── api/carts.ts           # POST /carts/add, GET /carts/:id
    │       ├── store/cartSlice.ts     # slice + selectors memoizados
    │       ├── types/product.ts       # contratos da DummyJSON
    │       ├── styles/theme.css       # @theme do Tailwind v4 + keyframes
    │       ├── utils/format.ts        # Intl.NumberFormat (BRL)
    │       ├── assets/logo.png        # logo VR (referenciada pelos MFEs)
    │       └── index.ts               # barrel
    ├── shell/
    │   └── src/
    │       ├── App.tsx                # lazy + Suspense + ErrorBoundary
    │       ├── bootstrap.tsx          # entry assíncrono (padrão MF)
    │       ├── store/                 # configureStore com cartReducer
    │       ├── query/client.ts        # QueryClient singleton (TanStack)
    │       └── components/            # RemoteFallback, RemoteErrorBoundary
    ├── header/
    │   └── src/
    │       ├── Header.tsx             # exposto via MF como ./Header
    │       ├── Header.stories.tsx
    │       └── components/CartModal.tsx (+ stories)
    ├── footer/
    │   └── src/
    │       ├── Footer.tsx             # exposto via MF como ./Footer
    │       └── Footer.stories.tsx
    └── cards/
        └── src/
            ├── Cards.tsx              # exposto via MF como ./Cards
            ├── hooks/useProducts.ts   # useInfiniteQuery
            ├── hooks/useDebounced.ts  # RxJS Subject + debounceTime
            └── components/ProductCard.tsx (+ stories)
```

## Avaliação — onde cada item está

| Critério                       | Onde está implementado                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Ferramentas adotadas           | Webpack 5, MF, Tailwind v4, Redux Toolkit, TanStack Query, RxJS, Storybook, Jest, RTL, TS strict, npm workspaces |
| Consumo de API                 | `@vr/shared/src/api/{products,carts}.ts` + `useInfiniteQuery` em Cards                                |
| Design responsivo              | Grid auto-fill + variantes `sm:`/`md:`/`lg:` do Tailwind nos componentes                              |
| Gerenciamento de estado        | Redux Toolkit (carrinho) + TanStack Query (dados remotos), ambos singletons via MF                    |
| Performance                    | `React.lazy`, debounce reativo, `AbortController`, `React.memo`, cache compartilhado, lazy images     |
| Testes                         | 37 testes cobrindo reducer, componentes, hook RxJS, integração de MFEs e fluxo de checkout            |
| Semântica e organização        | HTML semântico (`header`, `main`, `footer`, `dialog`), monorepo por domínio + Storybook documentando  |
| Reaproveitamento de código     | Pacote `@vr/shared` (tipos, slice, API, tokens, assets) + stories para componentes reutilizáveis      |

## Storybook

```bash
npm run storybook
```

Acessível em http://localhost:6006. Stories existentes:

- `Header/Header` — vazio, com itens, modal aberto
- `Header/CartModal` — vazio e populado
- `Cards/ProductCard` — padrão, com desconto, título longo, sem imagem (fallback)
- `Footer/Footer`

Setup em `.storybook/main.ts` + `.storybook/preview.tsx`. O `preview` injeta `tokens.css`, monta o `QueryClientProvider` e o `Provider` Redux com store pré-carregado via `parameters.preloadedState` — assim cada story pode declarar seu estado inicial sem boilerplate. Addon **`@storybook/addon-a11y`** habilitado para audit WCAG em cada story.

## Notas

- Os 3 remotes compartilham `react`, `react-dom`, `react-redux`, `@reduxjs/toolkit` e `@tanstack/react-query` como **singletons** com `requiredVersion` fixado no `package.json` — evita duplicar React no bundle final e garante uma única instância de Provider e QueryClient.
- `transpileOnly: true` no `ts-loader` mantém o build de cada MFE rápido; a verificação de tipos do pacote `shared` roda no script `build` via `tsc --noEmit`.
- Os arquivos de teste do `shared` são excluídos do `tsconfig.json` dos MFEs para que o IDE não os interprete fora de contexto.
# challenge-vr
