import { cva } from "class-variance-authority";

export const dialogContentVariants = cva("rounded-lg bg-white p-6 shadow-xl dark:bg-primary-900", {
  variants: {
    size: {
      sm: "w-full max-w-sm",
      md: "w-full max-w-lg",
      lg: "w-full max-w-2xl",
      xl: "w-full max-w-4xl",
      full: "h-[calc(100vh-4rem)] w-[calc(100vw-4rem)]",
    },
  },
  defaultVariants: { size: "md" },
});

export const tooltipVariants = cva(
  "absolute z-50 rounded px-2 py-1 text-xs shadow-md animate-fade-in",
  {
    variants: {
      intent: {
        default: "bg-primary-900 text-white dark:bg-primary-100 dark:text-primary-900",
        light:
          "border border-primary-200 bg-white text-primary-700 dark:border-primary-600 dark:bg-primary-800 dark:text-primary-200",
      },
    },
    defaultVariants: { intent: "default" },
  },
);
