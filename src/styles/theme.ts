import { cva } from "class-variance-authority";

// ─── Button
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

// ─── Badge
export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded border px-2.5 py-0.5 text-xs font-semibold [&_svg]:h-3 [&_svg]:w-3 [&_svg]:shrink-0",
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
    },
    defaultVariants: { intent: "primary" },
  },
);

// ─── Input
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

// ─── Label
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

// ─── Card
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

// ─── Panel
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

// ─── Table
export const tableVariants = cva("w-full text-left text-sm", {
  variants: {
    intent: {
      default: "",
      striped:
        "[&_tbody_tr:nth-child(even)]:bg-primary-50 dark:[&_tbody_tr:nth-child(even)]:bg-primary-800/30",
      bordered:
        "[&_th]:border [&_td]:border [&_th]:border-primary-200 [&_td]:border-primary-200 dark:[&_th]:border-primary-700 dark:[&_td]:border-primary-700",
    },
  },
  defaultVariants: { intent: "default" },
});

// ─── List
export const listVariants = cva("text-sm text-primary-700 dark:text-primary-300", {
  variants: {
    intent: {
      default: "space-y-1",
      bordered:
        "divide-y divide-primary-200 rounded-lg border border-primary-200 dark:divide-primary-700 dark:border-primary-700 [&>li]:px-4 [&>li]:py-2",
      hover:
        "[&>li]:rounded-md [&>li]:px-3 [&>li]:py-2 [&>li]:transition-colors [&>li:hover]:bg-primary-50 dark:[&>li:hover]:bg-primary-800/50",
    },
  },
  defaultVariants: { intent: "default" },
});

// ─── Accordion
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

// ─── Tabs
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

// ─── Dialog
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

// ─── Tooltip
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

// ─── NavLink
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

// ─── CodeBlock
export const codeBlockVariants = cva(
  "overflow-x-auto rounded-lg font-mono [&_pre]:m-0 [&_pre]:p-4 [&_code]:bg-transparent",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: { size: "md" },
  },
);

// ─── ProgressBar
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
        top: "fixed top-0 left-0 z-50 rounded-none",
        bottom: "fixed bottom-0 left-0 z-50 rounded-none",
      },
    },
    defaultVariants: { size: "md", intent: "primary", edge: "none" },
  },
);

// ─── Spin
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

// ─── Checkbox
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

// ─── Radio
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

// ─── Switch
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

// ─── Alert
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
