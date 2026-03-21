import React, { useEffect, useRef, useState } from "react";
import { type VariantProps } from "class-variance-authority";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "../../../lib/utils";
import { metricCardVariants } from "../../../styles/theme/data-display";

export type MetricCardTrend = "up" | "down" | "neutral";

export interface MetricCardProps extends VariantProps<typeof metricCardVariants> {
  title: string;
  /** Numeric value to animate to */
  value: number;
  /** Number of decimal places */
  decimals?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  icon?: React.ReactNode;
  trend?: MetricCardTrend;
  trendValue?: string;
  /** Secondary info line */
  description?: string;
  /** Duration of counter animation in ms */
  animateDuration?: number;
  /** Custom formatter for displayed value */
  formatter?: (v: number) => string;
  /** Starting value for animation */
  from?: number;
  className?: string;
}

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function useCountUp(
  target: number,
  from: number,
  duration: number,
  decimals: number,
  formatter?: (v: number) => string,
) {
  const [display, setDisplay] = useState(() =>
    formatter ? formatter(from) : from.toFixed(decimals),
  );
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    startRef.current = null;

    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const current = from + (target - from) * eased;
      setDisplay(formatter ? formatter(current) : current.toFixed(decimals));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [target, from, duration, decimals, formatter]);

  return display;
}

const trendIcons = { up: TrendingUp, down: TrendingDown, neutral: Minus } as const;

const trendColors: Record<MetricCardTrend, string> = {
  up: "text-success-600 dark:text-success-400",
  down: "text-danger-600 dark:text-danger-400",
  neutral: "text-secondary-500 dark:text-secondary-400",
};

const iconBg: Record<string, string> = {
  primary: "bg-primary-100 text-primary-600 dark:bg-primary-800/60 dark:text-primary-300",
  success: "bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400",
  danger: "bg-danger-100 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400",
  warning: "bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400",
};

export function MetricCard({
  title,
  value,
  decimals = 0,
  prefix,
  suffix,
  icon,
  trend,
  trendValue,
  description,
  animateDuration = 1200,
  formatter,
  from = 0,
  intent,
  size,
  className,
}: MetricCardProps) {
  const displayValue = useCountUp(value, from, animateDuration, decimals, formatter);
  const TrendIcon = trend ? trendIcons[trend] : null;
  const trendColor = trend ? trendColors[trend] : "";

  return (
    <div className={cn(metricCardVariants({ intent, size }), className)}>
      {/* Decorative gradient accent */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-0.5 rounded-t-xl",
          intent === "success" && "bg-gradient-to-r from-success-400 to-success-600",
          intent === "danger" && "bg-gradient-to-r from-danger-400 to-danger-600",
          intent === "warning" && "bg-gradient-to-r from-warning-400 to-warning-600",
          (!intent || intent === "primary") && "bg-gradient-to-r from-primary-400 to-primary-600",
        )}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-widest uppercase text-secondary-500 dark:text-secondary-400">
            {title}
          </p>
          <p className="mt-2 flex items-baseline gap-1">
            {prefix && (
              <span className="text-lg font-semibold text-secondary-400 dark:text-secondary-500">
                {prefix}
              </span>
            )}
            <span className="font-mono text-3xl font-bold tabular-nums text-primary-900 dark:text-primary-50">
              {displayValue}
            </span>
            {suffix && (
              <span className="text-lg font-semibold text-secondary-400 dark:text-secondary-500">
                {suffix}
              </span>
            )}
          </p>
        </div>

        {icon && (
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl [&_svg]:h-6 [&_svg]:w-6",
              iconBg[intent ?? "primary"] ?? iconBg.primary,
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {(trend || description) && (
        <div className="mt-3 flex items-center gap-2 border-t border-primary-100 pt-3 dark:border-primary-700/50">
          {trend && TrendIcon && (
            <span className={cn("flex items-center gap-0.5 text-xs font-bold", trendColor)}>
              <TrendIcon className="h-3.5 w-3.5" />
              {trendValue}
            </span>
          )}
          {description && (
            <span className="text-xs text-secondary-500 dark:text-secondary-400">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
