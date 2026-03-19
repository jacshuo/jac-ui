import React, { useId, useState, useCallback } from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import { checkboxVariants } from "../../../styles/theme/primitives";

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> &
  Omit<VariantProps<typeof checkboxVariants>, "checked"> & {
    /** Controlled checked state. */
    checked?: boolean;
    /** Default checked state (uncontrolled). */
    defaultChecked?: boolean;
    /** Indeterminate state — overrides the check icon with a dash. */
    indeterminate?: boolean;
    /** Callback when the checkbox is toggled. */
    onCheckedChange?: (checked: boolean) => void;
    /** Accessible label text shown beside the checkbox. */
    label?: string;
  };

const iconSize = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
} as const;

export function Checkbox({
  checked: controlledChecked,
  defaultChecked = false,
  indeterminate = false,
  onCheckedChange,
  intent,
  size,
  label,
  id: propId,
  className,
  disabled,
  ...props
}: CheckboxProps) {
  const autoId = useId();
  const id = propId ?? autoId;
  const resolvedSize = size ?? "md";

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

  const active = isChecked || indeterminate;

  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 select-none",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      <input
        {...props}
        id={id}
        type="checkbox"
        className="sr-only"
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
      />

      {/* Visual box */}
      <span
        className={cn(
          checkboxVariants({
            intent,
            size,
            checked: active ? "on" : "off",
          }),
        )}
      >
        {/* Check / dash icon */}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className={cn(
            "text-white transition-all duration-200",
            iconSize[resolvedSize],
            active ? "scale-100 opacity-100" : "scale-0 opacity-0",
          )}
        >
          {indeterminate ? (
            <line
              x1="3"
              y1="8"
              x2="13"
              y2="8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M3.5 8.5L6.5 11.5L12.5 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </span>

      {label && <span className="text-sm text-primary-700 dark:text-primary-300">{label}</span>}
    </label>
  );
}
