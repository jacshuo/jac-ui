import { cva } from "class-variance-authority";

export const navLinkVariants = cva(
  "inline-flex items-center gap-1 underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20 [&_svg]:shrink-0",
  {
    variants: {
      intent: {
        default:
          "text-primary-600 hover:text-primary-800 active:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200 dark:active:text-primary-100",
        secondary:
          "text-secondary-500 hover:text-secondary-700 active:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-200 dark:active:text-secondary-100",
        muted:
          "text-primary-400 hover:text-primary-600 dark:text-primary-500 dark:hover:text-primary-300",
      },
      size: {
        sm: "text-xs [&_svg]:h-3 [&_svg]:w-3",
        md: "text-sm [&_svg]:h-3.5 [&_svg]:w-3.5",
        lg: "text-base [&_svg]:h-4 [&_svg]:w-4",
      },
      underline: {
        always: "underline",
        hover: "hover:underline",
        none: "no-underline",
      },
    },
    defaultVariants: { intent: "default", size: "md", underline: "none" },
  },
);
