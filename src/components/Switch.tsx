import React, { useId, useState, useCallback } from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { switchTrackVariants } from "../styles/theme";

export type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> &
  Omit<VariantProps<typeof switchTrackVariants>, "checked"> & {
    /** Controlled checked state. */
    checked?: boolean;
    /** Default checked state (uncontrolled). */
    defaultChecked?: boolean;
    /** Callback when the switch is toggled. */
    onCheckedChange?: (checked: boolean) => void;
    /** Text/icon shown when checked (inside the track). */
    checkedContent?: React.ReactNode;
    /** Text/icon shown when unchecked (inside the track). */
    uncheckedContent?: React.ReactNode;
    /** Accessible label text shown beside the switch. */
    label?: string;
  };

/*
  Size tokens
  ─────────────────────────────────────────────────────
  For each size we define:
    trackFixed  – fixed width+height for plain (no-content) mode
    trackH      – height-only for content mode (width auto-fits)
    thumb       – thumb dimensions
    thumbTop    – vertical centering of thumb
    thumbOff    – left offset when unchecked
    thumbOn     – left offset when checked (calc pushes to right edge)
    padOn       – inner padding when checked  (small-left, thumb-right)
    padOff      – inner padding when unchecked (thumb-left, small-right)
    icon        – font / svg sizing for inline content
*/
const sizeMap = {
  sm: {
    trackFixed: "h-5 w-9",
    trackH: "h-5 min-w-9",
    thumb: "h-3.5 w-3.5",
    thumbTop: "top-[3px]",
    thumbOff: "left-[2px]",
    thumbOn: "left-[calc(100%-16px)]",
    pad: "pl-[6px] pr-[18px]",
    contentLeft: "left-[6px]",
    contentRight: "right-[6px]",
    icon: "text-[10px] [&_svg]:h-3 [&_svg]:w-3",
  },
  md: {
    trackFixed: "h-6 w-11",
    trackH: "h-6 min-w-11",
    thumb: "h-4.5 w-4.5",
    thumbTop: "top-[3px]",
    thumbOff: "left-[2px]",
    thumbOn: "left-[calc(100%-20px)]",
    pad: "pl-[7px] pr-[23px]",
    contentLeft: "left-[7px]",
    contentRight: "right-[7px]",
    icon: "text-xs [&_svg]:h-3.5 [&_svg]:w-3.5",
  },
  lg: {
    trackFixed: "h-7 w-14",
    trackH: "h-7 min-w-14",
    thumb: "h-5.5 w-5.5",
    thumbTop: "top-[3px]",
    thumbOff: "left-[3px]",
    thumbOn: "left-[calc(100%-25px)]",
    pad: "pl-[8px] pr-[28px]",
    contentLeft: "left-[8px]",
    contentRight: "right-[8px]",
    icon: "text-sm [&_svg]:h-4 [&_svg]:w-4",
  },
} as const;

const intentTextMap: Record<string, string> = {
  primary: "text-primary-100",
  secondary: "text-secondary-100",
  danger: "text-danger-100",
  warning: "text-warning-100",
  success: "text-success-100",
};

export function Switch({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  checkedContent,
  uncheckedContent,
  intent,
  size,
  label,
  id: propId,
  className,
  disabled,
  ...props
}: SwitchProps) {
  const autoId = useId();
  const id = propId ?? autoId;
  const resolvedSize = size ?? "md";
  const resolvedIntent = intent ?? "primary";
  const s = sizeMap[resolvedSize];
  const hasContent = checkedContent != null || uncheckedContent != null;

  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = controlledChecked ?? internalChecked;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.checked;
      if (controlledChecked === undefined) setInternalChecked(next);
      onCheckedChange?.(next);
    },
    [controlledChecked, onCheckedChange],
  );

  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      <input
        {...props}
        id={id}
        type="checkbox"
        role="switch"
        className="sr-only"
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        aria-checked={isChecked}
      />

      {/* Track */}
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200",
          hasContent ? s.trackH : s.trackFixed,
          switchTrackVariants({ intent, size, checked: isChecked ? "on" : "off" }),
        )}
      >
        {hasContent ? (
          <>
            {/* Invisible measurer — determines track auto-width */}
            <span className={cn("pointer-events-none invisible inline-grid", s.icon)}>
              <span className={cn("[grid-area:1/1] whitespace-nowrap", s.pad)}>
                {checkedContent}
              </span>
              <span className={cn("[grid-area:1/1] whitespace-nowrap", s.pad)}>
                {uncheckedContent}
              </span>
            </span>

            {/* Checked content — absolutely positioned left */}
            <span
              className={cn(
                "absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-medium leading-none transition-opacity duration-200",
                s.contentLeft,
                s.icon,
                intentTextMap[resolvedIntent],
                isChecked ? "opacity-100" : "opacity-0",
              )}
            >
              {checkedContent}
            </span>

            {/* Unchecked content — absolutely positioned right */}
            <span
              className={cn(
                "absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-medium leading-none transition-opacity duration-200",
                s.contentRight,
                s.icon,
                "text-primary-400 dark:text-primary-500",
                isChecked ? "opacity-0" : "opacity-100",
              )}
            >
              {uncheckedContent}
            </span>
          </>
        ) : null}

        {/* Thumb — uses left + calc so it works for any track width */}
        <span
          className={cn(
            "pointer-events-none absolute rounded-full bg-white shadow-sm transition-[left] duration-200 ease-in-out",
            s.thumb,
            s.thumbTop,
            isChecked ? s.thumbOn : s.thumbOff,
          )}
        />
      </span>

      {label && (
        <span className="select-none text-sm text-primary-700 dark:text-primary-300">{label}</span>
      )}
    </label>
  );
}
