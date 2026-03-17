import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { inputVariants } from '../styles/theme';

type InputVariants = VariantProps<typeof inputVariants>;

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> & {
  state?: InputVariants['state'];
  inputSize?: InputVariants['size'];
  /** Icon or label shown at the start of the input with a highlighted background */
  prefix?: React.ReactNode;
  /** Icon shown inside the input at the end (non-interactive decoration) */
  suffix?: React.ReactNode;
  /** Clickable action button rendered at the end of the input */
  action?: {
    icon: React.ReactNode;
    onClick: () => void;
    'aria-label'?: string;
  };
};

const sizeMap = {
  sm: { wrapper: 'h-7 text-xs', prefix: 'px-2 text-xs [&_svg]:h-3 [&_svg]:w-3', input: 'px-2 text-xs', icon: 'px-1.5 [&_svg]:h-3 [&_svg]:w-3' },
  md: { wrapper: 'h-9 text-sm', prefix: 'px-3 text-sm [&_svg]:h-4 [&_svg]:w-4', input: 'px-3 py-2 text-sm', icon: 'px-2 [&_svg]:h-4 [&_svg]:w-4' },
  lg: { wrapper: 'h-11 text-base', prefix: 'px-4 text-base [&_svg]:h-5 [&_svg]:w-5', input: 'px-4 py-2.5 text-base', icon: 'px-2.5 [&_svg]:h-5 [&_svg]:w-5' },
} as const;

const stateMap = {
  default: 'border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-gray-600',
  error: 'border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20',
} as const;

export function Input({
  state = 'default',
  inputSize = 'md',
  className,
  prefix,
  suffix,
  action,
  ...props
}: InputProps) {
  // Simple path — no prefix/suffix/action, render plain <input>
  if (!prefix && !suffix && !action) {
    return <input className={cn(inputVariants({ state, size: inputSize }), className)} {...props} />;
  }

  const sz = sizeMap[inputSize ?? 'md'];
  const st = stateMap[state ?? 'default'];

  return (
    <div
      className={cn(
        'flex w-full items-center overflow-hidden rounded-md border bg-white transition-colors dark:bg-gray-900',
        sz.wrapper,
        st,
        className,
      )}
    >
      {prefix && (
        <span
          className={cn(
            'flex shrink-0 items-center gap-1.5 self-stretch border-r border-gray-300 bg-gray-50 font-medium text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300',
            sz.prefix,
          )}
        >
          {prefix}
        </span>
      )}
      <input
        className={cn(
          'min-w-0 flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-600',
          sz.input,
          prefix && 'pl-2',
        )}
        {...props}
      />
      {suffix && (
        <span
          className={cn(
            'pointer-events-none flex shrink-0 items-center text-gray-400 dark:text-gray-500',
            sz.icon,
          )}
        >
          {suffix}
        </span>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          aria-label={action['aria-label'] ?? 'Action'}
          className={cn(
            'flex shrink-0 items-center text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400',
            sz.icon,
          )}
        >
          {action.icon}
        </button>
      )}
    </div>
  );
}
