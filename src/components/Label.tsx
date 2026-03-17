import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { labelVariants } from '../styles/theme';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & VariantProps<typeof labelVariants>;

export function Label({ intent, size, className, ...props }: LabelProps) {
  return <label className={cn(labelVariants({ intent, size }), className)} {...props} />;
}
