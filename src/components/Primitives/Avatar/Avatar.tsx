import React, { useState } from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import { avatarVariants } from "../../../styles/theme/primitives";

/* ── Types ────────────────────────────────────────────── */

export type AvatarProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof avatarVariants> & {
    /** Image URL. Falls back to initials (or icon placeholder) if not provided or fails to load. */
    src?: string;
    /** Alt text for the image. Doubles as the source for auto-generated initials. */
    alt?: string;
    /** Override the auto-derived initials (max 2 chars). */
    initials?: string;
    /** Show a coloured status ring around the avatar. */
    status?: "online" | "offline" | "busy" | "away";
  };

export type AvatarGroupProps = {
  children: React.ReactNode;
  /** How many avatars to show before collapsing to "+N". @default 4 */
  max?: number;
  /** Gap direction: avatars overlap on the left side. @default "left" */
  overlap?: "left" | "right";
  className?: string;
};

/* ── helpers ──────────────────────────────────────────── */

function deriveInitials(alt?: string, initials?: string): string {
  if (initials) return initials.slice(0, 2).toUpperCase();
  if (!alt) return "?";
  const parts = alt.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return alt.slice(0, 2).toUpperCase();
}

const statusClass: Record<NonNullable<AvatarProps["status"]>, string> = {
  online: "ring-2 ring-success-500",
  offline: "ring-2 ring-secondary-400",
  busy: "ring-2 ring-danger-500",
  away: "ring-2 ring-warning-500",
};

/* ── Avatar ───────────────────────────────────────────── */

export function Avatar({
  src,
  alt,
  initials,
  size,
  shape,
  status,
  className,
  ...props
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = src && !imgError;
  const label = deriveInitials(alt, initials);

  return (
    <span
      role="img"
      aria-label={alt ?? label}
      className={cn(
        avatarVariants({ size, shape }),
        status && statusClass[status],
        "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
          draggable={false}
        />
      ) : (
        <span className="font-semibold leading-none tracking-wide">{label}</span>
      )}
    </span>
  );
}

/* ── AvatarGroup ──────────────────────────────────────── */

export function AvatarGroup({ children, max = 4, overlap = "left", className }: AvatarGroupProps) {
  const all = React.Children.toArray(children);
  const visible = all.slice(0, max);
  const overflow = all.length - max;

  const direction = overlap === "left" ? "-space-x-3" : "flex-row-reverse -space-x-3";

  return (
    <span className={cn("inline-flex items-center", direction, className)}>
      {visible.map((child, i) => (
        <span key={i} className="ring-2 ring-white dark:ring-primary-900 rounded-full">
          {child}
        </span>
      ))}
      {overflow > 0 && (
        <span
          aria-label={`${overflow} more`}
          className={cn(
            avatarVariants({ size: "md", shape: "circular" }),
            "relative inline-flex shrink-0 select-none items-center justify-center",
            "ring-2 ring-white dark:ring-primary-900",
            "bg-secondary-200 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-200 font-semibold text-xs",
          )}
        >
          +{overflow}
        </span>
      )}
    </span>
  );
}
