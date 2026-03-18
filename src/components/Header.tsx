import React from "react";
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
  className,
  children,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "flex shrink-0 items-center justify-between border-b px-5",
        "border-primary-200 bg-white dark:border-primary-700 dark:bg-primary-900",
        height,
        className,
      )}
    >
      {/* ── Left: brand + nav ──────────────────────────── */}
      <div className="flex items-center gap-6">
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

        {navItems.length > 0 && (
          <nav className="flex items-center gap-4 text-sm">
            {navItems.map((item, i) => {
              const itemKey = typeof item.label === "string" ? item.label : i;
              const cls = item.active
                ? "text-primary-900 font-medium dark:text-primary-100"
                : "text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200 transition-colors";

              if (item.href) {
                return (
                  <Link key={itemKey} href={item.href} className={cls} onClick={item.onClick}>
                    {item.label}
                  </Link>
                );
              }

              return (
                <button
                  key={itemKey}
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

      {/* ── Center: optional children (e.g. search bar) ── */}
      {children && <div className="flex items-center">{children}</div>}

      {/* ── Right: actions ─────────────────────────────── */}
      {actions.length > 0 && (
        <div className="flex items-center gap-1">
          {actions.map((action, i) => {
            const cls =
              "rounded-md p-1.5 text-primary-500 hover:bg-primary-100 hover:text-primary-700 dark:text-primary-400 dark:hover:bg-primary-800 dark:hover:text-primary-200 transition-colors [&_svg]:h-5 [&_svg]:w-5";

            if (action.href) {
              return (
                <a
                  key={action.key ?? i}
                  href={action.href}
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noopener noreferrer" : undefined}
                  className={cls}
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
                className={cls}
                aria-label={action["aria-label"]}
                onClick={action.onClick}
              >
                {action.icon}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
