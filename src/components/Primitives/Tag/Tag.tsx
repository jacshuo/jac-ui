import React from "react";
import { type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { tagVariants } from "../../../styles/theme/primitives";

export type TagProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof tagVariants> & {
    /** Icon or element displayed before label */
    icon?: React.ReactNode;
    /** Show remove button */
    removable?: boolean;
    /** Called when remove button is clicked */
    onRemove?: () => void;
    /** Disables interaction */
    disabled?: boolean;
    /** Dot indicator to left of label */
    dot?: boolean;
  };

export function Tag({
  intent,
  size,
  variant,
  icon,
  removable,
  onRemove,
  disabled,
  dot,
  className,
  children,
  ...props
}: TagProps) {
  return (
    <span
      className={cn(
        tagVariants({ intent, size, variant }),
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      aria-disabled={disabled}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 shrink-0 rounded-full",
            intent === "success" && "bg-success-500",
            intent === "danger" && "bg-danger-500",
            intent === "warning" && "bg-warning-500",
            (!intent || intent === "primary") && "bg-primary-500",
            intent === "secondary" && "bg-secondary-500",
            intent === "info" && "bg-blue-500",
          )}
        />
      )}
      {icon && <span className="shrink-0 [&_svg]:h-[1em] [&_svg]:w-[1em]">{icon}</span>}
      {children && <span>{children}</span>}
      {removable && (
        <button
          type="button"
          aria-label="Remove tag"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          disabled={disabled}
          className={cn(
            "ml-0.5 -mr-0.5 inline-flex items-center justify-center rounded-full p-0.5 transition-colors hover:bg-black/10 dark:hover:bg-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current",
          )}
        >
          <X className="h-[0.75em] w-[0.75em]" />
        </button>
      )}
    </span>
  );
}
