---
name: project-architecture
description: >
  Deep architecture reference for OnyxUI (@jacshuo/onyx). Load when you need to understand
  the full project structure, build pipeline, style system internals, component category system,
  export strategy, release workflow, or testing infrastructure. Keywords: architecture, project structure,
  build system, tsup, webpack, style system, tokens, CVA, export barrel, release pipeline, CI/CD,
  component categories, demo routing, test setup, postcss, tailwind v4 configuration.
---

# OnyxUI — Project Architecture Reference

## 1. Repository Identity

| Field | Value |
|---|---|
| Package | `@jacshuo/onyx` v2.1.0 |
| Description | Cross-platform React UI component library — web & Electron |
| Repo | `https://github.com/jacshuo/OnyxUI` |
| Demo | `https://jacshuo.github.io/OnyxUI` |
| Peer deps | `react >=18.0.0`, `react-dom >=18.0.0` |
| Bundled runtime deps | `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `shiki` |

---

## 2. Directory Layout

```
/
├── src/
│   ├── components/          UI components (10 category folders)
│   ├── styles/              Design tokens, Tailwind CSS entry points, CVA theme barrel
│   ├── lib/utils.ts         cn() helper (clsx + tailwind-merge)
│   └── __tests__/           36 test files, 519 tests (Vitest + jsdom)
├── demo/
│   ├── App.tsx              SPA shell: Header + SideNav + React Router v6 routes
│   ├── main.tsx             Webpack entry point
│   ├── demo.css             Demo-site global styles
│   └── pages/
│       ├── <Name>Page.tsx   One demo page per component (all React.lazy loaded)
│       ├── helpers.tsx       Shared demo primitives: Section, PageTitle, CodeExample, PropTable
│       │                    PageTitle auto-renders a cross-link badge (demo ↔ doc)
│       └── docs/
│           ├── DocsLayout.tsx  Docs shell with sidebar + nested routes
│           └── <Name>Doc.tsx   One doc page per component
├── scripts/build-css.mjs    PostCSS CSS build for library output
├── dist/                    Library build output (ESM + CJS, published to npm)
├── dist-demo/               Demo site build output (GitHub Pages)
└── .github/
    ├── agents/              6 AI agent mode files (*.agent.md)
    ├── instructions/        component-generation.instructions.md (auto-applied)
    ├── skills/              changelog-writer/, component-audit/, project-architecture/
    ├── prompts/             4 slash command prompts (*.prompt.md)
    └── workflows/           ci.yml, release.yml
```

---

## 3. Component Inventory (10 categories)

Each category = subfolder under `src/components/` with its own `index.ts` barrel.

| Category | Components |
|---|---|
| **Primitives** | Avatar, Badge, Button, Checkbox, Dropdown, DropdownButton, Indicator, Input, Label, Radio, Slider, Switch, Tag, TextBox |
| **Layout** | Card, ImageCard, Panel |
| **DataDisplay** | Chat, CodeBlock, List, MetricCard, Stat, Table, Tree |
| **Navigation** | Breadcrumb, Header, NavLink, Pagination, RibbonBar, SideNav |
| **Disclosure** | Accordion, Tabs |
| **Overlay** | ContextMenu, Dialog, Drawer, Tooltip |
| **Feedback** | Alert, ProgressBar, Skeleton, Spin, Toast |
| **Extras** | CinePlayer, CommandPalette, DateTimePicker, FileExplorer, FilmReel, Masonry, MiniPlayer, Timeline, TypewriterText |
| **Forms** | Form, Select |
| **Chart** | BarChart, LineChart, PieChart, ScatterChart |

### Per-component file structure (canonical — simple components)
```
src/components/<Category>/<Name>/
├── index.ts          export * from "./<Name>"
├── <Name>.tsx        implementation (CVA props + cn())
└── <Name>.css        component-local CSS (may be empty)
```

### Per-component file structure (heavy/complex components)
```
src/components/<Category>/<Name>/
├── index.ts
├── <Name>.tsx          main view / composition
├── <Name>.logic.ts     state & interaction orchestration
├── <Name>.hooks.ts     component-specific hooks
├── <Name>.utils.ts     pure helpers
├── <Name>.css
└── types.ts            public + internal types
```

**Complexity threshold:** use the multi-file layout when any of these apply: >500 lines total, complex state orchestration, heavy animation, broad prop API, or the component belongs in `Extras`. When borderline, prefer `Extras`.

### CVA variant convention
- Variant functions live in `src/styles/theme/<category>.ts` — **not** inside the component file
- Always use semantic tokens: `bg-primary-500`, `text-danger-600`, etc.
- Never use raw Tailwind palette: `bg-slate-500`, `text-rose-600`, etc.
- Always set `defaultVariants`

---

## 4. Style System

### File inventory

| File | Purpose |
|---|---|
| `src/styles/tokens/core.css` | `@theme {}` block — semantic ↔ Tailwind palette mapping |
| `src/styles/tokens/animations-shared.css` | Animation tokens, `@keyframes`, `@utility` |
| `src/styles/tokens.css` | Entry: imports `core.css` + `animations-shared.css` |
| `src/styles/base.css` | `@import "tailwindcss"` + tokens + dark variant (dev) |
| `src/styles/index.css` | Full library bundle: Tailwind + tokens + all component CSS |
| `src/styles/tailwind.css` | Consumer integration: `@source ".."` + tokens + dark variant |
| `src/styles/theme.ts` | TypeScript barrel — re-exports all CVA variant functions |

### Semantic color mapping (`tokens/core.css`)

| Semantic scale | Tailwind base palette |
|---|---|
| `primary-{50–900}` | `slate` |
| `secondary-{50–900}` | `gray` |
| `success-{50–900}` | `emerald` |
| `danger-{50–900}` | `rose` |
| `warning-{50–900}` | `orange` |

### Tailwind v4 configuration

- **No `tailwind.config.js`** — 100% CSS-driven
- `@import "tailwindcss"` in `base.css` and `index.css`
- Design tokens in `@theme {}` blocks inside `tokens/core.css`
- Dark mode: `@custom-variant dark (&:where(.dark, .dark *))` — `.dark` class on root element

### Theme barrel (`src/styles/theme.ts`) — CVA exports by domain

| File | Exports |
|---|---|
| `./theme/primitives` | button, badge, indicator, input, label, checkbox, radio, switchTrack |
| `./theme/layout` | card, panel |
| `./theme/data-display` | table, list, listItem, treeItem, codeBlock |
| `./theme/disclosure` | accordion (3 parts), tab (2 parts) |
| `./theme/overlay` | dialogContent, tooltip |
| `./theme/navigation` | navLink |
| `./theme/feedback` | progressBar, spin, alert |
| `./theme/form` | form, formItem, formValidation |
| `./theme/chart` | chart-related variants |

---

## 5. Build Pipeline

### Library build: tsup

**Entry points:**
- `src/index.ts` → `dist/index.{js,cjs,d.ts}`
- `src/lib/utils.ts` → `dist/utils.{js,cjs,d.ts}`
- `src/styles/theme.ts` → `dist/theme.{js,cjs,d.ts}`
- Per category: `src/components/<Cat>/index.ts` → `dist/<Cat>/index.{js,cjs,d.ts}`
- Per component: `src/components/<Cat>/<Name>/index.ts` → `dist/<Cat>/<Name>.{js,cjs,d.ts}`

**Key settings:** `format: ["esm","cjs"]`, `treeshake: true`, `minify: true`, `splitting: false`, `experimentalDts: true`

**Externalized:** react, react-dom, class-variance-authority, clsx, lucide-react, tailwind-merge, shiki + `@shikijs/langs/*`

### CSS build: `scripts/build-css.mjs`

PostCSS on `src/styles/index.css` → `dist/styles.css`. Also copies token and component CSS.

### Demo build: webpack + PostCSS

- **Dev:** `webpack.dev.config.cjs` → port 3001, HMR, `eval-source-map`, ForkTsCheckerWebpackPlugin
- **Prod:** `webpack.demo.config.cjs` → `dist-demo/assets/`, `publicPath: /OnyxUI/`, HtmlWebpackPlugin + 404.html for SPA, InjectBase plugin for `<base href>`, code-split (react, lucide, vendor chunks)
- Both use `@tailwindcss/postcss` (Tailwind v4 single-plugin integration)

### TypeScript config

- `tsconfig.json` — `target: ES2020`, `module: ESNext`, `moduleResolution: bundler`, `jsx: react-jsx`, `strict: true`, path alias `@` → `src/`, includes `src/**/*` + `demo/**/*`
- `tsconfig.build.json` — extends base, `emitDeclarationOnly: true`, includes `src/**/*` only

---

## 6. Export Strategy (`src/index.ts`)

```ts
// 1. Flat named — tree-shakeable, preferred
import { Button, Alert } from "@jacshuo/onyx"

// 2. Category namespace
import { Primitives } from "@jacshuo/onyx"; Primitives.Button

// 3. Default Onyx object
import Onyx from "@jacshuo/onyx"; Onyx.Primitives.Button

// 4. Deep path — max tree-shaking
import { Button } from "@jacshuo/onyx/Primitives/Button"
```

`"sideEffects": ["*.css"]` — all JS exports are tree-shakeable.

Package exports also expose:
- `@jacshuo/onyx/theme` → CVA variants barrel
- `@jacshuo/onyx/utils` → `cn()` only
- `@jacshuo/onyx/styles.css` → compiled CSS bundle

---

## 7. Demo Site Architecture

**URL structure:**

| Path pattern | Content |
|---|---|
| `/` | Redirects to `/button` |
| `/<slug>` | Demo page for that component |
| `/docs/<slug>` | Doc page for that component |
| `/docs` | Redirects to `/docs/button` |

**Demo ↔ Doc slug mapping** (slugs differ for charts):

| Demo route | Doc route |
|---|---|
| `/linechart` | `/docs/line-chart` |
| `/barchart` | `/docs/bar-chart` |
| `/piechart` | `/docs/pie-chart` |
| `/scatterchart` | `/docs/scatter-chart` |
| All others | slug is identical |

**Shell (`demo/App.tsx`):**
- `<Header>` with Gem icon, version badge from package.json, GitHub link via simple-icons
- `<SideNav>` with `navItems` (8 groups), search filter, `mobileDrawerSlot` with search input
- `<Routes>` — React Router v6, all pages `React.lazy()` + `<Suspense>`
- Theme toggle (dark/light class on `<html>`)

**Docs shell (`demo/pages/docs/DocsLayout.tsx`):**
- Left sidebar: `<SideNav>` with docs nav items, search filter, `mobileDrawerSlot` with search input
- Right: `<main>` with nested `<Routes>` for doc page components

**Demo helpers (`demo/pages/helpers.tsx`):**
- `<Section title>` — section wrapper with label
- `<PageTitle>` — h1 + auto cross-link badge (reads `useLocation()`, links demo↔doc)
- `<CodeExample code [language]>` — wraps `<CodeBlock>`
- `<PropTable rows [title]>` — renders a `<Table>` prop reference

**All components imported from `../src`** (local dev, not npm). Doc pages import from `../helpers`.

**SideNav mobile behavior:**
- Draggable pull-tab pinned to viewport edge (left or right)
- Drag up/down to reposition, across to swap edge; position persisted in `localStorage`
  - `"onyx-sidenav-side"` → `"left"` | `"right"`
  - `"onyx-sidenav-top"` → vertical position as % of viewport height
- `mobileDrawerSlot` prop injects content (e.g. search) between drawer header and nav list

---

## 8. Complete Route Table

### Demo routes (`demo/App.tsx`)

```
/button  /badge  /indicator  /label  /input  /dropdown  /switch  /checkbox  /radio  /textbox
/card  /image-card  /panel
/table  /list  /tree  /chat  /code-block
/header  /sidenav  /nav-link  /breadcrumb  /pagination  /ribbon-bar
/accordion  /tabs
/dialog  /tooltip  /drawer  /context-menu
/alert  /toast  /progress-bar  /spin  /skeleton
/film-reel  /mini-player  /cine-player  /file-explorer  /masonry
/typewriter-text  /command-palette  /date-time-picker  /timeline
/form
/linechart  /barchart  /piechart  /scatterchart
/avatar  /slider  /tag  /stat  /metric-card
```

Aliases: `/forms/select` → `/dropdown`, `/select` → `/dropdown`

### Doc routes (`/docs/<slug>`)

```
button  badge  indicator  label  input  textbox  checkbox  radio  switch  dropdown  form
card  image-card  panel  masonry
table  list  tree  chat  code-block
header  sidenav  nav-link  breadcrumb  pagination  ribbon-bar
accordion  tabs
dialog  tooltip  drawer  skeleton  toast  command-palette
alert  progress-bar  spin  film-reel  mini-player  cine-player  file-explorer
typewriter-text  avatar  slider  tag  stat  metric-card  timeline  context-menu  ribbon-bar  date-time-picker
bar-chart  line-chart  pie-chart  scatter-chart
```

---

## 9. Testing Infrastructure

- **Runner:** Vitest (globals: true — no need to import describe/it/expect)
- **Environment:** jsdom
- **Setup:** `src/__tests__/setup.ts` — imports `@testing-library/jest-dom/vitest`, stubs ResizeObserver
- **CSS:** disabled in tests (`test.css: false`)
- **Coverage:** 60% statements/lines, 50% branches/functions
- **Path alias:** `@` → `/src` (matches tsconfig)
- **Test count:** 36 test files, 519 tests
- **Location:** `src/__tests__/<ComponentName>.test.tsx`
- **Naming:** `describe("<ComponentName>") { it("<behavior>") }`
- **Special files:** `exports.test.ts` (verifies public surface), `theme.test.ts` (CVA variants), `utils.test.ts` (cn())

---

## 10. CI/CD Workflow

### `ci.yml` — runs on push/PR to `main`
Node 20 + 22 matrix: `npm ci` → `typecheck` → `test` → `dist` (cancel-in-progress)

### `release.yml` — manual `workflow_dispatch`
Input: `bump` (patch | minor | major, default: patch)

| Job | Action |
|---|---|
| `version` | `npm version $bump` → commit + tag + push |
| `publish` (after version) | `npm ci` + `test` + `dist` + `npm publish --access public` |
| `github-release` + `deploy-demo` (parallel, after publish) | GitHub Release + GitHub Pages |

---

## 11. Agent System

| Agent | Scope |
|---|---|
| `Onyx Component Expansion Agent` | New components: src + demo page + doc page + tests |
| `Onyx Component Enhancer Agent` | Iterate existing components, demo pages, App.tsx, demo site config |
| `Onyx Bug Hunter Agent` | Reproduce + fix bugs, validate with tests, commit |
| `Onyx Refactor Agent` | Architecture cleanup, tree-shaking, instruction-conflict check |
| `Onyx Dependencies Maintainer Agent` | npm audit, version upgrades, peer conflicts |
| `Onyx Release Orchestrator Agent` | Trigger + monitor release via `gh` CLI |

**Always-on:** `.github/instructions/component-generation.instructions.md`
→ Applied to `src/components/**/*.tsx`, `demo/pages/**/*.tsx`, `demo/App.tsx`, `src/index.ts`, `src/styles/**/*.css`

---

## 12. Key Conventions (cheatsheet)

| Convention | Rule |
|---|---|
| Semantic tokens | `primary-*` `secondary-*` `success-*` `danger-*` `warning-*` — never raw palette |
| Dark mode | `.dark` class on `<html>`, CSS `@custom-variant dark` — no config flag |
| CVA variants | Always in `src/styles/theme/<category>.ts`, always set `defaultVariants` |
| className merging | `cn(variants({…}), className)` — `cn()` always last |
| Component file count | Minimum 3 (index + .tsx + .css); expand to multi-file for complex components |
| Category barrel | `src/components/<Cat>/index.ts` re-exports all components in folder |
| Demo imports | `import { X } from "../../src"` (local, not npm); doc pages use `import from "../helpers"` |
| Test file | One per component: `src/__tests__/<Name>.test.tsx` |
| Brand icons | `import { siGithub } from "simple-icons"` (devDep, demo-only) |
| Husky | Pre-commit hooks active via `husky` + `prepare` script |
| No Tailwind config | Tailwind v4: 100% CSS-driven |
| `Chart` category | New 10th category — `BarChart`, `LineChart`, `PieChart`, `ScatterChart` |
| Cross-link badge | `PageTitle` in helpers.tsx auto-renders demo↔doc nav link via `useLocation()` |
