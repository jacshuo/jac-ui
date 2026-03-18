import React, { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { type VariantProps } from "class-variance-authority";
import { CircleCheck, TriangleAlert, CircleX, Info, X } from "lucide-react";
import { cn } from "../lib/utils";
import { alertVariants } from "../styles/theme";

/* ═══════════════════════════════════════════════════════════
   1.  Static Alert — inline banner for in-page use
   ═══════════════════════════════════════════════════════════ */

type AlertProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>;

export function Alert({ intent, className, children, ...props }: AlertProps) {
  return (
    <div className={cn(alertVariants({ intent }), className)} role="alert" {...props}>
      {children}
    </div>
  );
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={cn(
        "flex items-center gap-1.5 font-semibold [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

export function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm opacity-90", className)} {...props} />;
}

/* ═══════════════════════════════════════════════════════════
   2.  Toast Alert — fly-in notifications (provider-free)
   ═══════════════════════════════════════════════════════════ */

export type AlertPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

type AlertIntent = NonNullable<VariantProps<typeof alertVariants>["intent"]>;

export type AlertOptions = {
  intent?: AlertIntent;
  title?: string;
  message: string;
  position?: AlertPosition;
  duration?: number; // ms, 0 = persistent
};

type AlertItem = AlertOptions & {
  id: string;
  exiting?: boolean;
};

/* ── module-level store ────────────────────────────────── */

let alertCounter = 0;
let alerts: AlertItem[] = [];
const timers = new Map<string, ReturnType<typeof setTimeout>>();
const listeners = new Set<() => void>();

function getSnapshot() {
  return alerts;
}

function emit() {
  listeners.forEach((l) => l());
}

function removeAlert(id: string) {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
  alerts = alerts.map((a) => (a.id === id ? { ...a, exiting: true } : a));
  emit();
  setTimeout(() => {
    alerts = alerts.filter((a) => a.id !== id);
    emit();
  }, 200);
}

function addAlert(options: AlertOptions): string {
  const id = `alert-${++alertCounter}`;
  alerts = [...alerts, { ...options, id }];
  emit();

  const duration = options.duration ?? 5000;
  if (duration > 0) {
    const timer = setTimeout(() => {
      timers.delete(id);
      removeAlert(id);
    }, duration);
    timers.set(id, timer);
  }

  return id;
}

/**
 * Configure the top offset (in pixels) used for top-positioned toasts.
 * Call this once during app initialization if your layout has a fixed header/navbar.
 * @default 16
 */
let configuredTopOffset = 16;
export function configureAlertTopOffset(offset: number) {
  configuredTopOffset = offset;
}

/* ── positioning & animation maps ──────────────────────── */

const positionClasses: Record<AlertPosition, string> = {
  "top-right": "right-4 items-end",
  "top-left": "left-4 items-start",
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "top-center": "left-1/2 -translate-x-1/2 items-center",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

const enterAnimation: Record<AlertPosition, string> = {
  "top-right": "animate-slide-in-right",
  "top-left": "animate-slide-in-left",
  "bottom-right": "animate-slide-in-right",
  "bottom-left": "animate-slide-in-left",
  "top-center": "animate-slide-in-top",
  "bottom-center": "animate-slide-in-bottom",
};

const intentIcons: Record<AlertIntent, React.FC<React.SVGProps<SVGSVGElement>>> = {
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleX,
  info: Info,
};

/* ── single toast item ─────────────────────────────────── */

function ToastItem({ alert, onClose }: { alert: AlertItem; onClose: () => void }) {
  const intent = alert.intent ?? "info";
  const Icon = intentIcons[intent];
  const position = alert.position ?? "top-right";

  return (
    <div
      className={cn(
        alertVariants({ intent }),
        enterAnimation[position],
        alert.exiting && "opacity-0 transition-opacity duration-200",
        "w-80",
      )}
      role="alert"
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex-1">
        {alert.title && <p className="font-semibold">{alert.title}</p>}
        <p className={cn(alert.title && "text-sm opacity-90")}>{alert.message}</p>
      </div>
      <button
        onClick={onClose}
        aria-label="Close notification"
        className="shrink-0 cursor-pointer opacity-50 transition-opacity hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ── toast container (portal, auto-mounted) ────────────── */

const isTopPosition = (pos: AlertPosition) => pos.startsWith("top");

function ToastContainer() {
  const items = useSyncExternalStore((cb) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  }, getSnapshot);

  const topOffsetRef = useRef<number>(configuredTopOffset);

  useEffect(() => {
    topOffsetRef.current = configuredTopOffset;
  }, []);

  if (items.length === 0) return null;

  const grouped = items.reduce<Partial<Record<AlertPosition, AlertItem[]>>>((acc, alert) => {
    const pos = alert.position ?? "top-right";
    (acc[pos] ??= []).push(alert);
    return acc;
  }, {});

  return createPortal(
    <>
      {(Object.entries(grouped) as [AlertPosition, AlertItem[]][]).map(([position, list]) => (
        <div
          key={position}
          style={isTopPosition(position) ? { top: `${topOffsetRef.current}px` } : undefined}
          className={cn(
            "pointer-events-none fixed z-100 flex flex-col gap-2",
            positionClasses[position],
          )}
        >
          {list.map((alert) => (
            <ToastItem key={alert.id} alert={alert} onClose={() => removeAlert(alert.id)} />
          ))}
        </div>
      ))}
    </>,
    document.body,
  );
}

/* ── auto-mount the container once ─────────────────────── */

let containerMounted = false;

function ensureContainer() {
  if (containerMounted) return;
  containerMounted = true;

  const root = document.createElement("div");
  root.id = "alert-toast-root";
  document.body.appendChild(root);

  createRoot(root).render(<ToastContainer />);
}

/* ── public hook ───────────────────────────────────────── */

export function useAlert() {
  useEffect(() => {
    ensureContainer();
  }, []);

  return { addAlert, removeAlert };
}
