import React, { createContext, useContext } from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import { listVariants, listItemVariants } from "../../../styles/theme/data-display";

/* ── Context ─────────────────────────────────────────── */

type ListCtx = { size: "sm" | "md" | "lg" };
const ListContext = createContext<ListCtx>({ size: "md" });

type ListProps = React.HTMLAttributes<HTMLUListElement> &
  VariantProps<typeof listVariants> & {
    /** Controls item text and icon sizing. @default 'md' */
    size?: "sm" | "md" | "lg";
  };

export function List({ intent, size = "md", className, ...props }: ListProps) {
  return (
    <ListContext.Provider value={{ size }}>
      <ul className={cn(listVariants({ intent }), className)} {...props} />
    </ListContext.Provider>
  );
}

export type ListItemProps = React.LiHTMLAttributes<HTMLLIElement> & {
  /** Action buttons rendered on the right side of the item. */
  actions?: React.ReactNode;
};

export function ListItem({ actions, className, children, ...props }: ListItemProps) {
  const { size } = useContext(ListContext);
  return (
    <li className={cn(listItemVariants({ size }), className)} {...props}>
      <span className="flex min-w-0 flex-1 items-center gap-1.5">{children}</span>
      {actions && (
        <span className="ml-auto flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 [@media(hover:none)]:opacity-100 [@media(hover:none)]:[&>button]:min-h-(--row-action-touch-min) [@media(hover:none)]:[&>button]:min-w-(--row-action-touch-min) [@media(hover:none)]:[&>button]:flex [@media(hover:none)]:[&>button]:items-center [@media(hover:none)]:[&>button]:justify-center">
          {actions}
        </span>
      )}
    </li>
  );
}
