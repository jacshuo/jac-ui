import type { BaseChartProps, ChartSeries, AxisConfig } from "../types";

export interface BarChartProps extends BaseChartProps {
  series: ChartSeries[];
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  y2Axis?: AxisConfig;
  /** Series IDs that map to the secondary (right) Y axis. */
  y2Series?: string[];
  /** "vertical" = X categorical, Y numerical (default). "horizontal" = flipped. */
  orientation?: "vertical" | "horizontal";
  /** true = bars side-by-side per category (default). false = stacked. */
  grouped?: boolean;
  /** Corner radius for bar caps in px. */
  barRadius?: number;
  /** Gap between individual bars within a group (0–1). */
  barPadding?: number;
  /** Gap between category groups (0–1). */
  groupPadding?: number;
}
