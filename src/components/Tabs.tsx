import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { tabListVariants, tabTriggerVariants } from "../styles/theme";

/* ── Context ──────────────────────────────────────────────── */

type TabsCtx = {
  activeValue: string;
  setActiveValue: (value: string) => void;
  intent: VariantProps<typeof tabListVariants>["intent"];
  registerTrigger: (value: string, el: HTMLButtonElement | null) => void;
};
const TabsContext = createContext<TabsCtx | null>(null);

/** When true, TabContent always renders (TabPanels handles visibility). */
const TabPanelsContext = createContext(false);

/* ── Tabs ─────────────────────────────────────────────────── */

type TabsProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  intent?: VariantProps<typeof tabListVariants>["intent"];
  children: React.ReactNode;
  className?: string;
};

export function Tabs({
  defaultValue = "",
  value,
  onValueChange,
  intent,
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeValue = value ?? internalValue;
  const triggersRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  const setActiveValue = useCallback(
    (v: string) => {
      if (onValueChange) {
        onValueChange(v);
      } else {
        setInternalValue(v);
      }
    },
    [onValueChange],
  );

  const registerTrigger = useCallback((val: string, el: HTMLButtonElement | null) => {
    if (el) {
      triggersRef.current.set(val, el);
    } else {
      triggersRef.current.delete(val);
    }
  }, []);

  return (
    <TabsContext.Provider value={{ activeValue, setActiveValue, intent, registerTrigger }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

/* ── TabList (with sliding indicator) ─────────────────────── */

export function TabList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = useContext(TabsContext);
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const updateIndicator = useCallback(() => {
    if (!ctx || !listRef.current) return;
    const triggers = listRef.current.querySelectorAll<HTMLButtonElement>(
      '[role="tab"][data-active="true"]',
    );
    const activeEl = triggers[0];
    if (!activeEl) {
      setIndicator(null);
      return;
    }
    const listRect = listRef.current.getBoundingClientRect();
    const btnRect = activeEl.getBoundingClientRect();
    setIndicator({ left: btnRect.left - listRect.left, width: btnRect.width });
  }, [ctx]);

  useLayoutEffect(updateIndicator, [ctx?.activeValue, updateIndicator]);

  // Recalculate on resize
  useEffect(() => {
    const ro = new ResizeObserver(updateIndicator);
    if (listRef.current) ro.observe(listRef.current);
    return () => ro.disconnect();
  }, [updateIndicator]);

  const intent = ctx?.intent ?? "line";
  const showIndicator = indicator && (intent === "line" || intent === "underline");

  return (
    <div
      ref={listRef}
      className={cn(tabListVariants({ intent: ctx?.intent }), "relative", className)}
      role="tablist"
      {...props}
    >
      {props.children}
      {showIndicator && (
        <span
          className="absolute bottom-0 h-0.5 rounded-full bg-primary-600 dark:bg-primary-400 transition-all duration-300 ease-in-out"
          style={{ left: indicator.left, width: indicator.width }}
          aria-hidden
        />
      )}
    </div>
  );
}

/* ── TabTrigger ───────────────────────────────────────────── */

type TabTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

export function TabTrigger({ value, className, children, ...props }: TabTriggerProps) {
  const ctx = useContext(TabsContext);
  const isActive = ctx?.activeValue === value;
  const refCb = useCallback(
    (el: HTMLButtonElement | null) => ctx?.registerTrigger(value, el),
    [ctx, value],
  );

  return (
    <button
      ref={refCb}
      className={cn(tabTriggerVariants({ intent: ctx?.intent }), className)}
      role="tab"
      data-active={isActive}
      aria-selected={isActive}
      onClick={() => ctx?.setActiveValue(value)}
      {...props}
    >
      {children}
    </button>
  );
}

/* ── TabPanels (sliding container) ────────────────────────── */

type TabPanelsProps = React.HTMLAttributes<HTMLDivElement>;

export function TabPanels({ className, children, ...props }: TabPanelsProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;

  const panels = React.Children.toArray(children).filter((c): c is React.ReactElement =>
    React.isValidElement(c),
  );

  const activeIndex = Math.max(
    0,
    panels.findIndex((c) => (c.props as { value?: string }).value === ctx.activeValue),
  );

  return (
    <div className={cn("overflow-hidden", className)} {...props}>
      <TabPanelsContext.Provider value={true}>
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {panels.map((panel, i) => (
            <div
              key={(panel.props as { value?: string }).value ?? i}
              className="w-full shrink-0"
              aria-hidden={i !== activeIndex}
            >
              {panel}
            </div>
          ))}
        </div>
      </TabPanelsContext.Provider>
    </div>
  );
}

/* ── TabContent ───────────────────────────────────────────── */

type TabContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

export function TabContent({ value, className, children, ...props }: TabContentProps) {
  const ctx = useContext(TabsContext);
  const insidePanels = useContext(TabPanelsContext);

  // Inside TabPanels: always render (container handles sliding)
  if (insidePanels) {
    return (
      <div className={cn("pt-4", className)} role="tabpanel" {...props}>
        {children}
      </div>
    );
  }

  // Standalone: conditional render (backward compatible)
  if (ctx?.activeValue !== value) return null;

  return (
    <div className={cn("pt-4", className)} role="tabpanel" {...props}>
      {children}
    </div>
  );
}
