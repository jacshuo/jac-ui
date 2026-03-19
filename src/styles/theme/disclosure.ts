import { cva } from "class-variance-authority";

export const accordionTriggerVariants = cva(
  "flex w-full items-center justify-between font-medium transition-all [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "py-2 text-xs [&_svg]:h-3.5 [&_svg]:w-3.5",
        md: "py-3 text-sm [&_svg]:h-4 [&_svg]:w-4",
        lg: "py-4 text-base [&_svg]:h-5 [&_svg]:w-5",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export const accordionContentVariants = cva("", {
  variants: {
    size: {
      sm: "pb-2 text-xs",
      md: "pb-3 text-sm",
      lg: "pb-4 text-base",
    },
  },
  defaultVariants: { size: "md" },
});

export const accordionVariants = cva("divide-y", {
  variants: {
    intent: {
      default: "divide-primary-300 dark:divide-primary-700",
      bordered:
        "divide-primary-300 rounded-lg border border-primary-300 bg-white px-3 shadow-sm dark:divide-primary-700 dark:border-primary-700 dark:bg-primary-800/50",
      ghost: "divide-transparent",
    },
  },
  defaultVariants: { intent: "default" },
});

export const tabListVariants = cva("flex", {
  variants: {
    intent: {
      line: "border-b border-primary-200 dark:border-primary-700",
      pills: "gap-1 rounded-lg bg-primary-100 p-1 dark:bg-primary-800",
      underline: "gap-4",
    },
  },
  defaultVariants: { intent: "line" },
});

export const tabTriggerVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
  {
    variants: {
      intent: {
        line: "text-primary-500 hover:text-primary-700 data-[active=true]:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200 dark:data-[active=true]:text-primary-100",
        pills:
          "rounded-md text-primary-600 hover:text-primary-900 data-[active=true]:bg-white data-[active=true]:text-primary-900 data-[active=true]:shadow-sm dark:text-primary-400 dark:hover:text-primary-100 dark:data-[active=true]:bg-primary-700 dark:data-[active=true]:text-primary-100",
        underline:
          "text-primary-500 hover:text-primary-700 data-[active=true]:text-primary-900 dark:text-primary-400 dark:data-[active=true]:text-primary-100",
      },
    },
    defaultVariants: { intent: "line" },
  },
);
