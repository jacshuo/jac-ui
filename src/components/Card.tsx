import React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { cardVariants } from "../styles/theme";

type CardProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>;

export function Card({ intent, size, className, ...props }: CardProps) {
  return <div className={cn(cardVariants({ intent, size }), className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-primary-900 dark:text-primary-100 text-lg font-semibold", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-primary-500 dark:text-primary-400 text-sm", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-primary-700 dark:text-primary-300 text-sm", className)} {...props} />
  );
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-primary-100 dark:border-primary-800 mt-4 flex items-center gap-2 border-t pt-4",
        className,
      )}
      {...props}
    />
  );
}

/* ── HorizontalCard ───────────────────────────────────── */

type HorizontalCardMediaProps = {
  /** Image source URL. */
  src?: string;
  /** Image alt text. */
  alt?: string;
  /** Render an icon or avatar instead of an image. */
  icon?: React.ReactNode;
  /** Width of the media area. @default '10rem' */
  width?: string;
};

type HorizontalCardProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> &
  VariantProps<typeof cardVariants> & {
    /** Media placement. @default 'left' */
    mediaPosition?: "left" | "right";
    /** Media configuration. */
    media: HorizontalCardMediaProps;
    children: React.ReactNode;
  };

export function HorizontalCard({
  intent,
  media,
  mediaPosition = "left",
  className,
  children,
  ...props
}: HorizontalCardProps) {
  const mediaEl = (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden",
        mediaPosition === "left" ? "rounded-l-lg" : "rounded-r-lg",
      )}
      style={{ width: media.width ?? "10rem" }}
    >
      {media.src ? (
        <img
          src={media.src}
          alt={media.alt ?? ""}
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : media.icon ? (
        <div className="bg-primary-100 text-primary-500 dark:bg-primary-800 dark:text-primary-400 flex h-full w-full items-center justify-center">
          {media.icon}
        </div>
      ) : null}
    </div>
  );

  return (
    <div
      className={cn(
        cardVariants({ intent }),
        "flex overflow-hidden p-0",
        mediaPosition === "right" && "flex-row-reverse",
        className,
      )}
      {...props}
    >
      {mediaEl}
      <div className="flex min-w-0 flex-1 flex-col p-4">{children}</div>
    </div>
  );
}
