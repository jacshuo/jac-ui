import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "../../../lib/utils";

/* ── Types ────────────────────────────────────────────── */

export type BreadcrumbItem = {
  label: string;
  href?: string;
  /** Render a custom icon before the label. */
  icon?: React.ReactNode;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  /** Custom separator element. Defaults to ChevronRight icon. */
  separator?: React.ReactNode;
  /**
   * Optional icon (or `true` to use the default Home icon) shown as the first item.
   * @default false
   */
  homeIcon?: React.ReactNode | boolean;
  /** Component to render anchor elements. Defaults to standard `<a>`. */
  LinkComponent?: React.ComponentType<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
  className?: string;
};

/* ── Breadcrumb ───────────────────────────────────────── */

export function Breadcrumb({
  items,
  separator = <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />,
  homeIcon = false,
  LinkComponent = "a" as unknown as React.ComponentType<
    React.AnchorHTMLAttributes<HTMLAnchorElement>
  >,
  className,
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const resolvedHomeIcon =
            homeIcon === true ? (
              <Home className="h-3.5 w-3.5" />
            ) : homeIcon !== false && homeIcon !== undefined ? (
              homeIcon
            ) : null;
          const icon = i === 0 && resolvedHomeIcon ? resolvedHomeIcon : item.icon;

          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && (
                <span className="text-secondary-400 dark:text-secondary-500">{separator}</span>
              )}

              {isLast ? (
                /* Current page — not a link */
                <span
                  aria-current="page"
                  className={cn(
                    "flex items-center gap-1 font-medium text-primary-800 dark:text-primary-100",
                    icon && "gap-1.5",
                  )}
                >
                  {icon}
                  {item.label}
                </span>
              ) : item.href ? (
                <LinkComponent
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 text-secondary-500 transition-colors",
                    "hover:text-primary-700 dark:text-secondary-400 dark:hover:text-primary-200",
                    "rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30",
                    icon && "gap-1.5",
                  )}
                >
                  {icon}
                  {item.label}
                </LinkComponent>
              ) : (
                <span className="flex items-center gap-1 text-secondary-500 dark:text-secondary-400">
                  {icon}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
