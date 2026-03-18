import React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { listVariants } from "../styles/theme";

type ListProps = React.HTMLAttributes<HTMLUListElement> & VariantProps<typeof listVariants>;

export function List({ intent, className, ...props }: ListProps) {
  return <ul className={cn(listVariants({ intent }), className)} {...props} />;
}

export type ListItemProps = React.LiHTMLAttributes<HTMLLIElement> & {
  /** Action buttons rendered on the right side of the item. */
  actions?: React.ReactNode;
};

export function ListItem({ actions, className, children, ...props }: ListItemProps) {
  return (
    <li
      className={cn(
        "group flex items-center gap-1.5 [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 flex-1 items-center gap-1.5">{children}</span>
      {actions && (
        <span className="ml-auto flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {actions}
        </span>
      )}
    </li>
  );
}
