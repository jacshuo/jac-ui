import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      intent: {
        primary: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700",
        danger: "bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700",
        warning: "bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700",
        ghost:
          "bg-transparent text-primary-700 hover:bg-primary-100 active:bg-primary-200 dark:text-primary-300 dark:hover:bg-primary-800",
        outline:
          "border border-primary-300 bg-transparent text-primary-700 hover:bg-primary-50 dark:border-primary-600 dark:text-primary-300 dark:hover:bg-primary-800",
      },
      size: {
        sm: "h-7 px-3 text-xs [&_svg]:h-3.5 [&_svg]:w-3.5",
        md: "h-9 px-4 text-sm [&_svg]:h-4 [&_svg]:w-4",
        lg: "h-11 px-6 text-base [&_svg]:h-5 [&_svg]:w-5",
      },
    },
    defaultVariants: { intent: "primary", size: "md" },
  },
);

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded border font-semibold [&_svg]:shrink-0",
  {
    variants: {
      intent: {
        success:
          "border-success-200 bg-success-100 text-success-800 dark:border-success-800 dark:bg-success-900/30 dark:text-success-400",
        warning:
          "border-warning-200 bg-warning-100 text-warning-800 dark:border-warning-800 dark:bg-warning-900/30 dark:text-warning-400",
        error:
          "border-danger-200 bg-danger-100 text-danger-800 dark:border-danger-800 dark:bg-danger-900/30 dark:text-danger-400",
        info: "border-primary-200 bg-primary-100 text-primary-800 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-400",
        primary:
          "border-secondary-200 bg-secondary-100 text-secondary-700 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300",
      },
      size: {
        sm: "px-1.5 py-0 text-[0.625rem] [&_svg]:h-2.5 [&_svg]:w-2.5",
        md: "px-2.5 py-0.5 text-xs [&_svg]:h-3 [&_svg]:w-3",
        lg: "px-3 py-1 text-sm [&_svg]:h-3.5 [&_svg]:w-3.5",
      },
    },
    defaultVariants: { intent: "primary", size: "md" },
  },
);

export const indicatorVariants = cva(
  "absolute flex items-center justify-center rounded-full font-bold leading-none ring-2 ring-white select-none pointer-events-none z-10 dark:ring-primary-900",
  {
    variants: {
      intent: {
        danger: "bg-danger-500 text-white",
        success: "bg-success-500 text-white",
        warning: "bg-warning-500 text-white",
        info: "bg-primary-500 text-white",
        primary: "bg-secondary-500 text-white",
      },
      size: {
        sm: "text-[0.5rem]",
        md: "text-[0.625rem]",
        lg: "text-xs",
      },
      dot: {
        true: "",
        false: "",
      },
      placement: {
        "top-right": "top-0 right-0 translate-x-1/2 -translate-y-1/2",
        "top-left": "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
        "bottom-right": "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
        "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
      },
    },
    compoundVariants: [
      { dot: true, size: "sm", class: "h-1.5 w-1.5 min-w-0 ring-1" },
      { dot: true, size: "md", class: "h-2 w-2 min-w-0" },
      { dot: true, size: "lg", class: "h-2.5 w-2.5 min-w-0" },
      { dot: false, size: "sm", class: "h-4 min-w-4 px-1" },
      { dot: false, size: "md", class: "h-5 min-w-5 px-1.5" },
      { dot: false, size: "lg", class: "h-6 min-w-6 px-2" },
    ],
    defaultVariants: { intent: "danger", size: "md", dot: false, placement: "top-right" },
  },
);

export const inputVariants = cva(
  "w-full rounded-md border bg-white text-secondary-900 transition-colors placeholder:text-secondary-400 focus:outline-none focus:ring-2 dark:bg-secondary-900 dark:text-secondary-100 dark:placeholder:text-secondary-600",
  {
    variants: {
      state: {
        default:
          "border-secondary-300 focus:border-primary-500 focus:ring-primary-500/20 dark:border-secondary-600",
        error: "border-danger-400 focus:border-danger-500 focus:ring-danger-500/20",
      },
      size: {
        sm: "h-7 px-2 text-xs",
        md: "h-9 px-3 py-2 text-sm",
        lg: "h-11 px-4 py-2.5 text-base",
      },
    },
    defaultVariants: { state: "default", size: "md" },
  },
);

export const labelVariants = cva("inline-flex items-center gap-1 font-medium [&_svg]:shrink-0", {
  variants: {
    size: {
      sm: "text-xs [&_svg]:h-3 [&_svg]:w-3",
      md: "text-sm [&_svg]:h-3.5 [&_svg]:w-3.5",
      lg: "text-base [&_svg]:h-4 [&_svg]:w-4",
    },
    intent: {
      default: "text-primary-700 dark:text-primary-300",
      muted: "text-primary-400 dark:text-primary-500",
      required:
        "text-primary-700 dark:text-primary-300 after:ml-0.5 after:text-danger-500 after:content-['*']",
    },
  },
  defaultVariants: { size: "md", intent: "default" },
});

export const checkboxVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center rounded border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      intent: {
        primary: "border-primary-300 dark:border-primary-600 focus-visible:ring-primary-500/40",
        secondary:
          "border-secondary-300 dark:border-secondary-600 focus-visible:ring-secondary-500/40",
        danger: "border-danger-300 dark:border-danger-600 focus-visible:ring-danger-500/40",
        warning: "border-warning-300 dark:border-warning-600 focus-visible:ring-warning-500/40",
        success: "border-success-300 dark:border-success-600 focus-visible:ring-success-500/40",
      },
      size: {
        sm: "h-4 w-4 rounded-[3px]",
        md: "h-5 w-5 rounded",
        lg: "h-6 w-6 rounded-[5px]",
      },
      checked: {
        on: "",
        off: "bg-white dark:bg-primary-900",
      },
    },
    compoundVariants: [
      {
        intent: "primary",
        checked: "on",
        class: "border-primary-500 bg-primary-500 dark:border-primary-500 dark:bg-primary-500",
      },
      {
        intent: "secondary",
        checked: "on",
        class:
          "border-secondary-500 bg-secondary-500 dark:border-secondary-500 dark:bg-secondary-500",
      },
      {
        intent: "danger",
        checked: "on",
        class: "border-danger-500 bg-danger-500 dark:border-danger-500 dark:bg-danger-500",
      },
      {
        intent: "warning",
        checked: "on",
        class: "border-warning-500 bg-warning-500 dark:border-warning-500 dark:bg-warning-500",
      },
      {
        intent: "success",
        checked: "on",
        class: "border-success-500 bg-success-500 dark:border-success-500 dark:bg-success-500",
      },
    ],
    defaultVariants: { intent: "primary", size: "md", checked: "off" },
  },
);

export const radioVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      intent: {
        primary: "border-primary-300 dark:border-primary-600 focus-visible:ring-primary-500/40",
        secondary:
          "border-secondary-300 dark:border-secondary-600 focus-visible:ring-secondary-500/40",
        danger: "border-danger-300 dark:border-danger-600 focus-visible:ring-danger-500/40",
        warning: "border-warning-300 dark:border-warning-600 focus-visible:ring-warning-500/40",
        success: "border-success-300 dark:border-success-600 focus-visible:ring-success-500/40",
      },
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
      },
      checked: {
        on: "",
        off: "bg-white dark:bg-primary-900",
      },
    },
    compoundVariants: [
      {
        intent: "primary",
        checked: "on",
        class: "border-primary-500 bg-primary-500 dark:border-primary-500 dark:bg-primary-500",
      },
      {
        intent: "secondary",
        checked: "on",
        class:
          "border-secondary-500 bg-secondary-500 dark:border-secondary-500 dark:bg-secondary-500",
      },
      {
        intent: "danger",
        checked: "on",
        class: "border-danger-500 bg-danger-500 dark:border-danger-500 dark:bg-danger-500",
      },
      {
        intent: "warning",
        checked: "on",
        class: "border-warning-500 bg-warning-500 dark:border-warning-500 dark:bg-warning-500",
      },
      {
        intent: "success",
        checked: "on",
        class: "border-success-500 bg-success-500 dark:border-success-500 dark:bg-success-500",
      },
    ],
    defaultVariants: { intent: "primary", size: "md", checked: "off" },
  },
);

export const switchTrackVariants = cva("", {
  variants: {
    intent: {
      primary: "",
      secondary: "",
      danger: "",
      warning: "",
      success: "",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
    checked: {
      on: "",
      off: "bg-primary-300 dark:bg-primary-800",
    },
  },
  compoundVariants: [
    { intent: "primary", checked: "on", class: "bg-primary-500 dark:bg-primary-500" },
    { intent: "secondary", checked: "on", class: "bg-secondary-500 dark:bg-secondary-500" },
    { intent: "danger", checked: "on", class: "bg-danger-500 dark:bg-danger-500" },
    { intent: "warning", checked: "on", class: "bg-warning-500 dark:bg-warning-500" },
    { intent: "success", checked: "on", class: "bg-success-500 dark:bg-success-500" },
  ],
  defaultVariants: { intent: "primary", size: "md", checked: "off" },
});
