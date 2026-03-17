import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { listVariants } from '../styles/theme';

type ListProps = React.HTMLAttributes<HTMLUListElement> & VariantProps<typeof listVariants>;

export function List({ intent, className, ...props }: ListProps) {
  return <ul className={cn(listVariants({ intent }), className)} {...props} />;
}

export function ListItem({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li className={cn('flex items-center gap-1.5 [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0', className)} {...props} />;
}
