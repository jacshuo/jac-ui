# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

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
