import type { ChartSeries, AxisConfig } from "../types";
import { clampRange, computeTicks } from "../chart.utils";

export { computeMargins, computeDimensions } from "../LineChart/LineChart.logic";

/** Computes [min, max] domain from all x values of visible series. */
export function computeXDomain(
  series: ChartSeries[],
  visibleIds: Set<string>,
  axisConfig?: AxisConfig,
): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const s of series) {
    if (!visibleIds.has(s.id)) continue;
    for (const pt of s.data) {
      const v = Number(pt.x);
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  if (!isFinite(min)) return [0, 1];
  const [lo, hi] = clampRange(min, max);
  return [axisConfig?.min ?? lo, axisConfig?.max ?? hi];
}

/** Computes [min, max] domain from all y values of visible series. */
export function computeYDomain(
  series: ChartSeries[],
  visibleIds: Set<string>,
  axisConfig?: AxisConfig,
): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const s of series) {
    if (!visibleIds.has(s.id)) continue;
    for (const pt of s.data) {
      if (pt.y < min) min = pt.y;
      if (pt.y > max) max = pt.y;
    }
  }
  if (!isFinite(min)) return [0, 1];
  const [lo, hi] = clampRange(min, max);
  return [axisConfig?.min ?? lo, axisConfig?.max ?? hi];
}

/** Linear scale factory. */
export function createLinearScale(
  domain: [number, number],
  range: [number, number],
): (v: number) => number {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  if (d1 === d0) return () => (r0 + r1) / 2;
  return (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

export function computeTicksForAxis(domain: [number, number], count = 5): number[] {
  return computeTicks(domain[0], domain[1], count);
}

/** Deterministic jitter using golden-ratio Halton-like sequence. */
export function deterministicJitter(
  seriesIndex: number,
  pointIndex: number,
  amount: number,
): [number, number] {
  const phi = 1.618033988749895;
  const seed = seriesIndex * 137 + pointIndex;
  const x = ((seed * phi) % 1) * 2 - 1;
  const y = ((seed * phi * phi) % 1) * 2 - 1;
  return [x * amount, y * amount];
}

/** Compute bounding ellipse parameters for a set of points (cx, cy, rx, ry). */
export function computeBoundingEllipse(
  xs: number[],
  ys: number[],
  padding = 12,
): { cx: number; cy: number; rx: number; ry: number } | null {
  if (xs.length < 2) return null;
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return {
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
    rx: (maxX - minX) / 2 + padding,
    ry: (maxY - minY) / 2 + padding,
  };
}
