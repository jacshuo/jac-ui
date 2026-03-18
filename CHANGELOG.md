# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [0.1.8] — 2026-03-18

### Added

- **Per-component subpath exports** — Every component is now importable from its own entry point (e.g., `@jacshuo/onyx/Button`, `@jacshuo/onyx/Dialog`). Barrel import from `@jacshuo/onyx` still works.
- **Modular CSS** — CSS is split into independent files:
  - `styles.css` — full pre-compiled bundle (backward compatible)
  - `styles/base.css` — Tailwind utilities + core design tokens (no component extras)
  - `styles/tokens.css` — raw `@theme` tokens only (for projects with their own Tailwind setup)
  - `styles/CinePlayer.css`, `styles/MiniPlayer.css`, `styles/FileExplorer.css`, `styles/FilmReel.css` — per-component keyframes and design tokens
- **`.env` support** — Dev server port is now configurable via `DEV_PORT` in `.env` (defaults to 8080). Added `.env.example`.
- **Auto-discovery** — `tsup.config.ts` auto-discovers components from `src/components/`; no manual list needed when adding new components.

### Changed

- **Build system migrated from Webpack to tsup** (esbuild-based). Per-component ESM entries with code splitting; shared code extracted to `dist/chunks/`. CJS output also per-component.
- **Tree-shaking** fully enabled — `splitting: true`, `treeshake: true`, and `sideEffects: ["*.css"]` ensure bundlers can eliminate unused code.
- **`package.json` exports map** uses wildcard subpath patterns (`./*`) instead of listing every component — scales automatically as new components are added.
- Updated README with new import strategies (full, per-component, CSS options) and updated project structure.

### Removed

- `webpack.config.cjs` — Library builds now use tsup; only demo webpack configs remain.

### Build output (before → after)

| | Before (0.1.7) | After (0.1.8) |
|---|---|---|
| ESM | 1 file, 104.5 KB | 53 files, 117.3 KB total (0.08–0.23 KB per component entry, shared chunks) |
| CJS | 1 file, 112.5 KB | 53 files, 145 KB total |
| DTS | 1 file | 27 files, 43.2 KB |
| CSS | 1 file, 102 KB | 7 files: full (102 KB), base (95 KB), tokens (4.2 KB), 4 component CSS (0.6–2.5 KB each) |

---

## [0.1.7] — 2026-03-18

### Added

- **ESLint** — Flat config (`eslint.config.js`) with `typescript-eslint`, `eslint-plugin-react`, `react-hooks`, `react-refresh`, and Prettier integration.
- **Prettier** — Enforced consistent formatting (double quotes, trailing commas, 100-char width, LF line endings).
- **Husky + lint-staged** — Pre-commit hook automatically lints and formats staged `.ts`/`.tsx` files.
- New npm scripts: `lint`, `lint:fix`, `format`, `format:check`.

### Fixed

- ~2,100 formatting inconsistencies auto-fixed (quote style, trailing commas, spacing).
- Ternary-as-statement patterns replaced with `if/else` blocks (`CinePlayer`, `FileExplorer`, `FilmReel`, `MiniPlayer`, `Table`).
- Empty interfaces in `ImageCard` converted to type aliases.
- Unescaped HTML entities in `DialogPage` demo.
- Constant truthiness expression in `utils.test.ts`.

---

## [0.1.6] — 2026-03-18

### Changed

- **Semantic color system enforced across all components** — Replaced all hardcoded Tailwind color classes (`blue-*`, `gray-*`, `red-*`, `green-*`, `amber-*`) with semantic design tokens (`primary-*`, `secondary-*`, `danger-*`, `success-*`, `warning-*`) defined in `theme.css`. This makes theme customization truly one-stop: override the five semantic palettes in `theme.css` and every component follows.
  - **Chat** — Sender bubble now uses `primary-500/600` instead of `blue-500/600`.
  - **Dropdown** — Checkbox, badge, placeholder, and "Add item" CTA migrated from `blue-*`/`gray-*` to `primary-*`/`secondary-*`.
  - **DropdownButton** — Same checkbox/CTA/input fixes as Dropdown.
  - **Input** — Focus ring, error state, prefix/suffix/action areas all use semantic tokens.
  - **Table (DataTable)** — Toolbar buttons, selection highlight, editable cell, confirm/cancel icons, and checkboxes/radios all migrated.
  - **theme.ts (CVA variants)** — `badgeVariants`, `inputVariants`, and `alertVariants` now reference semantic colors exclusively.
- **Tests updated** to assert against semantic class names instead of raw color names.

### Fixed

- `package-lock.json` sync issue that caused CI `npm ci` to fail (`@noble/hashes` version mismatch).

### Notes

- **FileExplorer**, **FilmReel**, **MiniPlayer**, and **CinePlayer** are exempt from this change — they use their own component-level CSS custom properties (`--fe-*`, `--mp-*`, `--cp-*`) defined in `theme.css`.

---

## [0.1.5] — 2026-03-18

### Changed

- Renamed package from `@jac-ui/react` to `@jacshuo/onyx`.
- Updated all demo pages, README badges, install instructions, and issue templates to reflect the new name.

---

## [0.1.4] — 2026-03-18

### Added

- **"Why Onyx?" section** in README highlighting the desktop-first philosophy.
- **Roadmap section** in README explaining current responsiveness status and inviting community contributions.
- Enhanced **Features list** with keyboard-first and composable API highlights.

---

## [0.1.3] — 2026-03-17

### Added

- First successful automated release of `@jacshuo/onyx` to npm.
- Demo site deployed to GitHub Pages.
- GitHub Release with `.tar.gz` and `.zip` artifacts.
