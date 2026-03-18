import React, { createContext, useCallback, useContext, useState } from "react";
import { type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
import { accordionVariants } from "../styles/theme";

/* ── Context ──────────────────────────────────────────────── */

type AccordionCtx = {
  expandedItems: string[];
  toggleItem: (value: string) => void;
};
const AccordionContext = createContext<AccordionCtx | null>(null);

type AccordionItemCtx = { value: string; isExpanded: boolean };
const AccordionItemContext = createContext<AccordionItemCtx | null>(null);

/* ── Accordion ────────────────────────────────────────────── */

type AccordionProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof accordionVariants> & {
    type?: "single" | "multiple";
    defaultValue?: string[];
    value?: string[];
    onValueChange?: (value: string[]) => void;
  };

export function Accordion({
  type = "single",
  defaultValue = [],
  value,
  onValueChange,
  intent,
  className,
  children,
  ...props
}: AccordionProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const expandedItems = value ?? internalValue;

  const toggleItem = useCallback(
    (itemValue: string) => {
      const update = (prev: string[]) => {
        if (prev.includes(itemValue)) {
          return prev.filter((v) => v !== itemValue);
        }
        return type === "single" ? [itemValue] : [...prev, itemValue];
      };

      if (onValueChange) {
        onValueChange(update(expandedItems));
      } else {
        setInternalValue(update);
      }
    },
    [type, expandedItems, onValueChange],
  );

  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem }}>
      <div className={cn(accordionVariants({ intent }), className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

/* ── AccordionItem ────────────────────────────────────────── */

type AccordionItemProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const ctx = useContext(AccordionContext);
  const isExpanded = ctx?.expandedItems.includes(value) ?? false;

  return (
    <AccordionItemContext.Provider value={{ value, isExpanded }}>
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

/* ── AccordionTrigger ─────────────────────────────────────── */

type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  const ctx = useContext(AccordionContext);
  const itemCtx = useContext(AccordionItemContext);

  return (
    <button
      className={cn(
        "text-primary-800 hover:text-primary-600 dark:text-primary-100 dark:hover:text-primary-300 flex w-full cursor-pointer items-center justify-between gap-2 py-3 text-sm font-medium transition-colors [&>svg]:shrink-0",
        className,
      )}
      onClick={() => itemCtx && ctx?.toggleItem(itemCtx.value)}
      aria-expanded={itemCtx?.isExpanded ? "true" : "false"}
      {...props}
    >
      <span className="flex items-center gap-1.5 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0">
        {children}
      </span>
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          itemCtx?.isExpanded && "rotate-180",
        )}
      />
    </button>
  );
}

/* ── AccordionContent ─────────────────────────────────────── */

type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

export function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const itemCtx = useContext(AccordionItemContext);

  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-200 ease-out",
        itemCtx?.isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div className="overflow-hidden">
        <div
          className={cn("text-primary-500 dark:text-primary-400 pb-3 text-sm", className)}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
