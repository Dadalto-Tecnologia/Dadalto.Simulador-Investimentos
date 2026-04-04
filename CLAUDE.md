# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start Vite dev server at http://localhost:5173
npm run build     # type-check (vue-tsc) then generate production bundle in dist/
npm run preview   # serve the production build locally
```

There are no automated tests.

## Architecture

Single-page Vue 3 + TypeScript application that simulates and compares fixed-income investment returns (CDB, LCI/LCA, Poupança) against real Brazilian market indicators.

### Key files

| File | Role |
|---|---|
| `src/main.ts` | App bootstrap — registers PrimeVue (Aura theme), loads global array extensions, mounts `$formatar` as global property and injection token |
| `src/pages/Home.vue` | The only page — holds all simulation state, fetches all indicators on mount, renders the Highcharts bar chart, exposes a config dialog for manual rate overrides |
| `src/classes/API.ts` | Four Axios clients (`SelicClient`, `CDIClient`, `IPCAClient`, `PoupancaClient`), each with a `getAll()` returning a typed array |
| `src/classes/*.ts` | Strongly-typed models (`Selic`, `CDI`, `IPCA`, `Poupanca`) with static `fromJS()` factory methods |
| `src/interfaces/*.ts` | Raw API response shape interfaces |
| `src/data/urls.ts` | Centralized API endpoint constants (BCB and Ipeadata) |
| `src/classes/utils/array.ts` | Global `Array.prototype` extensions (`sum`, `orderByDescending`, `where`, `firstOrDefault`, etc.) — imported once in `main.ts`, available everywhere |
| `src/classes/utils/formatar.ts` | `Formatar` singleton — `moeda()`, `numero()`, `porcentagem()`, `data()`, `dataCompleta()`, `boolean()` — accessible in templates as `$formatar` |

### Path alias

`@` resolves to `src/` (configured in `vite.config.ts`).

### Data flow

1. `Home.vue` calls each `*Client.getAll()` on mount in parallel.
2. `valorSelic` / `valorCDI` / `valorIPCA` / `valorPoupanca` are computed from the raw arrays (SELIC and Poupança: full `.sum()`; CDI and IPCA: last 12 months via `.slice(-13, -1).sum()`).
3. `calcularRendimentos()` runs a month-by-month compound-interest loop over the three `InvestmentOption` objects.
4. Highcharts is rendered imperatively into `chartContainer` ref; subsequent changes call `series[0].setData()` / `xAxis[0].setCategories()` on the existing instance.

### Deployment

Push to `main` triggers `.github/workflows/publish.yml` — installs, builds, then FTP-deploys `dist/` to `/Simulador/` on the production server using secrets `WIN_HOST`, `WIN_USERNAME`, `WIN_PASSWORD`, `WIN_PORT`.
