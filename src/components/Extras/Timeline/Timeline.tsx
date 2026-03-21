import React, { useEffect, useRef, useState } from "react";
import { Check, AlertCircle, Clock, Dot } from "lucide-react";
import { cn } from "../../../lib/utils";
import "./Timeline.css";
import type { TimelineAction, TimelineItem, TimelineOrientation, TimelineStatus } from "./types";

export type { TimelineAction, TimelineItem, TimelineOrientation, TimelineStatus };

export interface TimelineProps {
  items: TimelineItem[];
  orientation?: TimelineOrientation;
  /** Index of the active item — will be scrolled into center view */
  activeIndex?: number;
  /** Animate items as they enter the viewport */
  animated?: boolean;
  /** Connector line style */
  lineStyle?: "solid" | "dashed";
  className?: string;
}

const STATUS_COLORS: Record<TimelineStatus, string> = {
  complete:
    "bg-success-500 border-success-500 text-white dark:bg-success-600 dark:border-success-600",
  active:
    "bg-primary-500 border-primary-500 text-white dark:bg-primary-400 dark:border-primary-400",
  error: "bg-danger-500 border-danger-500 text-white dark:bg-danger-600 dark:border-danger-600",
  pending:
    "bg-white border-primary-300 text-secondary-400 dark:bg-primary-800 dark:border-primary-600",
};

const STATUS_GLOW: Record<TimelineStatus, string> = {
  complete:
    "shadow-[0_0_0_4px_theme(colors.success.100)] dark:shadow-[0_0_0_4px_theme(colors.success.900/30)]",
  active:
    "shadow-[0_0_0_4px_theme(colors.primary.100)] dark:shadow-[0_0_0_4px_theme(colors.primary.800/50)] animate-pulse",
  error:
    "shadow-[0_0_0_4px_theme(colors.danger.100)] dark:shadow-[0_0_0_4px_theme(colors.danger.900/30)]",
  pending: "",
};

function StatusIcon({ status, icon }: { status: TimelineStatus; icon?: React.ReactNode }) {
  if (icon) return <>{icon}</>;
  if (status === "complete") return <Check className="h-3 w-3" />;
  if (status === "error") return <AlertCircle className="h-3 w-3" />;
  if (status === "active") return <Dot className="h-4 w-4" />;
  return <Clock className="h-3 w-3" />;
}

/* ── Photo gallery mosaic ───────────────────────────────────────────────────── */
function GalleryGrid({ images, title }: { images: string[]; title: string }) {
  const slice = images.slice(0, 4);
  const overflow = images.length > 4 ? images.length - 4 : 0;

  const tile = (src: string, idx: number, extraCls?: string) => (
    <a
      key={idx}
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("relative block overflow-hidden", extraCls)}
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={src}
        alt={`${title} ${idx + 1}`}
        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
      />
      {idx === slice.length - 1 && overflow > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <span className="text-sm font-semibold text-white">+{overflow}</span>
        </div>
      )}
    </a>
  );

  if (slice.length === 0) return null;
  if (slice.length === 1)
    return (
      <div className="mt-2.5 h-36 overflow-hidden rounded-xl">{tile(slice[0], 0, "h-full")}</div>
    );
  if (slice.length === 2)
    return (
      <div className="mt-2.5 grid h-28 grid-cols-2 gap-0.5 overflow-hidden rounded-xl">
        {slice.map((src, i) => tile(src, i))}
      </div>
    );
  if (slice.length === 3)
    return (
      <div className="mt-2.5 grid h-36 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-xl">
        {tile(slice[0], 0, "row-span-2")}
        {tile(slice[1], 1)}
        {tile(slice[2], 2)}
      </div>
    );
  return (
    <div className="mt-2.5 grid h-44 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-xl">
      {slice.map((src, i) => tile(src, i))}
    </div>
  );
}

/* ── Action buttons bar ────────────────────────────────────────────────── */
function ActionBar({ actions }: { actions: TimelineAction[] }) {
  const secondary = actions.filter((a) => a.variant !== "primary");
  const primary = actions.filter((a) => a.variant === "primary");

  const ghostCls =
    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-secondary-500 transition-colors hover:bg-secondary-100/80 hover:text-secondary-700 dark:text-secondary-400 dark:hover:bg-primary-800/60 dark:hover:text-secondary-200";
  const solidCls =
    "inline-flex items-center gap-1.5 rounded-lg border border-primary-200/70 bg-primary-50/80 px-3 py-1 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100 dark:border-primary-600/60 dark:bg-primary-800/60 dark:text-primary-300 dark:hover:bg-primary-700/60";

  const renderAction = (action: TimelineAction, i: number, cls: string) =>
    action.href ? (
      <a
        key={i}
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        onClick={(e) => e.stopPropagation()}
      >
        {action.icon}
        {action.label}
      </a>
    ) : (
      <button key={i} type="button" onClick={action.onClick} className={cls}>
        {action.icon}
        {action.label}
      </button>
    );

  return (
    <div className="mt-3 flex items-center gap-1 border-t border-primary-100/50 pt-2.5 dark:border-primary-700/40">
      {secondary.map((a, i) => renderAction(a, i, ghostCls))}
      {primary.length > 0 && <span className="flex-1" />}
      {primary.map((a, i) => renderAction(a, i, solidCls))}
    </div>
  );
}

/* ── Single timeline item card ── */
function TimelineCard({
  item,
  isActive,
  animated,
  visible,
  orientation,
}: {
  item: TimelineItem;
  isActive: boolean;
  animated: boolean;
  visible: boolean;
  orientation: TimelineOrientation;
}) {
  const status: TimelineStatus = item.status ?? "pending";

  const cardBg = {
    complete:
      "bg-gradient-to-br from-white to-success-50/40 dark:from-primary-900 dark:to-success-900/10",
    active:
      "bg-gradient-to-br from-white to-primary-50/60 dark:from-primary-900 dark:to-primary-800/40",
    error:
      "bg-gradient-to-br from-white to-danger-50/40 dark:from-primary-900 dark:to-danger-900/10",
    pending: "bg-white dark:bg-primary-900",
  }[status];

  const cardBorder = {
    complete: "border-success-200/70 dark:border-success-800/50",
    active: "border-primary-300/80 dark:border-primary-600/70",
    error: "border-danger-200/70 dark:border-danger-800/50",
    pending: "border-primary-200/60 dark:border-primary-700/50",
  }[status];

  const cardShadow = isActive
    ? "shadow-lg shadow-primary-300/30 dark:shadow-primary-500/20"
    : status === "complete"
      ? "shadow-md shadow-success-300/20 dark:shadow-success-400/10"
      : status === "error"
        ? "shadow-md shadow-danger-300/20 dark:shadow-danger-400/10"
        : "shadow-sm shadow-primary-100/50 dark:shadow-black/20";

  // Ambient glow gradient for non-active cards — echoes the holo palette
  // but tinted toward the item's status color, much lower intensity.
  const ambientGradient =
    status === "complete"
      ? "conic-gradient(from 30deg, transparent 0%, var(--tl-glow-complete-1) 18%, var(--tl-glow-complete-2) 30%, var(--tl-holo-cyan) 44%, transparent 60%)"
      : status === "error"
        ? "conic-gradient(from 150deg, transparent 0%, var(--tl-glow-error-1) 18%, var(--tl-glow-error-2) 32%, var(--tl-glow-error-3) 44%, transparent 58%)"
        : null;

  const dateBg = {
    complete: "bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300",
    active: "bg-primary-100 text-primary-700 dark:bg-primary-800/60 dark:text-primary-300",
    error: "bg-danger-100 text-danger-700 dark:bg-danger-900/40 dark:text-danger-300",
    pending: "bg-secondary-100 text-secondary-600 dark:bg-primary-800/50 dark:text-secondary-400",
  }[status];

  const animatedClass = animated
    ? visible
      ? "opacity-100 translate-y-0"
      : orientation === "vertical"
        ? "opacity-0 translate-y-6"
        : "opacity-0 translate-x-6"
    : "";

  return (
    // Outer wrapper: handles sizing, entrance animation & isolate stacking context
    <div
      className={cn(
        "relative isolate",
        animated && "transition-all duration-700",
        animatedClass,
        orientation === "horizontal" ? "w-56 shrink-0" : "flex-1",
        item.className,
      )}
    >
      {/* ── Ambient glow for non-active status cards ─────────────────────
           Echoes the holo aesthetic at low intensity; pulses very slowly. */}
      {!isActive && ambientGradient && (
        <div
          className="pointer-events-none absolute animate-[tl-glow-pulse_5s_ease-in-out_infinite]"
          style={{
            inset: "-6px",
            borderRadius: "1.5rem",
            zIndex: -1,
            background: ambientGradient,
            filter: "blur(14px)",
            opacity: 0.22,
          }}
          aria-hidden
        />
      )}

      {isActive && (
        <>
          {/* ── Layer A: outer aurora halo (breathe + slow spin) ──────────
               Full 360° conic so all four sides glow evenly.
               Two simultaneous animations: opacity breathe + --tl-angle spin. */}
          <div
            className="pointer-events-none absolute"
            style={{
              inset: "-7px",
              borderRadius: "1.5rem",
              zIndex: -1,
              background:
                "conic-gradient(from var(--tl-angle, 0deg) at 50% 50%, var(--tl-holo-base) 0%, var(--tl-holo-indigo) 18%, var(--tl-holo-violet) 30%, var(--tl-holo-cyan) 45%, var(--tl-holo-mid) 62%, var(--tl-holo-base) 100%)",
              filter: "blur(10px)",
              animation: "tl-breathe 2.8s ease-in-out infinite, tl-holo-spin 9s linear infinite",
            }}
            aria-hidden
          />

          {/* ── Layer B: conic border via @property + CSS mask ──────────────
               @property animates --tl-angle, rotating the gradient in-place.
               No element rotation → no clipping at rounded corners, works on
               any aspect ratio. mask-composite punches interior → only rim visible. */}
          <div
            className="pointer-events-none absolute"
            style={{
              inset: "-1.5px",
              borderRadius: "1.0625rem",
              zIndex: -1,
              padding: "1.5px",
              background:
                "conic-gradient(from var(--tl-angle, 0deg) at 50% 50%, transparent 0deg, var(--tl-holo-indigo) 55deg, var(--tl-holo-violet) 85deg, var(--tl-holo-cyan) 115deg, transparent 175deg, transparent 360deg)",
              WebkitMask: "linear-gradient(white 0 0) content-box, linear-gradient(white 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              animation: "tl-holo-spin 5s linear infinite",
            }}
            aria-hidden
          />
        </>
      )}

      {/* ── Actual card ─────────────────────────────────────────────────── */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border backdrop-blur-[2px]",
          // When active, border-transparent lets the holo rim be the visual border
          isActive ? "border-transparent" : cn("border", cardBorder),
          cardBg,
          cardShadow,
        )}
      >
        {item.imagePosition === "left" && item.image ? (
          /* ── Left-image layout ── */
          <div className="flex min-h-[8rem]">
            <a
              href={item.image}
              target="_blank"
              rel="noopener noreferrer"
              className="w-28 shrink-0 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              aria-label={item.title}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </a>
            <div className="flex flex-1 flex-col p-4">
              {item.date && (
                <span
                  className={cn(
                    "mb-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide",
                    dateBg,
                  )}
                >
                  {item.date}
                </span>
              )}
              <h3
                className={cn(
                  "text-sm font-semibold leading-snug",
                  isActive
                    ? "text-primary-900 dark:text-white"
                    : "text-primary-800 dark:text-primary-100",
                )}
              >
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 text-xs leading-relaxed text-secondary-500 dark:text-secondary-400">
                  {item.description}
                </p>
              )}
              {item.images && item.images.length > 0 && (
                <GalleryGrid images={item.images} title={item.title} />
              )}
              {item.actions && item.actions.length > 0 && <ActionBar actions={item.actions} />}
            </div>
          </div>
        ) : (
          /* ── Top-image layout (default) ── */
          <>
            {item.image && (
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-32 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            )}
            {item.svg && !item.image && (
              <div className="flex items-center justify-center bg-primary-50/60 p-4 dark:bg-primary-800/40">
                {item.svg}
              </div>
            )}
            <div className={cn("p-4", (item.image || item.svg) && "pt-3")}>
              {item.date && (
                <span
                  className={cn(
                    "mb-2.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide",
                    dateBg,
                  )}
                >
                  {item.date}
                </span>
              )}
              <h3
                className={cn(
                  "text-sm font-semibold leading-snug",
                  isActive
                    ? "text-primary-900 dark:text-white"
                    : "text-primary-800 dark:text-primary-100",
                )}
              >
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 text-xs leading-relaxed text-secondary-500 dark:text-secondary-400">
                  {item.description}
                </p>
              )}
              {item.images && item.images.length > 0 && (
                <GalleryGrid images={item.images} title={item.title} />
              )}
              {item.actions && item.actions.length > 0 && <ActionBar actions={item.actions} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Timeline ── */
export function Timeline({
  items,
  orientation = "vertical",
  activeIndex,
  animated = true,
  lineStyle = "solid",
  className,
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleSet, setVisibleSet] = useState<Set<number>>(new Set());

  /* Intersection observer for entrance animations */
  useEffect(() => {
    if (!animated) {
      setVisibleSet(new Set(items.map((_, i) => i)));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSet((prev) => {
          const next = new Set(prev);
          entries.forEach((e) => {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            if (e.isIntersecting) next.add(idx);
          });
          return next;
        });
      },
      { threshold: 0.15 },
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [items, animated]);

  /* Scroll active item to center */
  useEffect(() => {
    if (activeIndex == null) return;
    const el = itemRefs.current[activeIndex];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  }, [activeIndex]);

  const lineClass = lineStyle === "dashed" ? "border-dashed" : "";

  /* ── Vertical layout ── */
  if (orientation === "vertical") {
    return (
      <div ref={containerRef} className={cn("relative", className)}>
        {/* Vertical connector line */}
        <div className="absolute left-5 top-0 h-full w-px bg-primary-200 dark:bg-primary-700" />

        <div className="space-y-6">
          {items.map((item, i) => {
            const status: TimelineStatus = item.status ?? "pending";
            const isActive = i === activeIndex;
            return (
              <div
                key={item.id ?? i}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                data-idx={i}
                className="relative flex gap-4"
              >
                {/* Dot */}
                <div className="relative z-10 flex shrink-0 flex-col items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 [&_svg]:shrink-0",
                      STATUS_COLORS[status],
                      isActive && STATUS_GLOW[status],
                    )}
                  >
                    <StatusIcon status={status} icon={item.icon} />
                  </div>
                </div>

                {/* Card */}
                <TimelineCard
                  item={item}
                  isActive={isActive}
                  animated={animated}
                  visible={visibleSet.has(i)}
                  orientation="vertical"
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── Horizontal layout ── */
  return (
    <div ref={containerRef} className={cn("relative overflow-x-auto pb-4", className)}>
      <div className="flex min-w-max gap-6 px-4">
        {items.map((item, i) => {
          const status: TimelineStatus = item.status ?? "pending";
          const isActive = i === activeIndex;
          const isLast = i === items.length - 1;
          return (
            <div
              key={item.id ?? i}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-idx={i}
              className="relative flex flex-col items-center gap-3"
            >
              {/* Connector segment */}
              <div className="flex items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 z-10 [&_svg]:shrink-0",
                    STATUS_COLORS[status],
                    isActive && STATUS_GLOW[status],
                  )}
                >
                  <StatusIcon status={status} icon={item.icon} />
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "h-px w-28 border-t-2",
                      lineClass,
                      status === "complete"
                        ? "border-success-400"
                        : "border-primary-200 dark:border-primary-700",
                    )}
                  />
                )}
              </div>

              {/* Card */}
              <TimelineCard
                item={item}
                isActive={isActive}
                animated={animated}
                visible={visibleSet.has(i)}
                orientation="horizontal"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
