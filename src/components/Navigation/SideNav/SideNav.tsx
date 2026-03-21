import React, { useState, useCallback, useRef, useLayoutEffect, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, ChevronsLeft, Menu, X } from "lucide-react";
import { cn } from "../../../lib/utils";

/* ── Types ─────────────────────────────────────────────── */

export type SideNavCollapseMode = "expanded" | "icons" | "mini";

export interface SideNavItem {
  /** Unique key (falls back to `path` or `label`). */
  key?: string;
  /** Display label. */
  label: string;
  /** Route path — renders a link when provided. */
  path?: string;
  /** Nested children — renders a collapsible group. */
  children?: SideNavItem[];
  /** Icon element shown before the label. */
  icon?: React.ReactNode;
  /** Whether the group is expanded by default (only for items with children). */
  defaultOpen?: boolean;
}

/**
 * Props for a custom link component.
 * When using react-router, pass NavLink. When using plain HTML, an `<a>` wrapper.
 */
export type SideNavLinkComponentProps = {
  to: string;
  className: string | ((props: { isActive: boolean }) => string);
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export interface SideNavProps extends React.HTMLAttributes<HTMLElement> {
  /** Navigation items (supports nesting). */
  items: SideNavItem[];
  /** Section title rendered above the items. */
  title?: string;
  /** Base path prefix prepended to every item `path`. Defaults to `"/"`. */
  basePath?: string;
  /** When provided, renders buttons instead of links and calls this on click. */
  onItemClick?: (item: SideNavItem, fullPath: string) => void;
  /**
   * Custom link component (e.g. react-router's NavLink).
   * Falls back to a plain `<a>` tag if not provided.
   */
  LinkComponent?: React.ComponentType<SideNavLinkComponentProps>;
  /** Show collapse / expand toggle. */
  collapsible?: boolean;
  /** Controlled collapse mode. */
  collapseMode?: SideNavCollapseMode;
  /** Default collapse mode (uncontrolled). @default 'expanded' */
  defaultCollapseMode?: SideNavCollapseMode;
  /** Fires when collapse mode changes. */
  onCollapseModeChange?: (mode: SideNavCollapseMode) => void;
  /** Show indentation guide lines for nested items. @default true */
  showLines?: boolean;
  /**
   * Controlled set of expanded group keys.
   * Each key is `item.key ?? item.label`.
   */
  expandedKeys?: Set<string>;
  /** Default expanded keys (uncontrolled). When omitted all groups start open. */
  defaultExpandedKeys?: Set<string> | "all";
  /** Fires when a group is toggled. */
  onExpandedKeysChange?: (keys: Set<string>) => void;
  /**
   * Enable built-in responsive behaviour: a floating action button toggles a slide-in
   * overlay drawer on narrow viewports, so the nav never occupies layout space on mobile.
   * @default true
   */
  responsive?: boolean;
  /** Viewport width (px) below which mobile mode activates. @default 768 */
  mobileBreakpoint?: number;
  /**
   * Distance (px) from the top of the viewport where the mobile drawer starts.
   * Set this to the height of your app's top bar. @default 48
   */
  mobileTopOffset?: number;
  /**
   * Optional slot rendered inside the mobile slide-in drawer, between the
   * header row and the scrollable nav body. Use it to inject a search input
   * or other controls that should appear on mobile too.
   */
  mobileDrawerSlot?: React.ReactNode;
}

/* ── Styles ────────────────────────────────────────────── */

const itemBase =
  "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors cursor-pointer";

const itemActive =
  "bg-primary-200 dark:bg-primary-700/50 text-primary-900 dark:text-primary-100 font-medium";

const itemInactive =
  "text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800/50 hover:text-primary-900 dark:hover:text-primary-200";

const iconBtnCls =
  "flex items-center justify-center rounded-md p-2 transition-colors cursor-pointer text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800/50 hover:text-primary-900 dark:hover:text-primary-200";

/* ── Default link renderer (plain <a>) ─────────────────── */

function DefaultLink({ to, className, style, children }: SideNavLinkComponentProps) {
  const cls = typeof className === "function" ? className({ isActive: false }) : className;
  return (
    <a href={to} className={cls} style={style}>
      {children}
    </a>
  );
}

/* ── Collapse‑mode cycling ─────────────────────────────── */

const modeOrder: SideNavCollapseMode[] = ["expanded", "icons", "mini"];

function nextCollapseMode(current: SideNavCollapseMode): SideNavCollapseMode {
  const i = modeOrder.indexOf(current);
  return modeOrder[(i + 1) % modeOrder.length];
}

/* ── Helpers: collect all group keys ───────────────────── */

function collectGroupKeys(items: SideNavItem[]): Set<string> {
  const keys = new Set<string>();
  for (const item of items) {
    if (item.children && item.children.length > 0) {
      keys.add(item.key ?? item.label);
      for (const k of collectGroupKeys(item.children)) keys.add(k);
    }
  }
  return keys;
}

/* ── Expanded mode: recursive item ─────────────────────── */

function ExpandedItemNode({
  item,
  basePath,
  depth,
  onItemClick,
  LinkComponent,
  showLines,
  expandedKeys,
  onToggle,
}: {
  item: SideNavItem;
  basePath: string;
  depth: number;
  onItemClick?: (item: SideNavItem, fullPath: string) => void;
  LinkComponent: React.ComponentType<SideNavLinkComponentProps>;
  showLines: boolean;
  expandedKeys: Set<string> | null;
  onToggle: (key: string) => void;
}) {
  const itemKey = item.key ?? item.label;
  const hasChildren = item.children && item.children.length > 0;

  // When expandedKeys is provided use controlled state, else internal
  const [internalOpen, setInternalOpen] = useState(item.defaultOpen ?? true);
  const open = expandedKeys ? expandedKeys.has(itemKey) : internalOpen;

  const toggle = useCallback(() => {
    if (expandedKeys) {
      onToggle(itemKey);
    } else {
      setInternalOpen((prev) => !prev);
    }
  }, [expandedKeys, onToggle, itemKey]);

  const paddingLeft = depth > 0 ? `${depth * 1.25}rem` : undefined;

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={toggle}
          className={cn(itemBase, itemInactive, "justify-between")}
          style={{ paddingLeft }}
        >
          <span className="flex items-center gap-2">
            {item.icon}
            {item.label}
          </span>
          <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-90")} />
        </button>
        {open && (
          <div
            className={cn(
              "flex flex-col gap-0.5 pt-0.5",
              showLines ? "ml-2.5 border-l border-primary-200 dark:border-primary-700" : "ml-2",
            )}
          >
            {item.children!.map((child) => (
              <ExpandedItemNode
                key={child.key ?? child.path ?? child.label}
                item={child}
                basePath={basePath}
                depth={depth + 1}
                onItemClick={onItemClick}
                LinkComponent={LinkComponent}
                showLines={showLines}
                expandedKeys={expandedKeys}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.path != null) {
    const to = basePath + item.path;

    if (onItemClick) {
      return (
        <button
          type="button"
          onClick={() => onItemClick(item, to)}
          className={cn(itemBase, itemInactive)}
          style={{ paddingLeft }}
        >
          {item.icon}
          {item.label}
        </button>
      );
    }

    return (
      <LinkComponent
        to={to}
        className={({ isActive }: { isActive: boolean }) =>
          cn(itemBase, isActive ? itemActive : itemInactive)
        }
        style={{ paddingLeft }}
      >
        {item.icon}
        {item.label}
      </LinkComponent>
    );
  }

  return (
    <span className={cn(itemBase, itemInactive, "cursor-default")} style={{ paddingLeft }}>
      {item.icon}
      {item.label}
    </span>
  );
}

/* ── Icons mode: group flyout (portal) ─────────────────── */

function IconGroupFlyout({
  item,
  basePath,
  onItemClick,
  LinkComponent,
}: {
  item: SideNavItem;
  basePath: string;
  onItemClick?: (item: SideNavItem, fullPath: string) => void;
  LinkComponent: React.ComponentType<SideNavLinkComponentProps>;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const enter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const leave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  useLayoutEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.top, left: rect.right + 4 });
    }
  }, [open]);

  const iconContent = item.icon || (
    <span className="text-xs font-bold leading-none">{item.label.charAt(0).toUpperCase()}</span>
  );

  return (
    <div onMouseEnter={enter} onMouseLeave={leave}>
      <button
        ref={btnRef}
        type="button"
        className={cn(iconBtnCls, "w-full")}
        title={item.label}
        onClick={() => setOpen((o) => !o)}
      >
        {iconContent}
      </button>
      {open &&
        createPortal(
          <div
            className="fixed z-50 min-w-44 rounded-md border border-primary-200 bg-white p-1 shadow-lg dark:border-primary-700 dark:bg-primary-900"
            style={{ top: pos.top, left: pos.left }}
            onMouseEnter={enter}
            onMouseLeave={leave}
          >
            <div className="px-2.5 py-1.5 text-xs font-semibold uppercase text-primary-500 dark:text-primary-400">
              {item.label}
            </div>
            <div className="flex flex-col gap-0.5">
              {item.children?.map((child) => {
                const childKey = child.key ?? child.path ?? child.label;
                if (child.path != null) {
                  const to = basePath + child.path;
                  if (onItemClick) {
                    return (
                      <button
                        key={childKey}
                        type="button"
                        onClick={() => {
                          onItemClick(child, to);
                          setOpen(false);
                        }}
                        className={cn(itemBase, itemInactive)}
                      >
                        {child.icon}
                        {child.label}
                      </button>
                    );
                  }
                  return (
                    <LinkComponent
                      key={childKey}
                      to={to}
                      className={({ isActive }: { isActive: boolean }) =>
                        cn(itemBase, isActive ? itemActive : itemInactive)
                      }
                    >
                      {child.icon}
                      {child.label}
                    </LinkComponent>
                  );
                }
                return (
                  <span key={childKey} className={cn(itemBase, "cursor-default text-primary-400")}>
                    {child.icon}
                    {child.label}
                  </span>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

/* ── Icons mode: leaf item ─────────────────────────────── */

function IconLeafItem({
  item,
  basePath,
  onItemClick,
  LinkComponent,
}: {
  item: SideNavItem;
  basePath: string;
  onItemClick?: (item: SideNavItem, fullPath: string) => void;
  LinkComponent: React.ComponentType<SideNavLinkComponentProps>;
}) {
  const iconContent = item.icon || (
    <span className="text-xs font-bold leading-none">{item.label.charAt(0).toUpperCase()}</span>
  );

  if (item.path != null) {
    const to = basePath + item.path;
    if (onItemClick) {
      return (
        <button
          type="button"
          onClick={() => onItemClick(item, to)}
          className={cn(iconBtnCls, "w-full")}
          title={item.label}
        >
          {iconContent}
        </button>
      );
    }
    return (
      <LinkComponent
        to={to}
        className={({ isActive }: { isActive: boolean }) =>
          cn(
            iconBtnCls,
            "w-full",
            isActive &&
              "bg-primary-200 dark:bg-primary-700/50 text-primary-900 dark:text-primary-100",
          )
        }
      >
        <span title={item.label}>{iconContent}</span>
      </LinkComponent>
    );
  }

  return (
    <span className={cn(iconBtnCls, "w-full cursor-default")} title={item.label}>
      {iconContent}
    </span>
  );
}

/* ── SideNav ───────────────────────────────────────────── */

export function SideNav({
  items,
  title,
  basePath = "/",
  onItemClick,
  LinkComponent = DefaultLink,
  collapsible,
  collapseMode: controlledMode,
  defaultCollapseMode = "expanded",
  onCollapseModeChange,
  showLines = true,
  expandedKeys: controlledExpandedKeys,
  defaultExpandedKeys = "all",
  onExpandedKeysChange,
  className,
  responsive = true,
  mobileBreakpoint = 768,
  mobileTopOffset = 48,
  mobileDrawerSlot,
  ...props
}: SideNavProps) {
  const [internalMode, setInternalMode] = useState(defaultCollapseMode);
  const mode = controlledMode ?? internalMode;

  // Expanded-keys state
  const allKeys = React.useMemo(() => collectGroupKeys(items), [items]);
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<Set<string>>(() =>
    defaultExpandedKeys === "all" ? new Set(allKeys) : new Set(defaultExpandedKeys),
  );
  const expandedKeys = controlledExpandedKeys ?? null;
  const resolvedKeys = expandedKeys ?? internalExpandedKeys;

  const handleToggle = useCallback(
    (key: string) => {
      const next = new Set(resolvedKeys);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      setInternalExpandedKeys(next);
      onExpandedKeysChange?.(next);
    },
    [resolvedKeys, onExpandedKeysChange],
  );

  const cycleMode = useCallback(() => {
    const next = nextCollapseMode(mode);
    setInternalMode(next);
    onCollapseModeChange?.(next);
  }, [mode, onCollapseModeChange]);

  // ── Responsive: mobile FAB + overlay drawer ───────────
  const [isMobile, setIsMobile] = useState(
    () => responsive && typeof window !== "undefined" && window.innerWidth < mobileBreakpoint,
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Draggable pull-tab: side + vertical position ───────
  const [tabSide, setTabSide] = useState<"left" | "right">(() => {
    if (typeof window === "undefined") return "left";
    try {
      return (localStorage.getItem("onyx-sidenav-side") as "left" | "right") || "left";
    } catch {
      return "left";
    }
  });
  const [tabTopPct, setTabTopPct] = useState<number>(() => {
    if (typeof window === "undefined") return 50;
    try {
      return Number(localStorage.getItem("onyx-sidenav-top")) || 50;
    } catch {
      return 50;
    }
  });
  // Live drag visual: null when not dragging
  const [tabDragLive, setTabDragLive] = useState<{ side: "left" | "right"; y: number } | null>(
    null,
  );
  const tabDragRef = useRef({ dragging: false, startX: 0, startY: 0, moved: false });

  const handleTabPointerDown = useCallback(
    (e: React.PointerEvent<Element>) => {
      // Only primary button (left-click) or touch/pen
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();

      tabDragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, moved: false };

      // Use window listeners so native drag on desktop Chrome can't steal the events
      const onMove = (ev: PointerEvent) => {
        if (!tabDragRef.current.dragging) return;
        const dx = Math.abs(ev.clientX - tabDragRef.current.startX);
        const dy = Math.abs(ev.clientY - tabDragRef.current.startY);
        if (dx > 6 || dy > 6) tabDragRef.current.moved = true;
        if (!tabDragRef.current.moved) return;
        const liveSide: "left" | "right" = ev.clientX < window.innerWidth / 2 ? "left" : "right";
        const minY = mobileTopOffset + 28;
        const maxY = window.innerHeight - 28;
        const liveY = Math.max(minY, Math.min(maxY, ev.clientY));
        setTabDragLive({ side: liveSide, y: liveY });
      };

      const onUp = (ev: PointerEvent) => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);

        if (!tabDragRef.current.dragging) return;
        tabDragRef.current.dragging = false;

        if (!tabDragRef.current.moved) {
          // Tap: open drawer.
          // On desktop Chrome a stray `click` fires after `pointerup` and hits
          // the freshly-mounted backdrop, closing the drawer instantly.
          // Swallow it with a one-time capture-phase listener.
          const swallowClick = (ev: MouseEvent) => {
            ev.stopPropagation();
            ev.preventDefault();
            window.removeEventListener("click", swallowClick, true);
          };
          window.addEventListener("click", swallowClick, true);
          setTabDragLive(null);
          setMobileOpen(true);
          return;
        }
        const newSide: "left" | "right" = ev.clientX < window.innerWidth / 2 ? "left" : "right";
        const minY = mobileTopOffset + 28;
        const maxY = window.innerHeight - 28;
        const clampedY = Math.max(minY, Math.min(maxY, ev.clientY));
        const pct = (clampedY / window.innerHeight) * 100;
        setTabSide(newSide);
        setTabTopPct(pct);
        setTabDragLive(null);
        try {
          localStorage.setItem("onyx-sidenav-side", newSide);
          localStorage.setItem("onyx-sidenav-top", String(pct));
        } catch (_) {
          // localStorage unavailable (e.g. private browsing with storage blocked)
        }
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [mobileTopOffset],
  );

  useEffect(() => {
    if (!responsive || typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      if (!e.matches) setMobileOpen(false);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [responsive, mobileBreakpoint]);

  // Close drawer when a navigation link (<a>) inside it is clicked
  const handleNavClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) setMobileOpen(false);
  }, []);

  // ── Swipe-to-close (direction depends on tabSide) ────────
  const drawerRef = useRef<HTMLElement>(null);
  const swipeState = useRef({ startX: 0, startY: 0, dragging: false });
  const SWIPE_THRESHOLD = 60;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    swipeState.current = { startX: t.clientX, startY: t.clientY, dragging: true };
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!swipeState.current.dragging || !drawerRef.current) return;
      const t = e.touches[0];
      const dx = t.clientX - swipeState.current.startX;
      const dy = t.clientY - swipeState.current.startY;
      if (tabSide === "left") {
        // Left drawer: close by swiping left
        if (dx >= 0 || Math.abs(dy) > Math.abs(dx)) return;
        drawerRef.current.style.transform = `translateX(${Math.max(dx, -224)}px)`;
      } else {
        // Right drawer: close by swiping right
        if (dx <= 0 || Math.abs(dy) > Math.abs(dx)) return;
        drawerRef.current.style.transform = `translateX(${Math.min(dx, 224)}px)`;
      }
      drawerRef.current.style.transition = "none";
    },
    [tabSide],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!swipeState.current.dragging || !drawerRef.current) return;
      swipeState.current.dragging = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - swipeState.current.startX;
      const dy = t.clientY - swipeState.current.startY;
      drawerRef.current.style.transition = "";
      drawerRef.current.style.transform = "";
      const isHorizontal = Math.abs(dx) > Math.abs(dy);
      if (isHorizontal) {
        if (tabSide === "left" && dx < -SWIPE_THRESHOLD) setMobileOpen(false);
        if (tabSide === "right" && dx > SWIPE_THRESHOLD) setMobileOpen(false);
      }
    },
    [tabSide],
  );

  // On mobile, also close drawer when onItemClick fires (button-based navigation)
  const effectiveOnItemClick = useMemo(() => {
    if (!isMobile || !onItemClick) return onItemClick;
    return (item: SideNavItem, path: string) => {
      setMobileOpen(false);
      onItemClick(item, path);
    };
  }, [isMobile, onItemClick]);

  // ── Shared nav body (used in both mobile drawer and desktop) ──
  const navBody = (
    <>
      {/* Collapse toggle — desktop only */}
      {collapsible && !isMobile && (
        <div
          className={cn(
            "flex shrink-0 mb-1",
            mode === "expanded" ? "justify-end" : "justify-center",
          )}
        >
          <button
            type="button"
            onClick={cycleMode}
            className={iconBtnCls}
            aria-label={mode === "mini" ? "Expand sidebar" : "Collapse sidebar"}
            title={mode === "mini" ? "Expand sidebar" : "Collapse sidebar"}
          >
            {mode === "mini" ? <Menu className="h-5 w-5" /> : <ChevronsLeft className="h-4 w-4" />}
          </button>
        </div>
      )}

      {/* Expanded mode — always shown on mobile */}
      {(isMobile || mode === "expanded") && (
        <>
          {title && (
            <h2 className="text-primary-500 dark:text-primary-400 mb-3 text-sm font-semibold uppercase">
              {title}
            </h2>
          )}
          {items.map((item) => (
            <ExpandedItemNode
              key={item.key ?? item.path ?? item.label}
              item={item}
              basePath={basePath}
              depth={0}
              onItemClick={effectiveOnItemClick}
              LinkComponent={LinkComponent}
              showLines={showLines}
              expandedKeys={expandedKeys}
              onToggle={handleToggle}
            />
          ))}
        </>
      )}

      {/* Icons mode — desktop only */}
      {!isMobile &&
        mode === "icons" &&
        items.map((item) => {
          const key = item.key ?? item.path ?? item.label;
          if (item.children && item.children.length > 0) {
            return (
              <IconGroupFlyout
                key={key}
                item={item}
                basePath={basePath}
                onItemClick={effectiveOnItemClick}
                LinkComponent={LinkComponent}
              />
            );
          }
          return (
            <IconLeafItem
              key={key}
              item={item}
              basePath={basePath}
              onItemClick={effectiveOnItemClick}
              LinkComponent={LinkComponent}
            />
          );
        })}

      {/* mini mode: only the toggle button above */}
    </>
  );

  // ── Mobile: portal-based FAB + slide-in drawer ────────
  if (responsive && isMobile) {
    // Compute pull-tab rendering position (drag live overrides settled state)
    const displaySide = tabDragLive ? tabDragLive.side : tabSide;
    const displayY = tabDragLive
      ? tabDragLive.y
      : (tabTopPct / 100) * (typeof window !== "undefined" ? window.innerHeight : 600);

    const tabStyle: React.CSSProperties = tabDragLive
      ? {
          top: displayY,
          transform: "translateY(-50%)",
          transition: "none",
          ...(displaySide === "left" ? { left: 0 } : { right: 0 }),
        }
      : {
          top: `${tabTopPct}%`,
          transform: "translateY(-50%)",
          transition: "top 0.15s ease",
          ...(tabSide === "left" ? { left: 0 } : { right: 0 }),
        };

    const drawerLeftStyle =
      tabSide === "left" ? { left: 0, right: "auto" } : { right: 0, left: "auto" };
    const drawerOpenCls = mobileOpen
      ? "translate-x-0"
      : tabSide === "left"
        ? "-translate-x-full"
        : "translate-x-full";
    const drawerBorderCls = tabSide === "left" ? "border-r" : "border-l";

    return (
      <>
        {/* Backdrop */}
        {mobileOpen &&
          createPortal(
            <div
              className="fixed inset-0 z-40 bg-black/50"
              style={{ top: mobileTopOffset }}
              onClick={() => setMobileOpen(false)}
            />,
            document.body,
          )}

        {/* Slide-in drawer */}
        {createPortal(
          <aside
            ref={drawerRef}
            className={cn(
              "fixed bottom-0 z-50 flex flex-col w-56 bg-white dark:bg-primary-900 shadow-xl transition-transform duration-200",
              drawerBorderCls,
              "border-primary-200 dark:border-primary-700",
              drawerOpenCls,
            )}
            style={{ top: mobileTopOffset, ...drawerLeftStyle }}
            onClick={handleNavClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Drawer header */}
            <div className="flex shrink-0 items-center justify-between border-b border-primary-200 px-3 py-2 dark:border-primary-700">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary-500 dark:text-primary-400">
                Navigation
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileOpen(false);
                }}
                className={cn(iconBtnCls, "h-7 w-7 p-1")}
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Optional slot (e.g. search input) */}
            {mobileDrawerSlot && (
              <div className="shrink-0 border-b border-primary-200 px-3 py-2 dark:border-primary-700">
                {mobileDrawerSlot}
              </div>
            )}
            {/* Scrollable nav body */}
            <div className="flex-1 overflow-y-auto overscroll-y-contain p-3">
              <nav className="flex flex-col gap-0.5">{navBody}</nav>
            </div>
          </aside>,
          document.body,
        )}

        {/* Pull-tab — draggable, snaps to left or right edge */}
        {!mobileOpen &&
          createPortal(
            // Outer hit-area: wider & taller than the visual tab for easier finger grab
            <div
              className={cn(
                "fixed z-50 flex items-center",
                displaySide === "left" ? "justify-start" : "justify-end",
                tabDragLive ? "cursor-grabbing" : "cursor-grab",
              )}
              style={{
                ...tabStyle,
                // Extend hit area: 44px wide, taller by 24px vertically
                width: 44,
                height: 80,
                marginTop: -12, // vertically center the extended hit area
                touchAction: "none",
                userSelect: "none",
              }}
              onPointerDown={handleTabPointerDown}
              onDragStart={(e) => e.preventDefault()}
              role="button"
              aria-label="Open navigation"
              tabIndex={0}
            >
              {/* Visual tab — narrower, centered within the hit area */}
              <div
                className={cn(
                  "flex h-16 w-6 items-center justify-center",
                  "bg-primary-800/80 text-white shadow-md backdrop-blur-sm",
                  "hover:bg-primary-700/90 dark:bg-primary-200/80 dark:text-primary-900 dark:hover:bg-primary-300/90",
                  displaySide === "left" ? "rounded-r-xl" : "rounded-l-xl",
                )}
              >
                {displaySide === "left" ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </div>
            </div>,
            document.body,
          )}
      </>
    );
  }

  // ── Desktop: inline render ────────────────────────────
  return (
    <nav
      className={cn("flex flex-col gap-0.5", mode === "mini" && "items-center", className)}
      {...props}
    >
      {navBody}
    </nav>
  );
}
