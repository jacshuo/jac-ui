---
description: "Use when creating or modifying UI components, component demo pages, routing/category wiring, component styles, and release/debug delegation in this repo. Enforces tree-shaking, Tailwind CSS v4 strategy, responsive multi-platform UX, creative animation quality, demo-page requirements, and agent handoff rules."
name: "Onyx Component Generation Rules"
applyTo: ["src/components/**/*.tsx", "demo/pages/**/*.tsx", "demo/App.tsx", "src/index.ts", "src/styles/**/*.css"]
---
# Onyx Component Generation Rules

## Agent task routing (consult first)

| Task type | Delegate to |
|---|---|
| New component (source + demo page + doc page + tests) | `Onyx Component Expansion Agent` |
| Enhance / iterate existing component or demo page | `Onyx Component Enhancer Agent` |
| Bug fix / reproduce / debug | `Onyx Bug Hunter Agent` |
| Dependency audit / upgrade / security | `Onyx Dependencies Maintainer Agent` |
| Refactor / architecture cleanup | `Onyx Refactor Agent` |
| Release / publish / CI pipeline | `Onyx Release Orchestrator Agent` |

> **Conflict protocol**: if a user command conflicts with this instruction or the selected agent definition, pause immediately, present the conflict, and ask for explicit text resolution before continuing. Never silently pick a side.

---

## 1. Tree-shaking and exports

- Every component must be tree-shakeable and side-effect-free.
- Export each component and its types individually from `src/index.ts`.
- `index.ts` barrel files must be export-only — no business logic, rendering, or side effects.

## 2. File organization

**Simple component (3 files minimum):**
```
src/components/<Category>/<Name>/
├── index.ts          export * from "./<Name>"
├── <Name>.tsx        implementation
└── <Name>.css        component-local CSS (may be empty)
```

**Heavy/complex component (expand when needed):**
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

- Soft file limit: ~500 lines per file.
- When borderline complex, place in `Extras` for maintainability.
- Components already in `Extras` stay there unless explicitly migrated.

**10 categories** (choose the right one):
`Primitives` · `Layout` · `DataDisplay` · `Navigation` · `Disclosure` · `Overlay` · `Feedback` · `Extras` · `Forms` · `Chart`

## 3. CSS strategy (Tailwind CSS v4)

- Use Tailwind v4+ utilities directly on elements. No config file.
- Component-local styles → component-scoped `.css` file.
- Shared tokens → `src/styles/tokens.css` (do not duplicate).
- **Never** use raw Tailwind palette names (`slate-500`, `rose-600`).
- **Always** use semantic tokens: `primary-*`, `secondary-*`, `success-*`, `danger-*`, `warning-*`.
- CVA variant functions → `src/styles/theme/<category>.ts` (not inside the component file).
- Always set `defaultVariants` in every CVA call.
- className: `cn(variants({…}), className)` — `cn()` always last.

## 4. Responsive and cross-platform parity

- All components must support responsive layouts.
- Every desktop interaction must have a mobile equivalent (and vice versa).
- Document cross-platform decisions inside the component demo page.

## 5. Animation quality

- Animations must be visually appealing and creative.
- Never sacrifice readability, accessibility, or interaction clarity for visual effects.

## 6. Demo page requirements

**Demo page:** `demo/pages/<Name>Page.tsx`
- Import from `../../src` (local, not npm).
- Use `Section`, `PageTitle`, `CodeExample`, `PropTable` from `./helpers`.
- `PageTitle` auto-renders a cross-link badge to the corresponding doc page — no manual wiring needed.
- Every public prop / variant / state must have at least one demo block.
- One scenario + one representative code snippet per section.

**Doc page:** `demo/pages/docs/<Name>Doc.tsx`
- Import from `../helpers`.
- `PageTitle` auto-renders a cross-link badge back to the demo page.
- Must include: Import snippet, PropTable for every exported type/interface, Usage example, Type Reference.

**Wiring (both must be done for new components):**
1. Add demo route to `demo/App.tsx` `<Routes>`
2. Add lazy import at top of `demo/App.tsx`
3. Add nav item (with correct category group) to `navItems` in `demo/App.tsx`
4. Add to `componentSearchIndex` in `demo/App.tsx` with relevant keywords
5. Add doc route to `demo/pages/docs/DocsLayout.tsx` `<Routes>`
6. Add lazy import at top of `DocsLayout.tsx`
7. Add nav item to docs `navItems` in `DocsLayout.tsx`
8. Add slug to `KNOWN_DOC_SLUGS` and `KNOWN_DEMO_SLUGS` in `demo/pages/helpers.tsx`
9. Export component + types from `src/index.ts` (flat, namespace, and default object)
10. Export from category barrel `src/components/<Category>/index.ts`

**Chart slug difference:** demo uses `/linechart` `/barchart` `/piechart` `/scatterchart`; docs use `/docs/line-chart` etc. The `DEMO_TO_DOC` / `DOC_TO_DEMO` maps in `helpers.tsx` handle this.

## 7. Testing

- One test file per component: `src/__tests__/<Name>.test.tsx`
- Runner: Vitest (globals: true — no need to import describe/it/expect)
- Environment: jsdom; CSS disabled in tests
- Cover: render, all variants/states, key interactions, edge cases
- Naming: `describe("<Name>") { it("<behavior>") }`

## 8. Verification gate

After any component or demo change:
```
npm run build    # must complete without errors
npm test         # all tests must pass
npm run dev      # visually confirm in browser at localhost:3001
npx tsc --noEmit # must be clean
```

## 9. Delivery checklist

- [ ] Tree-shaking-friendly exports (index.ts + category barrel + src/index.ts)
- [ ] Tailwind v4 semantic tokens only — no raw palette names
- [ ] CVA variants in `src/styles/theme/<category>.ts`
- [ ] Responsive layout and mobile parity
- [ ] Animation quality reviewed
- [ ] Demo page covers all public API surfaces with code snippets
- [ ] Doc page with PropTable, Import, Usage, Type Reference
- [ ] All 10 wiring steps completed for new components
- [ ] Test file added with meaningful coverage
- [ ] Verification gate passed (build + test + typecheck + visual)
- [ ] CHANGELOG.md updated (load changelog-writer skill)
