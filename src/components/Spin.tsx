import React, { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { spinVariants } from "../styles/theme";

export type SpinProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof spinVariants> & {
    /** Whether the spinner and overlay are active */
    spinning?: boolean;
    /** Tip text shown below the spinner */
    tip?: string;
  };

/* ── Spinner icon (pure CSS, no dependencies) ────────── */

function Spinner({ size }: { size?: "sm" | "md" | "lg" | null }) {
  const px = size === "sm" ? 20 : size === "lg" ? 40 : 28;
  return (
    <svg
      className="animate-spin-rotate"
      width={px}
      height={px}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="animate-spin-dash stroke-current"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="90 150"
        strokeDashoffset="0"
      />
    </svg>
  );
}

/**
 * Inline Spin overlay.
 * Wraps children and covers them with a loading mask when `spinning` is true.
 * Without children it renders a standalone spinner.
 */
export function Spin({ spinning = true, tip, size, className, children, ...props }: SpinProps) {
  /* no children → standalone spinner (inline) */
  if (!children) {
    if (!spinning) return null;
    return (
      <div className={cn("inline-flex flex-col items-center gap-2", className)} {...props}>
        <Spinner size={size} />
        {tip && <span className={cn(spinVariants({ size }), "select-none")}>{tip}</span>}
      </div>
    );
  }

  /* with children → overlay wrapper, w-fit to hug content */
  return (
    <div className={cn("relative w-fit", className)} {...props}>
      {/* content */}
      <div
        className={cn(
          "transition-all duration-200",
          spinning && "pointer-events-none select-none blur-[1px]",
        )}
      >
        {children}
      </div>

      {/* overlay */}
      {spinning && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-[inherit] bg-primary-50/60 dark:bg-primary-900/60">
          <Spinner size={size} />
          {tip && <span className={cn(spinVariants({ size }), "select-none")}>{tip}</span>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Imperative Spin — provider-free, portal-based
   Supports multiple concurrent spins. Each call returns a
   close function so spins can be dismissed independently.

   Usage:
     const setSpin = useSpin();
     const close = setSpin(document.documentElement, "Saving…");
     close();  // dismiss only this one

     // multiple concurrent spins
     const closeA = setSpin(elementA, "Loading A…");
     const closeB = setSpin(elementB, "Loading B…");
     closeA();  // only closes A
   ═══════════════════════════════════════════════════════════ */

type SpinEntry = { id: number; target: HTMLElement; tip?: string };

let nextId = 0;
let entries: SpinEntry[] = [];
const listeners = new Set<() => void>();

function getSnapshot(): SpinEntry[] {
  return entries;
}

function emit() {
  listeners.forEach((l) => l());
}

function addSpin(target: HTMLElement, tip?: string): () => void {
  const id = ++nextId;
  entries = [...entries, { id, target, tip }];
  emit();
  return () => removeSpin(id);
}

function removeSpin(id: number) {
  entries = entries.filter((e) => e.id !== id);
  emit();
}

/**
 * Returns a `setSpin(target, tip?)` function.
 * Each call returns a **close** function to dismiss that specific overlay.
 */
export function useSpin() {
  return addSpin;
}

/* ── Portal container (auto-mounts once) ──────────────── */

let portalMounted = false;

function ensurePortal() {
  if (portalMounted || typeof document === "undefined") return;
  portalMounted = true;

  const container = document.createElement("div");
  container.id = "jac-spin-portal";
  document.body.appendChild(container);

  import("react-dom/client").then(({ createRoot }) => {
    createRoot(container).render(<SpinPortal />);
  });
}

/* ── Ref-count per element for position management ────── */

const posRefCounts = new Map<HTMLElement, { count: number; original: string }>();

function acquirePosition(el: HTMLElement) {
  const existing = posRefCounts.get(el);
  if (existing) {
    existing.count++;
    return;
  }
  const computed = getComputedStyle(el);
  const original = el.style.position;
  if (computed.position === "static") {
    el.style.position = "relative";
  }
  posRefCounts.set(el, { count: 1, original });
}

function releasePosition(el: HTMLElement) {
  const ref = posRefCounts.get(el);
  if (!ref) return;
  ref.count--;
  if (ref.count <= 0) {
    el.style.position = ref.original;
    posRefCounts.delete(el);
  }
}

/* ── Render a single spin entry ─────────────────────────── */

function SpinOverlay({ entry }: { entry: SpinEntry }) {
  useEffect(() => {
    const el = entry.target;
    if (isFullscreen(el)) return;

    acquirePosition(el);
    return () => releasePosition(el);
  }, [entry.target]);

  if (isFullscreen(entry.target)) {
    return createPortal(
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-primary-900/40 dark:bg-primary-900/60">
        <Spinner size="lg" />
        {entry.tip && <span className="select-none text-sm text-primary-100">{entry.tip}</span>}
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-[inherit] bg-primary-50/60 dark:bg-primary-900/60">
      <Spinner size="md" />
      {entry.tip && (
        <span className={cn(spinVariants({ size: "md" }), "select-none")}>{entry.tip}</span>
      )}
    </div>,
    entry.target,
  );
}

function SpinPortal() {
  const items = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => getSnapshot(),
  );

  if (items.length === 0) return null;

  return (
    <>
      {items.map((entry) => (
        <SpinOverlay key={entry.id} entry={entry} />
      ))}
    </>
  );
}

function isFullscreen(el: HTMLElement) {
  return el === document.documentElement || el === document.body;
}

/* auto-mount portal on module load */
if (typeof document !== "undefined") {
  ensurePortal();
}
