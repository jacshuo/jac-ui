import type { BaseChartProps, ChartSeries, AxisConfig } from "../types";

export interface LineChartProps extends BaseChartProps {
  series: ChartSeries[];
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  y2Axis?: AxisConfig;
  /** Series IDs that map to the secondary (right) Y axis. */
  y2Series?: string[];
  /** Render smooth bezier curves instead of straight polylines. */
  smooth?: boolean;
  /** Show data point dot markers. */
  showDots?: boolean;
  /** Fill area under each line. */
  area?: boolean;
  /** Line stroke width in px. */
  strokeWidth?: number;
}
