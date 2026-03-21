import { cva } from "class-variance-authority";

export const progressBarVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-primary-200 dark:bg-primary-700",
  {
    variants: {
      size: {
        xs: "h-1",
        sm: "h-2",
        md: "h-3",
        lg: "h-4",
      },
      intent: {
        primary: "[&_.progress-fill]:bg-primary-500",
        success: "[&_.progress-fill]:bg-success-500",
        warning: "[&_.progress-fill]:bg-warning-500",
        danger: "[&_.progress-fill]:bg-danger-500",
      },
      edge: {
        none: "rounded-full",
        top: "fixed top-0 left-0 right-0 z-50 rounded-none",
        bottom: "fixed bottom-0 left-0 right-0 z-50 rounded-none",
      },
    },
    defaultVariants: { size: "md", intent: "primary", edge: "none" },
  },
);

export const spinVariants = cva("text-primary-500 dark:text-primary-400", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: { size: "md" },
});

export const alertVariants = cva(
  "pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all",
  {
    variants: {
      intent: {
        success:
          "border-success-200 bg-success-50 text-success-800 dark:border-success-800 dark:bg-success-900/80 dark:text-success-200",
        warning:
          "border-warning-200 bg-warning-50 text-warning-800 dark:border-warning-800 dark:bg-warning-900/80 dark:text-warning-200",
        error:
          "border-danger-200 bg-danger-50 text-danger-800 dark:border-danger-800 dark:bg-danger-900/80 dark:text-danger-200",
        info: "border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-800 dark:bg-primary-900/80 dark:text-primary-200",
      },
    },
    defaultVariants: { intent: "info" },
  },
);

export const skeletonVariants = cva("skeleton-base bg-secondary-200 dark:bg-secondary-700", {
  variants: {
    variant: {
      text: "skeleton-text w-full rounded-sm",
      circular: "rounded-full",
      rectangular: "rounded-none",
      rounded: "rounded-md",
    },
    animation: {
      pulse: "animate-pulse",
      wave: "skeleton-wave",
      none: "",
    },
  },
  defaultVariants: { variant: "text", animation: "pulse" },
});

export const toastVariants = cva("border", {
  variants: {
    variant: {
      default:
        "bg-primary-800 text-primary-50 border-primary-700 dark:bg-primary-100 dark:text-primary-900 dark:border-primary-200",
      success:
        "bg-success-500 text-white border-success-600 dark:bg-success-600 dark:border-success-700",
      danger:
        "bg-danger-500 text-white border-danger-600 dark:bg-danger-600 dark:border-danger-700",
      warning:
        "bg-warning-500 text-warning-900 border-warning-600 dark:bg-warning-600 dark:text-white dark:border-warning-700",
      info: "bg-primary-500 text-white border-primary-600 dark:bg-primary-600 dark:border-primary-700",
    },
  },
  defaultVariants: { variant: "default" },
});
