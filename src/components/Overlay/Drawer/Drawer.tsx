import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../../lib/utils";
import "./Drawer.css";

/* ── Types ────────────────────────────────────────────── */

export type DrawerSide = "left" | "right" | "top" | "bottom";

export type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Side from which the drawer slides in. @default "right" */
  side?: DrawerSide;
  /** Width (left/right) or height (top/bottom) of the drawer panel. */
  size?: string;
  /** Show a backdrop overlay. @default true */
  backdrop?: boolean;
  /** Close on backdrop click. @default true */
  closeOnBackdropClick?: boolean;
  children: React.ReactNode;
  className?: string;
};

export type DrawerHeaderProps = { children: React.ReactNode; className?: string };
export type DrawerBodyProps = { children: React.ReactNode; className?: string };
export type DrawerFooterProps = { children: React.ReactNode; className?: string };

/* ── Animation class maps ─────────────────────────────── */

const enterClass: Record<DrawerSide, string> = {
  right: "drawer-enter-right",
  left: "drawer-enter-left",
  top: "drawer-enter-top",
  bottom: "drawer-enter-bottom",
};

const sizeStyle: Record<DrawerSide, (s: string) => React.CSSProperties> = {
  right: (s) => ({ width: s }),
  left: (s) => ({ width: s }),
  top: (s) => ({ height: s }),
  bottom: (s) => ({ height: s }),
};

const panelPosition: Record<DrawerSide, string> = {
  right: "right-0 top-0 bottom-0",
  left: "left-0 top-0 bottom-0",
  top: "top-0 left-0 right-0",
  bottom: "bottom-0 left-0 right-0",
};

/* ── Drawer ───────────────────────────────────────────── */

export function Drawer({
  open,
  onOpenChange,
  side = "right",
  size = side === "top" || side === "bottom" ? "50vh" : "24rem",
  backdrop = true,
  closeOnBackdropClick = true,
  children,
  className,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  /* Lock body scroll */
  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [open]);

  /* Escape key */
  useEffect(() => {
    if (!open) return;
    function listener(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [open, onOpenChange]);

  /* Focus trap */
  useEffect(() => {
    if (!open) return;
    const el = panelRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable[0]?.focus();
    function trap(e: KeyboardEvent) {
      if (e.key !== "Tab" || focusable.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === focusable[0]) {
          e.preventDefault();
          focusable[focusable.length - 1].focus();
        }
      } else {
        if (document.activeElement === focusable[focusable.length - 1]) {
          e.preventDefault();
          focusable[0].focus();
        }
      }
    }
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50" role="presentation">
      {/* Backdrop */}
      {backdrop && (
        <div
          className="drawer-backdrop absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={() => closeOnBackdropClick && onOpenChange(false)}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={cn(
          "drawer-panel absolute flex flex-col",
          "bg-white shadow-2xl dark:bg-primary-900",
          panelPosition[side],
          enterClass[side],
          className,
        )}
        style={sizeStyle[side](size)}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

/* ── Sub-components ───────────────────────────────────── */

export function DrawerHeader({ children, className }: DrawerHeaderProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between border-b border-primary-100 px-5 py-4 dark:border-primary-800",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DrawerBody({ children, className }: DrawerBodyProps) {
  return <div className={cn("flex-1 overflow-y-auto px-5 py-4", className)}>{children}</div>;
}

export function DrawerFooter({ children, className }: DrawerFooterProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-end gap-3 border-t border-primary-100 px-5 py-4 dark:border-primary-800",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DrawerClose({ onClose, className }: { onClose: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close drawer"
      className={cn(
        "rounded-md p-1.5 text-secondary-400 transition-colors",
        "hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-800 dark:hover:text-primary-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30",
        className,
      )}
    >
      <X className="h-4 w-4" />
    </button>
  );
}
