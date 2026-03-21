import React, { createContext } from "react";
import { createPortal } from "react-dom";
import { Bell, CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { toastVariants } from "../../../styles/theme/feedback";
import { useToastManager } from "./Toast.logic";
import type {
  ToastContextValue,
  ToastItem,
  ToastPosition,
  ToastProviderProps,
  ToastVariant,
} from "./types";

/* ── Context ──────────────────────────────────────────── */

export const ToastContext = createContext<ToastContextValue | null>(null);

/* ── Position → fixed-container class ────────────────── */

const positionContainerClass: Record<ToastPosition, string> = {
  "top-right": "top-4 right-4 items-end",
  "top-left": "top-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

/* ── Position → slide-in animation class ─────────────── */

const entryAnimClass: Record<ToastPosition, string> = {
  "top-right": "animate-slide-in-right",
  "top-left": "animate-slide-in-left",
  "top-center": "animate-slide-in-top",
  "bottom-right": "animate-slide-in-right",
  "bottom-left": "animate-slide-in-left",
  "bottom-center": "animate-slide-in-bottom",
};

/* ── Position → exit CSS class (applied to wrapper) ───── */

const exitDirectionClass: Record<ToastPosition, string> = {
  "top-right": "toast-exit-right",
  "top-left": "toast-exit-left",
  "top-center": "toast-exit-up",
  "bottom-right": "toast-exit-right",
  "bottom-left": "toast-exit-left",
  "bottom-center": "toast-exit-down",
};

/* ── Variant → icon ───────────────────────────────────── */

const VARIANT_ICONS: Record<ToastVariant, React.FC<React.SVGProps<SVGSVGElement>>> = {
  default: Bell,
  success: CheckCircle2,
  danger: XCircle,
  warning: AlertTriangle,
  info: Info,
};

/* ── Single toast item view ───────────────────────────── */

function ToastItemView({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const variant = item.variant ?? "default";
  const position = item.position ?? "top-right";
  const dismissible = item.dismissible !== false;
  const Icon = VARIANT_ICONS[variant];

  const handleDismiss = () => {
    item.onDismiss?.(item.id);
    onDismiss(item.id);
  };

  return (
    <div
      className={cn(
        "toast-wrapper",
        item._exiting && `toast-wrapper-exiting ${exitDirectionClass[position]}`,
      )}
    >
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          toastVariants({ variant }),
          "toast-item pointer-events-auto",
          !item._exiting && entryAnimClass[position],
        )}
      >
        <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {item.title && <p className="text-sm font-semibold leading-snug">{item.title}</p>}
          {item.description && (
            <p className={cn("text-sm leading-snug", item.title && "opacity-80")}>
              {item.description}
            </p>
          )}
          {item.action && (
            <button
              type="button"
              onClick={item.action.onClick}
              className="toast-action-btn mt-1 self-start text-xs font-semibold underline underline-offset-2 transition-opacity hover:opacity-80"
            >
              {item.action.label}
            </button>
          )}
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss notification"
            className="shrink-0 cursor-pointer opacity-60 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Provider ─────────────────────────────────────────── */

export function ToastProvider({
  children,
  defaultPosition = "top-right",
  defaultDuration = 4000,
}: ToastProviderProps) {
  const { items, toast, dismiss, dismissAll } = useToastManager(defaultPosition, defaultDuration);

  // Group toasts by position so each position renders in its own fixed container
  const grouped = items.reduce<Partial<Record<ToastPosition, ToastItem[]>>>((acc, item) => {
    const pos = item.position ?? defaultPosition;
    (acc[pos] ??= []).push(item);
    return acc;
  }, {});

  return (
    <ToastContext.Provider value={{ toast, dismiss, dismissAll }}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <>
            {(Object.entries(grouped) as [ToastPosition, ToastItem[]][]).map(([position, list]) => (
              <div
                key={position}
                className={cn(
                  "pointer-events-none fixed z-[100] flex flex-col gap-2",
                  positionContainerClass[position],
                )}
              >
                {list.map((item) => (
                  <ToastItemView key={item.id} item={item} onDismiss={dismiss} />
                ))}
              </div>
            ))}
          </>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}
