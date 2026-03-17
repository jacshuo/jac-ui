import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { panelVariants } from '../styles/theme';

type PanelProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof panelVariants>;

export function Panel({ intent, size, className, ...props }: PanelProps) {
  return <div className={cn(panelVariants({ intent, size }), className)} {...props} />;
}

export function PanelHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'border-primary-200 text-primary-900 dark:border-primary-700 dark:text-primary-100 mb-3 flex items-center gap-1.5 border-b pb-3 text-sm font-semibold [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    />
  );
}

export function PanelContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('text-primary-700 dark:text-primary-300 text-sm', className)} {...props} />
  );
}
