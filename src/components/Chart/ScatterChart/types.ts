import type { BaseChartProps, ChartSeries, AxisConfig } from "../types";

export interface ScatterChartProps extends BaseChartProps {
  series: ChartSeries[];
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  /** Dot radius in px. */
  dotRadius?: number;
  /** Dot fill opacity. */
  dotOpacity?: number;
  /** Draw a faint bounding ellipse around each series' points. */
  clusters?: boolean;
  /** Not used in simplified implementation (kept for API compat). */
  clusterRadius?: number;
  /** Apply deterministic small random offset to reduce overlap. */
  jitter?: boolean;
  /** Jitter range in px. */
  jitterAmount?: number;
  /** Draw polylines connecting same-series points in x-order. */
  linkedLines?: boolean;
}
