import React, { useId, useState, useCallback, createContext, useContext } from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { radioVariants } from "../styles/theme";

/* ── RadioGroup context ────────────────────────────── */

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
  intent?: VariantProps<typeof radioVariants>["intent"];
  size?: VariantProps<typeof radioVariants>["size"];
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/* ── RadioGroup ────────────────────────────────────── */

export interface RadioGroupProps {
  /** Form field name shared by all radios. */
  name?: string;
  /** Controlled selected value. */
  value?: string;
  /** Default selected value (uncontrolled). */
  defaultValue?: string;
  /** Callback when selection changes. */
  onValueChange?: (value: string) => void;
  /** Shared intent for all child radios. */
  intent?: VariantProps<typeof radioVariants>["intent"];
  /** Shared size for all child radios. */
  size?: VariantProps<typeof radioVariants>["size"];
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function RadioGroup({
  name: nameProp,
  value: controlledValue,
  defaultValue,
  onValueChange,
  intent,
  size,
  disabled,
  className,
  children,
}: RadioGroupProps) {
  const autoName = useId();
  const name = nameProp ?? autoName;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;

  const onChange = useCallback(
    (v: string) => {
      if (controlledValue === undefined) setInternalValue(v);
      onValueChange?.(v);
    },
    [controlledValue, onValueChange],
  );

  return (
    <RadioGroupContext.Provider value={{ name, value, onChange, intent, size, disabled }}>
      <div role="radiogroup" className={cn("flex flex-col gap-2", className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

/* ── Radio ─────────────────────────────────────────── */

export type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> &
  Omit<VariantProps<typeof radioVariants>, "checked"> & {
    /** The value of this radio option. */
    value: string;
    /** Accessible label text shown beside the radio. */
    label?: string;
  };

const dotSize = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-2.5 w-2.5",
} as const;

export function Radio({
  value,
  intent: intentProp,
  size: sizeProp,
  label,
  id: propId,
  className,
  disabled: disabledProp,
  ...props
}: RadioProps) {
  const autoId = useId();
  const id = propId ?? autoId;
  const group = useContext(RadioGroupContext);

  const intent = intentProp ?? group?.intent;
  const size = sizeProp ?? group?.size;
  const resolvedSize = size ?? "md";
  const disabled = disabledProp ?? group?.disabled;
  const name = props.name ?? group?.name;

  const isChecked = group ? group.value === value : undefined;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) group?.onChange(value);
    },
    [group, value],
  );

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
        type="radio"
        name={name}
        value={value}
        className="sr-only"
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
      />

      {/* Visual circle */}
      <span
        className={cn(
          radioVariants({
            intent,
            size,
            checked: isChecked ? "on" : "off",
          }),
        )}
      >
        {/* Inner dot */}
        <span
          className={cn(
            "rounded-full bg-white transition-all duration-200",
            dotSize[resolvedSize],
            isChecked ? "scale-100 opacity-100" : "scale-0 opacity-0",
          )}
        />
      </span>

      {label && <span className="text-sm text-primary-700 dark:text-primary-300">{label}</span>}
    </label>
  );
}
