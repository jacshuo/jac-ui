import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import { selectVariants } from "../../../styles/theme/primitives";
import "./Select.css";

/* ── Types ────────────────────────────────────────────── */

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = VariantProps<typeof selectVariants> & {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  /** Accessible label. Prefer using `<label>` + `id`. */
  "aria-label"?: string;
  id?: string;
  className?: string;
};

/* ── Context (for portaled list) ─────────────────────── */

type SelectCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  value: string;
  onSelect: (v: string) => void;
};
const SelectCtx = createContext<SelectCtx | null>(null);

/* ── Select ───────────────────────────────────────────── */

export function Select({
  options,
  value: valueProp,
  defaultValue = "",
  onChange,
  placeholder = "Select an option…",
  disabled,
  clearable = false,
  intent,
  size,
  className,
  id: idProp,
  "aria-label": ariaLabel,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp! : internal;

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const defaultId = useId();
  const id = idProp ?? defaultId;

  const selectedOption = options.find((o) => o.value === value);

  const onSelect = useCallback(
    (v: string) => {
      if (!controlled) setInternal(v);
      onChange?.(v);
      setOpen(false);
    },
    [controlled, onChange],
  );

  const onClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!controlled) setInternal("");
      onChange?.("");
    },
    [controlled, onChange],
  );

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    function listener(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [open]);

  /* Keyboard navigation */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const enabledOpts = options.filter((o) => !o.disabled);
    const currentIdx = enabledOpts.findIndex((o) => o.value === value);

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        setOpen((v) => !v);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!open) setOpen(true);
        else {
          const next = enabledOpts[(currentIdx + 1) % enabledOpts.length];
          onSelect(next.value);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) setOpen(true);
        else {
          const prev = enabledOpts[(currentIdx - 1 + enabledOpts.length) % enabledOpts.length];
          onSelect(prev.value);
        }
        break;
    }
  };

  return (
    <div ref={rootRef} className={cn("select-root relative", className)}>
      {/* Trigger */}
      <div
        id={id}
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        className={cn(
          selectVariants({ intent, size }),
          "flex cursor-pointer items-center gap-2 pr-8",
          open && "border-primary-500 ring-2 ring-primary-500/20 dark:border-primary-400",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <span className={cn("flex-1 truncate", !selectedOption && "text-secondary-400")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          {clearable && value && (
            <button
              type="button"
              tabIndex={-1}
              onClick={onClear}
              aria-label="Clear selection"
              className="rounded p-0.5 text-secondary-400 hover:text-primary-600 dark:hover:text-primary-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-secondary-400 transition-transform duration-200",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </span>
      </div>

      {/* Dropdown list */}
      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={ariaLabel ?? "Options"}
          className={cn(
            "select-list absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md",
            "border border-primary-200 bg-white py-1 shadow-lg outline-none",
            "dark:border-primary-700 dark:bg-primary-900",
          )}
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              aria-disabled={opt.disabled}
              onClick={() => !opt.disabled && onSelect(opt.value)}
              className={cn(
                "select-option flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                opt.value === value
                  ? "bg-primary-100 font-medium text-primary-900 dark:bg-primary-800 dark:text-primary-50"
                  : "text-primary-700 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-800/60",
                opt.disabled && "pointer-events-none opacity-40",
              )}
            >
              <span className="flex-1">{opt.label}</span>
              {opt.value === value && <Check className="h-3.5 w-3.5 text-primary-500" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
