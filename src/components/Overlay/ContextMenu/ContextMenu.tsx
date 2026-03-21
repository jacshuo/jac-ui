import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ContextMenuItem, ContextMenuProps } from "./types";

export type { ContextMenuItem, ContextMenuProps };

interface MenuPosition {
  x: number;
  y: number;
}

/* ── Submenu item ─────────────────────────────── */
function MenuItem({
  item,
  depth = 0,
  onClose,
}: {
  item: ContextMenuItem;
  depth?: number;
  onClose: () => void;
}) {
  const [subOpen, setSubOpen] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);
  const subMenuRef = useRef<HTMLUListElement>(null);
  const hasChildren = item.children && item.children.length > 0;

  /* close submenu when mouse leaves item+submenu */
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setSubOpen(false), 150);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  if (item.separator) {
    return (
      <li role="separator" className="my-1 h-px bg-primary-100 dark:bg-primary-700" aria-hidden />
    );
  }

  return (
    <li
      ref={itemRef}
      role="menuitem"
      aria-disabled={item.disabled}
      aria-haspopup={hasChildren}
      aria-expanded={hasChildren ? subOpen : undefined}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-1.5 text-sm outline-none transition-colors",
        item.disabled
          ? "cursor-not-allowed opacity-40"
          : item.danger
            ? "text-danger-600 hover:bg-danger-50 focus-visible:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/30"
            : "text-primary-700 hover:bg-primary-50 focus-visible:bg-primary-50 dark:text-primary-200 dark:hover:bg-primary-800",
      )}
      tabIndex={item.disabled ? -1 : 0}
      onMouseEnter={() => {
        cancelClose();
        if (hasChildren) setSubOpen(true);
      }}
      onMouseLeave={() => {
        if (hasChildren) scheduleClose();
      }}
      onClick={(e) => {
        if (item.disabled) return;
        if (!hasChildren) {
          item.onClick?.(e);
          onClose();
        }
      }}
      onKeyDown={(e) => {
        if (item.disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!hasChildren) {
            item.onClick?.(e as unknown as React.MouseEvent);
            onClose();
          } else {
            setSubOpen((s) => !s);
          }
        }
        if (e.key === "Escape") onClose();
      }}
    >
      {/* Icon */}
      {item.icon ? (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">
          {item.icon}
        </span>
      ) : (
        <span className="h-4 w-4 shrink-0" />
      )}

      {/* Label */}
      <span className="flex-1">{item.label}</span>

      {/* Shortcut */}
      {item.shortcut && !hasChildren && (
        <kbd className="ml-auto rounded bg-primary-100 px-1.5 py-0.5 font-mono text-[0.6rem] text-secondary-500 dark:bg-primary-700 dark:text-secondary-400">
          {item.shortcut}
        </kbd>
      )}

      {/* Submenu chevron */}
      {hasChildren && <ChevronRight className="ml-auto h-3.5 w-3.5 text-secondary-400" />}

      {/* Nested submenu */}
      {hasChildren && subOpen && (
        <ul
          ref={subMenuRef}
          role="menu"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className={cn(
            "absolute top-0 z-50 min-w-[11rem] animate-[fade-in_120ms_ease-out,scale-in_120ms_ease-out] rounded-xl border border-primary-200 bg-white p-1.5 shadow-xl dark:border-primary-700 dark:bg-primary-900",
            depth % 2 === 0 ? "left-full ml-1" : "right-full mr-1",
          )}
        >
          {item.children!.map((child) => (
            <MenuItem key={child.key} item={child} depth={depth + 1} onClose={onClose} />
          ))}
        </ul>
      )}
    </li>
  );
}

/* ── Menu panel ─────────────────────────────────── */
function MenuPanel({
  items,
  position,
  onClose,
}: {
  items: ContextMenuItem[];
  position: MenuPosition;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLUListElement>(null);

  /* Adjust position so menu stays visible */
  const [adjusted, setAdjusted] = useState<MenuPosition>(position);
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let { x, y } = position;
    if (x + rect.width > vw - 8) x = Math.max(8, vw - rect.width - 8);
    if (y + rect.height > vh - 8) y = Math.max(8, vh - rect.height - 8);
    setAdjusted({ x, y });
  }, [position]);

  /* Close on outside click or scroll */
  useEffect(() => {
    const handle = (e: MouseEvent | TouchEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handle, true);
    document.addEventListener("touchstart", handle, true);
    document.addEventListener("scroll", onClose, { passive: true, capture: true });
    return () => {
      document.removeEventListener("mousedown", handle, true);
      document.removeEventListener("touchstart", handle, true);
      document.removeEventListener("scroll", onClose, true);
    };
  }, [onClose]);

  /* Keyboard trap */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <ul
      ref={panelRef}
      role="menu"
      style={{ position: "fixed", left: adjusted.x, top: adjusted.y }}
      className="z-[9999] min-w-[12rem] animate-[fade-in_120ms_ease-out,scale-in_120ms_ease-out] rounded-xl border border-primary-200 bg-white p-1.5 shadow-2xl dark:border-primary-700 dark:bg-primary-900"
    >
      {items.map((item) => (
        <MenuItem key={item.key} item={item} onClose={onClose} />
      ))}
    </ul>
  );
}

/* ── ContextMenu root ─────────────────────────── */
export function ContextMenu({
  items,
  children,
  disabled,
  onOpenChange,
  className,
}: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = useCallback(
    (x: number, y: number) => {
      if (disabled) return;
      setPosition({ x, y });
      setOpen(true);
      onOpenChange?.(true);
    },
    [disabled, onOpenChange],
  );

  const closeMenu = useCallback(() => {
    setOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  /* Desktop: right-click */
  const onContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      openMenu(e.clientX, e.clientY);
    },
    [openMenu],
  );

  /* Mobile: long-press */
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      longPressTimer.current = setTimeout(() => {
        // Suppress the native contextmenu event that browsers fire after a
        // long-press (Android). Without this the native menu races with ours
        // and can appear on top, or double-trigger openMenu.
        document.addEventListener("contextmenu", (ev) => ev.preventDefault(), {
          capture: true,
          once: true,
        });
        openMenu(touch.clientX, touch.clientY);
      }, 500);
    },
    [openMenu],
  );

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }, []);

  return (
    <>
      <div
        className={cn("contents", className)}
        // Prevent iOS Safari's native callout menu and text-selection popup
        // that appear on long-press (-webkit-touch-callout is not in the
        // standard CSSProperties type so we cast the whole object).
        style={
          {
            WebkitTouchCallout: "none",
            userSelect: "none",
          } as React.CSSProperties
        }
        onContextMenu={onContextMenu}
        onTouchStart={onTouchStart}
        onTouchEnd={clearLongPress}
        onTouchMove={clearLongPress}
        onTouchCancel={clearLongPress}
      >
        {children}
      </div>
      {open && <MenuPanel items={items} position={position} onClose={closeMenu} />}
    </>
  );
}
