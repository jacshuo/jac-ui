### File 1: `.github/instructions/responsiveness.instructions.md`
*(Auto-enforced on component + style files via `applyTo`)*

```markdown
---
applyTo: "src/components/**/*.tsx,src/styles/**/*.css,src/styles/theme.ts,demo/pages/**/*.tsx"
---

# Responsiveness Rules — @jacshuo/onyx

These rules are **mandatory** for all component and style changes in this library.

---

## 1. Semantic Tokens — Non-Negotiable

Every responsive CSS value MUST be a named semantic token in `tokens.css` (`:root` block)
or a CVA variant in `theme.ts`. Hardcoded Tailwind scale classes that represent size/density
decisions (e.g., `py-3` for a sized component) are banned — use CSS custom property `var()` instead.

Token naming convention:
```
--{component}-{property}-{variant}
```
Examples:
- `--accordion-trigger-py-sm` / `--accordion-trigger-py-md` / `--accordion-trigger-py-lg`
- `--table-cell-py-compact` / `--table-cell-py-comfortable`
- `--tooltip-max-width`
- `--header-mobile-drawer-bg`

Never suffix tokens with internal implementation details (e.g., `--accordion-inner-div-padding`).
Tokens describe design decisions; they must be overridable by consumers via `:root { }`.

Tokens that apply in dark mode go in a `.dark { }` block alongside their `:root` counterparts.

---

## 2. Size Variants via CVA in `theme.ts`

All components with variable text size or spacing MUST expose `size?: "sm" | "md" | "lg"` defined
in `cva()` inside `theme.ts`. The `md` variant MUST always be the default and match the current
hardcoded behavior before the size prop was added.

CVA variant values MUST use Tailwind utility classes that reference CSS custom property tokens, not
hardcoded scale values. For example:
- ✅ `"py-[--accordion-trigger-py-sm] text-xs"`
- ❌ `"py-2 text-xs"` (hardcoded scale — someone must override the class, not a token)

ProgressBar may additionally expose `"xs"`. No other components should deviate from sm/md/lg.

---

## 3. Compound Components Must Propagate via React Context

When a compound component set (e.g., Accordion + AccordionTrigger + AccordionContent) needs to
share `size`, `orientation`, or `density`, the parent MUST use `React.createContext` to propagate
it — never prop drilling, never global state.

Context must be typed, created with a sensible default matching the `defaultVariant`, and consumed
with `React.useContext` inside child components.

---

## 4. Structural Breakpoints Live Inside the Component

Viewport-triggered layout changes (hamburger toggle, bottom-sheet, card stacking) MUST use
Tailwind breakpoint utilities **inside** the component file — not delegated to callers via props.

Standard breakpoints: `sm=640px` · `md=768px` (primary mobile/desktop boundary) · `lg=1024px`

✅ Component controls its own layout:
```tsx
<nav className="hidden md:flex gap-4">{/* desktop nav */}</nav>
<button className="md:hidden">☰</button>
```
❌ Caller must add classes to get responsive behavior (forbidden pattern):
```tsx
<Header navClassName={isMobile ? "flex-col" : "flex-row"} />
```

---

## 5. Touch & Tap Gesture Support

Every hover-triggered interaction MUST also work for touch/keyboard users:

- `hover:opacity-100` reveals → also add `focus-visible:opacity-100` AND provide a
  `showActions?: boolean` prop as a persistent override for touch-only users.
- Ripple / flash animations → wire to `onClick` (fires on both mouse click and touch tap).
- Tooltips → respond to `onFocus`/`onBlur` in addition to `onMouseEnter`/`onMouseLeave`.
- Overlay reveal (e.g., Masonry item overlay) → provide a `tapToReveal` option that keeps
  overlay visible after single tap on touch devices.

Never use `onMouseUp` alone for primary actions — always `onClick`.

---

## 6. Animation Tokens

All transition durations and easing functions for responsive animations MUST be tokens.

In the `@theme { }` block of tokens.css:
```css
--animate-{component}-{action}: {duration} {easing} {fill-mode};
```
Keyframes go in the same tokens.css file, immediately following the `@theme` block.  
This makes them available as `animate-{component}-{action}` Tailwind utilities.

---

## 7. Mobile-First Defaults

Default prop values MUST work on a 375px-wide viewport without extra configuration:

- Toast/Alert: MUST include `max-w-[calc(100vw-2rem)]` in addition to any fixed width.
- Dialog default `size="md"`: MUST never overflow its `p-4` backdrop — test at 375px.
- Table `density="default"` row height MUST be ≥ 44px (accessible tap target).
- Tabs `scrollable`: set `true` as the recommended default when many tabs are expected.

---

## 8. Tailwind Class Injection — Static Maps Only

When a prop conditionally selects a Tailwind class, ALWAYS use a static lookup object —
never dynamic string concatenation (breaks Tailwind JIT scanning).

✅ Static map (JIT detects all classes):
```ts
const HIDE_BELOW: Record<string, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
};
```
❌ Dynamic concatenation (JIT cannot detect — classes won't be generated):
```ts
const cls = `hidden ${breakpoint}:table-cell`;   // FORBIDDEN
```

---

## 9. Demo Page Requirements

For every new responsive prop added, the corresponding demo page MUST include:

1. A `<Section title="...">` (from `helpers.tsx`) with a descriptive title
2. At least two contrast examples (e.g., `size="sm"` vs `size="lg"`, horizontal vs vertical)
3. A brief `<p className="text-xs text-primary-500 ...">` explaining what the prop controls
4. Additions only — never rewrite existing demo sections
5. If a `position="bottom"` / `stackOnMobile` / `mobileMenu` change requires
   narrowing the viewport to see, add a note instructing the reader to resize
```

---

### File 2: `.github/skills/responsiveness/SKILL.md`
*(Loaded on-demand by the agent when implementing responsiveness)*

```markdown
# Skill: Adding Responsiveness to @jacshuo/onyx Components

**When to load**: Whenever adding `size`, `orientation`, `density`, `scrollable`,
`position`, `stackOnMobile`, `mobileMenu`, `flip`, `wrap`, `hideBelow` props or
any structural breakpoint changes to any component in this library.

---

## Pre-flight Checklist

Before writing code, verify:
- [ ] Read the target component file in full
- [ ] Read `src/styles/theme.ts` for existing CVA variant patterns to follow
- [ ] Read `src/styles/tokens.css` to find existing token naming and add new ones at the correct section
- [ ] Identify whether it's a compound component (needs Context) or standalone
- [ ] Check whether a `ComponentContext` already exists in the file
- [ ] Read the corresponding demo page to understand what sections exist

---

## Step 1: Define Semantic Tokens in `tokens.css`

Add a dedicated block for the component BELOW the existing tokens. Group all variants together.

```css
/* ── Accordion responsive tokens ─────────────────── */
:root {
  --accordion-trigger-py-sm:   0.375rem;
  --accordion-trigger-py-md:   0.75rem;
  --accordion-trigger-py-lg:   1rem;
  --accordion-content-pb-sm:   0.375rem;
  --accordion-content-pb-md:   0.75rem;
  --accordion-content-pb-lg:   0.75rem;
  --accordion-trigger-text-sm: 0.75rem;   /* text-xs */
  --accordion-trigger-text-md: 0.875rem;  /* text-sm */
  --accordion-trigger-text-lg: 1rem;      /* text-base */
}
```

**Rules:**
- ONE comment header per component group
- Property order: `py` → `px` → `text` → `gap` → `icon-size` → animation durations
- Pixel-equivalent comments are encouraged for readability
- Dark mode overrides go in a `.dark { }` block immediately after the `:root` block
- Animation tokens go in the `@theme { }` block at the top of the file; keyframes at the bottom

---

## Step 2: Add the CVA Variant to theme.ts

Pattern for adding a `size` variant to an existing CVA export:

```ts
// BEFORE (no size)
export const accordionTriggerVariants = cva(
  "flex w-full items-center justify-between py-3 text-sm font-medium ...",
  { variants: { intent: { ... } }, defaultVariants: { intent: "default" } }
);

// AFTER (with size using token vars)
export const accordionTriggerVariants = cva(
  "flex w-full items-center justify-between font-medium ...",  // remove hardcoded py/text
  {
    variants: {
      intent: { ... },             // unchanged
      size: {
        sm: "py-[--accordion-trigger-py-sm] text-[length:--accordion-trigger-text-sm]",
        md: "py-[--accordion-trigger-py-md] text-[length:--accordion-trigger-text-md]",
        lg: "py-[--accordion-trigger-py-lg] text-[length:--accordion-trigger-text-lg]",
      },
    },
    defaultVariants: { intent: "default", size: "md" },
  }
);
```

**Note on Tailwind v4 arbitrary values:**
- Custom property for spacing: `py-[--my-token]`
- Custom property for font-size: `text-[length:--my-token]`
- Custom property for color: `text-[color:--my-token]`

---

## Step 3: Update the Component File

### 3a. Standalone Component

```tsx
// Import updated variant type
import { accordionTriggerVariants } from "../styles/theme";
import { type VariantProps } from "class-variance-authority";

export type AccordionTriggerProps = React.HTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof accordionTriggerVariants> & {
    // ... existing props
  };

export function AccordionTrigger({ size, intent, className, ...props }: AccordionTriggerProps) {
  return (
    <button
      className={cn(accordionTriggerVariants({ size, intent }), className)}
      {...props}
    />
  );
}
```

### 3b. Compound Component with Context

```tsx
// 1. Define context type (include all shared responsive props)
type AccordionContextValue = {
  size: "sm" | "md" | "lg";
  // ... other shared values
};

// 2. Create context with default matching the CVA defaultVariant
const AccordionContext = React.createContext<AccordionContextValue>({ size: "md" });

// 3. Root component provides context
export function Accordion({ size = "md", ...props }: AccordionProps) {
  return (
    <AccordionContext.Provider value={{ size }}>
      <div ...>{props.children}</div>
    </AccordionContext.Provider>
  );
}

// 4. Child components consume context
export function AccordionTrigger({ className, ...props }: AccordionTriggerProps) {
  const { size } = React.useContext(AccordionContext);
  return (
    <button
      className={cn(accordionTriggerVariants({ size }), className)}
      {...props}
    />
  );
}
```

---

## Step 4: Export New Types from index.ts

If a new type was added (context type export, new prop interface), re-export it:

```ts
// src/index.ts
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, type AccordionProps } from "./components/Accordion";
```

Only export types that library consumers would need. Do not export internal context types.

---

## Step 5: Touch & Tap Patterns

### Hover-reveal actions (List, Tree, Masonry overlay)
```tsx
// BEFORE: hover-only (touch users can never access)
<div className="opacity-0 group-hover:opacity-100">
  {actions}
</div>

// AFTER: hover + focus + optional persistent prop
export function ListItem({ showActions, actions, ...props }) {
  return (
    <div className="group ...">
      {/* content */}
      <div className={cn(
        "transition-opacity",
        showActions
          ? "opacity-100"                // persistent (touch-friendly)
          : "opacity-0 group-hover:opacity-100 focus-within:opacity-100"  // hover + focus
      )}>
        {actions}
      </div>
    </div>
  );
}
```

### Click / tap ripple
```tsx
function spawnRipple(e: React.MouseEvent | React.TouchEvent, container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  const x = "touches" in e
    ? e.touches[0].clientX - rect.left
    : (e as React.MouseEvent).clientX - rect.left;
  const y = "touches" in e
    ? e.touches[0].clientY - rect.top
    : (e as React.MouseEvent).clientY - rect.top;
  // ... create ripple element
}
// Wire to onClick (fires for both mouse and touch)
<div onClick={(e) => spawnRipple(e, e.currentTarget)}>
```

### Tooltip touch fallback
```tsx
export function Tooltip({ content, delay = 200, ...props }) {
  const [visible, setVisible] = React.useState(false);
  return (
    <span
      onMouseEnter={() => setTimeout(() => setVisible(true), delay)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}          // keyboard
      onBlur={() => setVisible(false)}           // keyboard
      onClick={() => setVisible(v => !v)}        // touch tap toggle
      {...props}
    />
  );
}
```

---

## Step 6: Structural Breakpoint Changes (Header, Dialog, Card)

### Header Mobile Menu
```tsx
const [mobileOpen, setMobileOpen] = React.useState(false);
return (
  <header>
    <div className="flex items-center">
      {brand}
      {/* Desktop nav — hidden on mobile */}
      <nav className="hidden md:flex gap-4 ml-4">
        {navItems.map(...)}
      </nav>
    </div>
    {/* Mobile hamburger — hidden on desktop */}
    {mobileMenu && (
      <button className="md:hidden" onClick={() => setMobileOpen(o => !o)}>
        <MenuIcon />
      </button>
    )}
    {/* Mobile drawer */}
    {mobileOpen && (
      <div className="absolute top-full left-0 right-0 md:hidden bg-[--header-mobile-drawer-bg] border-b ...">
        <nav className="flex flex-col p-4 gap-1">
          {navItems.map(...)}
        </nav>
      </div>
    )}
  </header>
);
```

### Dialog Bottom Sheet
```tsx
// position="center" → current centered behavior (unchanged)
// position="bottom" → bottom sheet
const positionClasses = {
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg",
  bottom: "bottom-0 left-0 right-0 rounded-t-2xl max-h-[90vh] overflow-y-auto",
};
```

### HorizontalCard stackOnMobile
```tsx
<div className={cn(
  "flex",
  stackOnMobile ? "flex-col md:flex-row" : "flex-row",
  ...
)}>
  <div className={cn(
    "shrink-0",
    stackOnMobile ? "w-full md:w-auto" : "",
  )}
    style={stackOnMobile ? { "--media-w": media.width } : { width: media.width }}
  >
    {media.content}
  </div>
</div>
```

---

## Step 7: Table Density + Column Hiding

### Density via Context
```tsx
type TableContextValue = { density: "compact" | "default" | "comfortable" };
const TableContext = React.createContext<TableContextValue>({ density: "default" });

// In TableCell / TableHead:
const { density } = React.useContext(TableContext);
const densityClass = {
  compact:      "py-[--table-cell-py-compact] text-xs",
  default:      "py-[--table-cell-py-default] text-sm",
  comfortable:  "py-[--table-cell-py-comfortable] text-base",
}[density];
```

### Column hideBelow — Static Map Only
```ts
// In ColumnDef type:
hideBelow?: "sm" | "md" | "lg";

// Static map for Tailwind JIT:
const HIDE_BELOW_CLASS: Record<string, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
};

// Apply to both <th> and <td>:
const hideClass = col.hideBelow ? HIDE_BELOW_CLASS[col.hideBelow] : "";
<td className={cn(cellClass, hideClass, col.cellClassName)}>
```

---

## Step 8: Tooltip Flip Logic

```tsx
const bubbleRef = React.useRef<HTMLDivElement>(null);
const [effectivePosition, setEffectivePosition] = React.useState(position);

// After become visible, check if bubble is clipped by viewport
React.useEffect(() => {
  if (!flip || !visible || !bubbleRef.current) return;
  const rect = bubbleRef.current.getBoundingClientRect();
  const overTop    = rect.top < 0;
  const overBottom = rect.bottom > window.innerHeight;
  const overLeft   = rect.left < 0;
  const overRight  = rect.right > window.innerWidth;
  
  if (position === "top"    && overTop)    setEffectivePosition("bottom");
  else if (position === "bottom" && overBottom) setEffectivePosition("top");
  else if (position === "left"   && overLeft)   setEffectivePosition("right");
  else if (position === "right"  && overRight)  setEffectivePosition("left");
  else setEffectivePosition(position); // reset if no longer clipping
}, [visible, position, flip]);
```

---

## Demo Section Template

```tsx
<Section title="Sizes (sm / md / lg)">
  <p className="text-xs text-primary-500 dark:text-primary-400">
    The <code>size</code> prop controls padding and text scale.
    All values are driven by <code>--{component}-*</code> CSS tokens and can be overridden.
  </p>
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <div>
      <p className="mb-2 text-xs text-primary-400">sm</p>
      <ComponentName size="sm" ... />
    </div>
    <div>
      <p className="mb-2 text-xs text-primary-400">md (default)</p>
      <ComponentName size="md" ... />
    </div>
    <div>
      <p className="mb-2 text-xs text-primary-400">lg</p>
      <ComponentName size="lg" ... />
    </div>
  </div>
</Section>
```

---

## Token Block Template for tokens.css

Paste this at the bottom of tokens.css, after all existing component token blocks:

```css
/* ── {ComponentName} responsive tokens ──────────────── */
:root {
  --{component}-{property}-sm:  {value};
  --{component}-{property}-md:  {value};   /* matches previous hardcoded default */
  --{component}-{property}-lg:  {value};
}

/* dark overrides if colors are involved */
.dark {
  --{component}-{property}-sm:  {dark-value};
  /* ... */
}
```

---

## Verify After Each Component

Run after each component is done (not at the very end):

```bash
npx vitest run
```

All 309 (or more) tests must pass before moving to the next component.
Then visually verify in the browser at http://localhost:3001/{component-route}.
```