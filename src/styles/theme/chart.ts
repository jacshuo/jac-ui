import { cva } from "class-variance-authority";

export const chartContainerVariants = cva("relative w-full font-sans select-none", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: { size: "md" },
});

export const chartLegendVariants = cva("flex flex-wrap gap-3 items-center justify-center", {
  variants: {
    position: {
      top: "mb-3",
      bottom: "mt-3",
      left: "flex-col mr-4",
      right: "flex-col ml-4",
    },
  },
  defaultVariants: { position: "bottom" },
});

export const chartTooltipVariants = cva(
  "absolute z-50 pointer-events-none px-3 py-2 rounded-lg text-xs shadow-lg border transition-opacity duration-150 bg-primary-900 text-primary-50 border-primary-700 dark:bg-primary-950 dark:border-primary-800",
);
