import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { PanelLeft, MoreHorizontal, X } from "lucide-react";
import { cn } from "../lib/utils";

/* ── Types ─────────────────────────────────────────────── */

export interface HeaderNavItem {
  /** Display label. */
  label: React.ReactNode;
  /** URL or route path. */
  href?: string;
  /** Marks this item as currently active. */
  active?: boolean;
  /** Click handler (for SPA routing or custom behaviour). */
  onClick?: (e: React.MouseEvent) => void;
}

export interface HeaderAction {
  /** Unique key. Falls back to index. */
  key?: string;
  /** Icon or element to render. */
  icon: React.ReactNode;
  /** Accessible label for the button. */
  "aria-label": string;
  /** Click handler. */
  onClick?: (e: React.MouseEvent) => void;
  /** Render as a link instead of a button. */
  href?: string;
  /** Open in new tab (when href is set). */
  external?: boolean;
}

export interface HeaderProps {
  /** Brand text, logo element, or both. */
  brand?: React.ReactNode;
  /** Click handler on the brand element (e.g. navigate home). */
  onBrandClick?: (e: React.MouseEvent) => void;
  /** Primary navigation items displayed after the brand. */
  navItems?: HeaderNavItem[];
  /** Action buttons rendered on the right side (e.g. search, theme toggle, login). */
  actions?: HeaderAction[];
  /** Override the link component used for nav items (e.g. React-Router NavLink). */
  linkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
    children: React.ReactNode;
  }>;
  /** Fixed height class. @default 'h-12' */
  height?: string;
  /** Additional class names for the root header element. */
  className?: string;
  /** Content rendered between nav items and actions (e.g. search bar). */
  children?: React.ReactNode;
  /** Show a hamburger menu button on small screens (< md) that reveals nav items. @default false */
  mobileMenu?: boolean;
  /** Custom icon for the mobile nav toggle (left side). @default <PanelLeft> */
  navMenuIcon?: React.ReactNode;
  /** Custom icon for the mobile actions toggle (right side). @default <MoreHorizontal> */
  actionsMenuIcon?: React.ReactNode;
}

/* ── Default link ──────────────────────────────────────── */

function DefaultLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

/* ── Component ─────────────────────────────────────────── */

export function Header({
  brand,
  onBrandClick,
  navItems = [],
  actions = [],
  linkComponent: Link = DefaultLink,
  height = "h-12",
  mobileMenu = false,
  navMenuIcon,
  actionsMenuIcon,
  className,
  children,
}: HeaderProps) {
  const [navOpen, setNavOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navDropdownRef = useRef<HTMLDivElement>(null);
  const actionsDropdownRef = useRef<HTMLDivElement>(null);
  const [headerRect, setHeaderRect] = useState<DOMRect | null>(null);

  const hasNavHamburger = mobileMenu && navItems.length > 0;
  const hasActionsHamburger = mobileMenu && actions.length > 0;

  // Measure header position whenever a dropdown opens
  useLayoutEffect(() => {
    if ((navOpen || actionsOpen) && headerRef.current) {
      setHeaderRect(headerRef.current.getBoundingClientRect());
    }
  }, [navOpen, actionsOpen]);

  // Outside-click, scroll-to-close, resize-reposition
  useEffect(() => {
    if (!navOpen && !actionsOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        !containerRef.current?.contains(t) &&
        !navDropdownRef.current?.contains(t) &&
        !actionsDropdownRef.current?.contains(t)
      ) {
        setNavOpen(false);
        setActionsOpen(false);
      }
    };
    const onScroll = () => {
      setNavOpen(false);
      setActionsOpen(false);
    };
    const onResize = () => {
      if (headerRef.current) setHeaderRect(headerRef.current.getBoundingClientRect());
    };
    document.addEventListener("mousedown", onMouseDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [navOpen, actionsOpen]);

  const iconBtnCls =
    "rounded-md p-1.5 text-primary-500 hover:bg-primary-100 hover:text-primary-700 dark:text-primary-400 dark:hover:bg-primary-800 dark:hover:text-primary-200 transition-colors [&_svg]:h-5 [&_svg]:w-5";

  const desktopNavCls = (active?: boolean) =>
    active
      ? "text-primary-900 font-medium dark:text-primary-100"
      : "text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200 transition-colors";

  const mobileNavCls = (active?: boolean) =>
    cn(
      "flex w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
      active
        ? "bg-primary-100 font-medium text-primary-900 dark:bg-primary-800 dark:text-primary-100"
        : "text-primary-600 hover:bg-primary-50 hover:text-primary-900 dark:text-primary-400 dark:hover:bg-primary-800/50 dark:hover:text-primary-200",
    );

  const mobileActionCls =
    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-primary-600 hover:bg-primary-50 hover:text-primary-900 dark:text-primary-400 dark:hover:bg-primary-800/50 dark:hover:text-primary-200 transition-colors [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0";

  return (
    <div className="relative" ref={containerRef}>
      <header
        ref={headerRef}
        className={cn(
          "flex shrink-0 items-center justify-between border-b px-5",
          "border-primary-200 bg-white dark:border-primary-700 dark:bg-primary-900",
          height,
          className,
        )}
      >
        {/* ── Left: brand + mobile nav hamburger + desktop nav ── */}
        <div className="flex items-center gap-2 md:gap-6">
          {brand && (
            <div
              className={cn(
                "text-lg font-bold text-primary-800 dark:text-primary-100",
                onBrandClick && "cursor-pointer",
              )}
              onClick={onBrandClick}
              role={onBrandClick ? "button" : undefined}
              tabIndex={onBrandClick ? 0 : undefined}
              onKeyDown={
                onBrandClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onBrandClick(e as unknown as React.MouseEvent);
                      }
                    }
                  : undefined
              }
            >
              {brand}
            </div>
          )}

          {/* Mobile-only nav hamburger */}
          {hasNavHamburger && (
            <button
              type="button"
              className={cn(iconBtnCls, "md:hidden")}
              aria-label={navOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={navOpen}
              onClick={() => {
                setNavOpen((o) => !o);
                setActionsOpen(false);
              }}
            >
              {navOpen ? (
                <X className="h-5 w-5" />
              ) : (
                (navMenuIcon ?? <PanelLeft className="h-5 w-5" />)
              )}
            </button>
          )}

          {/* Desktop nav */}
          {navItems.length > 0 && (
            <nav
              className={cn(
                "flex items-center gap-4 text-sm",
                mobileMenu ? "hidden md:flex" : "flex",
              )}
            >
              {navItems.map((item, i) => {
                const key = typeof item.label === "string" ? item.label : i;
                const cls = desktopNavCls(item.active);
                if (item.href) {
                  return (
                    <Link key={key} href={item.href} className={cls} onClick={item.onClick}>
                      {item.label}
                    </Link>
                  );
                }
                return (
                  <button
                    key={key}
                    type="button"
                    className={cn(cls, "cursor-pointer")}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        {/* ── Center ── */}
        {children && <div className="flex items-center">{children}</div>}

        {/* ── Right: desktop actions + mobile actions hamburger ── */}
        <div className="flex items-center gap-1">
          {actions.length > 0 && (
            <div className={cn("flex items-center gap-1", mobileMenu ? "hidden md:flex" : "flex")}>
              {actions.map((action, i) => {
                if (action.href) {
                  return (
                    <a
                      key={action.key ?? i}
                      href={action.href}
                      target={action.external ? "_blank" : undefined}
                      rel={action.external ? "noopener noreferrer" : undefined}
                      className={iconBtnCls}
                      aria-label={action["aria-label"]}
                      onClick={action.onClick}
                    >
                      {action.icon}
                    </a>
                  );
                }
                return (
                  <button
                    key={action.key ?? i}
                    type="button"
                    className={iconBtnCls}
                    aria-label={action["aria-label"]}
                    onClick={action.onClick}
                  >
                    {action.icon}
                  </button>
                );
              })}
            </div>
          )}

          {/* Mobile-only actions hamburger */}
          {hasActionsHamburger && (
            <button
              type="button"
              className={cn(iconBtnCls, "md:hidden")}
              aria-label={actionsOpen ? "Close menu" : "Open menu"}
              aria-expanded={actionsOpen}
              onClick={() => {
                setActionsOpen((o) => !o);
                setNavOpen(false);
              }}
            >
              {actionsOpen ? (
                <X className="h-5 w-5" />
              ) : (
                (actionsMenuIcon ?? <MoreHorizontal className="h-5 w-5" />)
              )}
            </button>
          )}
        </div>
      </header>

      {/* ── Nav portal dropdown (left-anchored, full-width) ── */}
      {hasNavHamburger &&
        navOpen &&
        headerRect &&
        createPortal(
          <div
            ref={navDropdownRef}
            className="z-9999 border-b border-primary-200 bg-white shadow-lg dark:border-primary-700 dark:bg-primary-900"
            style={{
              position: "fixed",
              top: headerRect.bottom,
              left: headerRect.left,
              right: window.innerWidth - headerRect.right,
            }}
          >
            <nav className="flex flex-col gap-0.5 px-3 py-2">
              {navItems.map((item, i) => {
                const key = typeof item.label === "string" ? item.label : i;
                const cls = mobileNavCls(item.active);
                if (item.href) {
                  return (
                    <Link
                      key={key}
                      href={item.href}
                      className={cls}
                      onClick={(e) => {
                        item.onClick?.(e);
                        setNavOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                }
                return (
                  <button
                    key={key}
                    type="button"
                    className={cls}
                    onClick={(e) => {
                      item.onClick?.(e);
                      setNavOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>,
          document.body,
        )}

      {/* ── Actions portal dropdown (right-anchored) ── */}
      {hasActionsHamburger &&
        actionsOpen &&
        headerRect &&
        createPortal(
          <div
            ref={actionsDropdownRef}
            className="z-9999 min-w-44 rounded-bl-lg border-b border-l border-primary-200 bg-white shadow-lg dark:border-primary-700 dark:bg-primary-900"
            style={{
              position: "fixed",
              top: headerRect.bottom,
              right: window.innerWidth - headerRect.right,
            }}
          >
            <div className="flex flex-col gap-0.5 p-2">
              {actions.map((action, i) => {
                if (action.href) {
                  return (
                    <a
                      key={action.key ?? i}
                      href={action.href}
                      target={action.external ? "_blank" : undefined}
                      rel={action.external ? "noopener noreferrer" : undefined}
                      className={mobileActionCls}
                      aria-label={action["aria-label"]}
                      onClick={() => setActionsOpen(false)}
                    >
                      {action.icon}
                      <span>{action["aria-label"]}</span>
                    </a>
                  );
                }
                return (
                  <button
                    key={action.key ?? i}
                    type="button"
                    className={mobileActionCls}
                    onClick={(e) => {
                      action.onClick?.(e);
                      setActionsOpen(false);
                    }}
                  >
                    {action.icon}
                    <span>{action["aria-label"]}</span>
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
