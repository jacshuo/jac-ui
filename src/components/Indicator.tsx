import type React from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { indicatorVariants } from "../styles/theme";

const PULSE_BG: Record<string, string> = {
  danger: "bg-danger-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  info: "bg-primary-500",
  primary: "bg-secondary-500",
};

export interface IndicatorProps extends VariantProps<typeof indicatorVariants> {
  children: React.ReactNode;
  /** Show or hide the indicator. @default true */
  show?: boolean;
  /** Content to display. Numbers > 99 are shown as "99+". Ignored when dot=true. */
  content?: React.ReactNode;
  /** Show a pulsing ring animation (best for dot-only mode). @default false */
  pulse?: boolean;
  className?: string;
}

export function Indicator({
  children,
  show = true,
  content,
  dot,
  intent = "danger",
  size = "md",
  placement = "top-right",
  pulse = false,
  className,
}: IndicatorProps) {
  // Treat as dot when explicitly set, or when no content is provided
  const isDot = dot ?? (content === undefined || content === null);

  const displayContent = isDot
    ? null
    : typeof content === "number"
      ? content > 99
        ? "99+"
        : String(content)
      : content;

  return (
    <div className="relative inline-flex">
      {children}
      {show && (
        <span
          className={cn(indicatorVariants({ intent, size, dot: isDot, placement }), className)}
          role={typeof content === "number" ? "status" : undefined}
          aria-label={typeof content === "number" ? String(content) : undefined}
        >
          {pulse && (
            <span
              className={cn(
                "absolute inset-0 rounded-full animate-ping opacity-60",
                PULSE_BG[intent ?? "danger"],
              )}
              aria-hidden="true"
            />
          )}
          {displayContent}
        </span>
      )}
    </div>
  );
}
