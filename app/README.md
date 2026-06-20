# Expense Tracker PWA

A mobile-first, offline-first personal expense tracker. Log daily expenses with
receipt photos, see category breakdowns and 12-month trends, and get budget
alerts — all stored locally on your device, no backend.

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** for styling (light/dark follows the system setting)
- **Recharts** for charts (lazy-loaded), **lucide-react** icons, **date-fns**
- **localStorage** for expense/budget/settings data
- **IndexedDB** (`idb-keyval`) for compressed receipt images
- **vite-plugin-pwa** for the installable, offline service worker

## Develop

```bash
cd app
npm install
npm run dev          # http://localhost:5173
```

## Build & preview

```bash
npm run build        # type-checks then builds to dist/
npm run preview
```

For a GitHub Pages build under `/tx-showcase/app/`:

```bash
VITE_BASE_PATH=/tx-showcase/app/ npm run build
```

The base path is env-driven (`VITE_BASE_PATH`, default `/`). CI sets it during
the Pages deploy — see `.github/workflows/deploy.yml`.

## Architecture

- `src/types` — domain types (Expense, Budgets, Settings, Category, …)
- `src/store` — Context + `useReducer` store with debounced localStorage persistence
- `src/lib` — pure helpers: `storage`, `receipts` (IndexedDB), `compress` (canvas),
  `analytics`, `dates`, `export`, `currency`
- `src/hooks` — `useAppStore`, `useBudgetStatus`, `useReceiptUrl`, `useToast`, `useTheme`
- `src/components` — UI primitives, expense/budget/analytics/settings building blocks
- `src/screens` — Dashboard, Add/Edit, Analytics, Settings (routed via `HashRouter`)

Receipts are compressed to ~200KB and stored as blobs in IndexedDB; expense
records reference them by id, keeping localStorage small. Orphaned receipt blobs
are pruned on load.

## Install on iPhone

Open the deployed URL in Safari → Share → **Add to Home Screen**. The app runs
standalone, portrait, and works offline after the first load.
