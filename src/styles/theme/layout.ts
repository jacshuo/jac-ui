import { cva } from "class-variance-authority";

export const cardVariants = cva("rounded-lg transition-shadow", {
  variants: {
    intent: {
      default: "border border-primary-200 bg-white dark:border-primary-700 dark:bg-primary-900",
      elevated:
        "bg-white shadow-md hover:shadow-lg dark:bg-primary-800 dark:shadow-primary-300/25 dark:hover:shadow-primary-200/30",
      outlined: "border-2 border-primary-300 bg-transparent dark:border-primary-600",
      ghost: "bg-primary-50 dark:bg-primary-800/50",
    },
    size: {
      sm: "p-3",
      md: "p-5",
      lg: "p-7",
    },
  },
  defaultVariants: { intent: "default", size: "md" },
});

export const panelVariants = cva("rounded-md", {
  variants: {
    intent: {
      default: "border border-primary-200 bg-white dark:border-primary-700 dark:bg-primary-900",
      inset: "bg-primary-50 dark:bg-primary-800/50",
      elevated: "bg-white shadow-lg dark:bg-primary-800 dark:shadow-primary-300/25",
    },
    size: {
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    },
  },
  defaultVariants: { intent: "default", size: "md" },
});
