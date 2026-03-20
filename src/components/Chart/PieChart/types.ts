import type { BaseChartProps, PieSlice } from "../types";

export interface PieChartProps extends BaseChartProps {
  data: PieSlice[];
  /** Render as a donut chart with an inner hole. */
  donut?: boolean;
  /** Inner radius ratio (0–1, donut mode only). */
  donutThickness?: number;
  /** Starting angle in degrees (default: -90 = top). */
  startAngle?: number;
  /** Gap between slices in degrees (default 0 = touching). */
  padAngle?: number;
  /** Controls label content. */
  labelType?: "none" | "percent" | "value" | "label" | "label+percent";
  /** Text rendered in the center hole (donut mode only). */
  centerLabel?: string;
  /** Secondary text rendered below centerLabel (donut mode only). */
  centerSubLabel?: string;
  /** Slice pops outward when hovered. */
  explodeOnHover?: boolean;
  /** Outward offset in px for the exploded slice. */
  explodeOffset?: number;
}
