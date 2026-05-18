# VR Marketplace

Teste técnico — micro frontends com Module Federation (shell + Header + Footer + Cards).

## Rodando

```bash
npm install
npm start
```

Sobe os 4 dev servers. Abre http://localhost:3000.

Portas: shell 3000, header 3001, footer 3002, cards 3003. Cada remote também roda standalone na sua porta.

## Scripts

```
npm start              dev (4 servidores)
npm run build          build de produção
npm test               jest
npm run test:coverage  com cobertura
npm run storybook      storybook em :6006
npm run lint
npm run format
```

## Stack e por quê

React 18 + TS strict, Webpack 5 + Module Federation.

Redux Toolkit como singleton via MF porque o cart precisa atravessar MFEs — Context fica preso ao Provider de um MFE, event bus é gambiarra.

TanStack Query (também singleton) pra cache de produtos, `useInfiniteQuery` pra paginação, cancelamento via `AbortSignal`. À mão são ~80 linhas frágeis.

RxJS no debounce da busca (`BehaviorSubject` + `debounceTime`). A vaga lista RxJS e é o padrão pra streams reativos.

Tailwind v4 com tokens da marca em `@theme` (`packages/shared/src/styles/theme.css`).

Jest + RTL. Storybook + addon-a11y.

## O que NÃO usei

- **Lucide / react-icons** — 6 SVGs próprios em `packages/shared/src/icons/` resolvem
- **MUI / Chakra / Ant** — overhead pra 3 componentes
- **RHF + Zod** — sem formulário real no escopo
- **Single-SPA** — MF cobre

## APIs

DummyJSON: `GET /products`, `GET /products/search`, `POST /carts/add`. Base via env `API_BASE_URL` (fallback `https://dummyjson.com`).
