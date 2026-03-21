import React from "react";
import { type VariantProps } from "class-variance-authority";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "../../../lib/utils";
import { statVariants } from "../../../styles/theme/data-display";

export type StatTrend = "up" | "down" | "neutral";

export interface StatProps extends VariantProps<typeof statVariants> {
  /** Main metric label */
  title: string;
  /** Primary value to display */
  value: React.ReactNode;
  /** Prefix string/element before value */
  prefix?: React.ReactNode;
  /** Suffix string/element after value */
  suffix?: React.ReactNode;
  /** Icon element displayed in the card */
  icon?: React.ReactNode;
  /** Trend direction */
  trend?: StatTrend;
  /** Trend percentage or label */
  trendValue?: string;
  /** Description below the value */
  description?: string;
  className?: string;
}

const trendIcons: Record<StatTrend, typeof TrendingUp> = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const trendColors: Record<StatTrend, string> = {
  up: "text-success-600 dark:text-success-400",
  down: "text-danger-600 dark:text-danger-400",
  neutral: "text-secondary-500 dark:text-secondary-400",
};

export function Stat({
  title,
  value,
  prefix,
  suffix,
  icon,
  trend,
  trendValue,
  description,
  intent,
  size,
  className,
}: StatProps) {
  const TrendIcon = trend ? trendIcons[trend] : null;
  const trendColor = trend ? trendColors[trend] : "";

  return (
    <div className={cn(statVariants({ intent, size }), className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium tracking-wider uppercase text-secondary-500 dark:text-secondary-400">
            {title}
          </p>
          <p className="mt-1 flex items-baseline gap-1 text-2xl font-bold text-primary-900 dark:text-primary-50">
            {prefix && (
              <span className="text-base font-semibold text-secondary-500 dark:text-secondary-400">
                {prefix}
              </span>
            )}
            <span>{value}</span>
            {suffix && (
              <span className="text-base font-semibold text-secondary-500 dark:text-secondary-400">
                {suffix}
              </span>
            )}
          </p>
          {(trend || description) && (
            <div className="mt-2 flex items-center gap-2">
              {trend && TrendIcon && (
                <span className={cn("flex items-center gap-0.5 text-xs font-semibold", trendColor)}>
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
        {icon && (
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl [&_svg]:h-5 [&_svg]:w-5",
              intent === "success" &&
                "bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400",
              intent === "danger" &&
                "bg-danger-100 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400",
              intent === "warning" &&
                "bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400",
              (!intent || intent === "primary") &&
                "bg-primary-100 text-primary-600 dark:bg-primary-800 dark:text-primary-400",
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
