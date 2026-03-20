// Core data point for XY charts (Line, Bar, Scatter)
export interface ChartDataPoint {
  x: number | string;
  y: number;
  label?: string;
}

// A named dataset / series
export interface ChartSeries {
  id: string;
  name: string;
  color?: string;
  data: ChartDataPoint[];
}

// Pie chart slice
export interface PieSlice {
  id: string;
  label: string;
  value: number;
  color?: string;
}

// Axis configuration
export interface AxisConfig {
  label?: string;
  min?: number;
  max?: number;
  tickCount?: number;
  format?: (value: number | string) => string;
  gridLines?: boolean;
}

// Legend item (derived at runtime)
export interface LegendItem {
  id: string;
  label: string;
  color: string;
  visible: boolean;
}

// Common props shared by all chart components
export interface BaseChartProps {
  title?: string;
  height?: number;
  className?: string;
  legend?: boolean;
  legendPosition?: "top" | "bottom" | "left" | "right";
  animateOnMount?: boolean;
  emptyText?: string;
}
