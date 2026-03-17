import React from 'react';
import { cn } from '../lib/utils';

/* ── Types ─────────────────────────────────────────────── */

export interface ImageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Image source URL. */
  src: string;
  /** Image alt text. */
  alt?: string;
  /** Fixed aspect ratio for the image area. @default '16/9' */
  aspectRatio?: string;
}

export interface ImageCardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface ImageCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface ImageCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface ImageCardActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

/* ── ImageCard ─────────────────────────────────────────── */

export function ImageCard({
  src,
  alt = '',
  aspectRatio = '16/9',
  className,
  children,
  ...props
}: ImageCardProps) {
  return (
    <div
      className={cn(
        'group overflow-hidden rounded-xl border transition-shadow duration-300',
        'border-primary-200 dark:border-primary-700 dark:bg-primary-900 bg-white',
        'dark:hover:shadow-primary-900/60 hover:shadow-lg',
        className,
      )}
      {...props}
    >
      {/* Image area */}
      <div className="relative overflow-hidden" style={{ aspectRatio }}>
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          draggable={false}
        />
        {/* Light sweep overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        >
          <div className="animate-light-sweep absolute inset-0" />
        </div>
      </div>

      {/* Body / actions area */}
      {children}
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────── */

export function ImageCardBody({ className, ...props }: ImageCardBodyProps) {
  return <div className={cn('space-y-2 p-4', className)} {...props} />;
}

export function ImageCardTitle({ className, ...props }: ImageCardTitleProps) {
  return (
    <h3
      className={cn('text-primary-900 dark:text-primary-100 text-base font-semibold', className)}
      {...props}
    />
  );
}

export function ImageCardDescription({ className, ...props }: ImageCardDescriptionProps) {
  return (
    <p className={cn('text-primary-500 dark:text-primary-400 text-sm', className)} {...props} />
  );
}

export function ImageCardActions({ className, ...props }: ImageCardActionsProps) {
  return (
    <div
      className={cn(
        'border-primary-100 dark:border-primary-800 flex items-center gap-2 border-t px-4 py-3',
        className,
      )}
      {...props}
    />
  );
}
