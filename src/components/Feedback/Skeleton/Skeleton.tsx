import React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import { skeletonVariants } from "../../../styles/theme/feedback";

export type SkeletonProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> &
  VariantProps<typeof skeletonVariants> & {
    /** CSS width — e.g. "100%", 200, "12rem". Overrides default when supplied. */
    width?: string | number;
    /** CSS height — e.g. 16, "2rem". Overrides default when supplied. */
    height?: string | number;
    /**
     * Renders N stacked text-line skeletons.
     * Only meaningful when variant="text" (default).
     * The last line is narrowed to 60% to mimic natural paragraph endings.
     */
    lines?: number;
  };

function toCSSLength(value: string | number | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

/**
 * Skeleton — loading placeholder that mimics the shape of incoming content.
 *
 * @example
 * <Skeleton variant="text" lines={3} />
 * <Skeleton variant="circular" width={48} height={48} />
 * <Skeleton variant="rectangular" width="100%" height={160} animation="wave" />
 */
export function Skeleton({
  variant = "text",
  animation = "pulse",
  width,
  height,
  lines,
  className,
  style,
  ...props
}: SkeletonProps) {
  const cssWidth = toCSSLength(width);
  const cssHeight = toCSSLength(height);

  /* Multi-line text mode */
  if (variant === "text" && lines !== undefined && lines > 1) {
    return (
      <span
        className={cn("flex flex-col gap-2", className)}
        aria-hidden="true"
        role="presentation"
        style={style}
        {...props}
      >
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className={skeletonVariants({ variant: "text", animation })}
            style={{
              width: i === lines - 1 ? "60%" : (cssWidth ?? "100%"),
              height: cssHeight,
            }}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      className={cn(skeletonVariants({ variant, animation }), className)}
      aria-hidden="true"
      role="presentation"
      style={{ width: cssWidth, height: cssHeight, ...style }}
      {...props}
    />
  );
}
