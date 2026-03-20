import type { ChartDataPoint, ChartSeries, AxisConfig } from "../types";
import { clampRange, computeTicks } from "../chart.utils";

export interface ChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ChartDimensions {
  width: number;
  height: number;
  margins: ChartMargins;
  plotLeft: number;
  plotTop: number;
  plotRight: number;
  plotBottom: number;
  plotWidth: number;
  plotHeight: number;
}

export function computeMargins(
  hasXLabel: boolean,
  hasYLabel: boolean,
  hasY2Axis: boolean,
): ChartMargins {
  return {
    top: 20,
    right: hasY2Axis ? 65 : 20,
    bottom: hasXLabel ? 52 : 36,
    left: hasYLabel ? 65 : 52,
  };
}

export function computeDimensions(
  containerWidth: number,
  height: number,
  margins: ChartMargins,
): ChartDimensions {
  const width = Math.max(containerWidth, 120);
  return {
    width,
    height,
    margins,
    plotLeft: margins.left,
    plotTop: margins.top,
    plotRight: width - margins.right,
    plotBottom: height - margins.bottom,
    plotWidth: Math.max(width - margins.left - margins.right, 10),
    plotHeight: Math.max(height - margins.top - margins.bottom, 10),
  };
}

/** Returns unique x category labels in order of first occurrence across visible series. */
export function computeXCategories(series: ChartSeries[], visibleIds: Set<string>): string[] {
  const seen = new Set<string>();
  const cats: string[] = [];
  for (const s of series) {
    if (!visibleIds.has(s.id)) continue;
    for (const pt of s.data) {
      const k = String(pt.x);
      if (!seen.has(k)) {
        seen.add(k);
        cats.push(k);
      }
    }
  }
  return cats;
}

/** Computes the [min, max] domain for Y values across all visible series. */
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

/** Creates a linear scale mapping domain values to pixel range. */
export function createLinearScale(
  domain: [number, number],
  range: [number, number],
): (v: number) => number {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  if (d1 === d0) return () => (r0 + r1) / 2;
  return (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

/** Creates a categorical band scale (returns center-of-band x). */
export function createCategoryScale(
  categories: string[],
  range: [number, number],
): (cat: string) => number {
  const n = categories.length;
  if (n === 0) return () => (range[0] + range[1]) / 2;
  const step = (range[1] - range[0]) / n;
  return (cat) => {
    const idx = categories.indexOf(cat);
    if (idx < 0) return (range[0] + range[1]) / 2;
    return range[0] + idx * step + step / 2;
  };
}

/** Builds a space-separated points string for SVG <polyline>. */
export function buildPolylinePoints(
  data: ChartDataPoint[],
  xScale: (v: number | string) => number,
  yScale: (v: number) => number,
): string {
  return data.map((pt) => `${xScale(pt.x).toFixed(2)},${yScale(pt.y).toFixed(2)}`).join(" ");
}

/** Builds a smooth path using Catmull-Rom → cubic Bézier conversion.
 *  Control points are derived from neighboring points so each segment's
 *  curvature naturally follows the data trend instead of a fixed pattern. */
export function buildSmoothPath(
  data: ChartDataPoint[],
  xScale: (v: number | string) => number,
  yScale: (v: number) => number,
): string {
  if (data.length === 0) return "";
  const pts = data.map((pt) => ({ x: xScale(pt.x), y: yScale(pt.y) }));
  if (pts.length === 1) return `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;

  // Tension α controls curvature tightness (0 = straight, 1 = full Catmull-Rom)
  const α = 0.5;

  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;

  for (let i = 0; i < pts.length - 1; i++) {
    // Virtual phantom points at the boundaries (reflect first/last segment)
    const p0 = i === 0 ? { x: 2 * pts[0].x - pts[1].x, y: 2 * pts[0].y - pts[1].y } : pts[i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 =
      i + 2 < pts.length
        ? pts[i + 2]
        : {
            x: 2 * pts[pts.length - 1].x - pts[pts.length - 2].x,
            y: 2 * pts[pts.length - 1].y - pts[pts.length - 2].y,
          };

    // Catmull-Rom control points converted to cubic Bézier
    const cp1x = p1.x + ((p2.x - p0.x) * α) / 3;
    const cp1y = p1.y + ((p2.y - p0.y) * α) / 3;
    const cp2x = p2.x - ((p3.x - p1.x) * α) / 3;
    const cp2y = p2.y - ((p3.y - p1.y) * α) / 3;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

/** Builds an area fill SVG path that closes down to the given baseline y. */
export function buildAreaPath(
  data: ChartDataPoint[],
  xScale: (v: number | string) => number,
  yScale: (v: number) => number,
  smooth: boolean,
  baseline: number,
): string {
  if (data.length === 0) return "";
  const linePart = smooth
    ? buildSmoothPath(data, xScale, yScale)
    : `M ${data.map((pt) => `${xScale(pt.x).toFixed(2)},${yScale(pt.y).toFixed(2)}`).join(" L ")}`;
  const lastX = xScale(data[data.length - 1].x).toFixed(2);
  const firstX = xScale(data[0].x).toFixed(2);
  return `${linePart} L ${lastX},${baseline.toFixed(2)} L ${firstX},${baseline.toFixed(2)} Z`;
}

/** Returns evenly spaced ticks for an axis domain. */
export function computeTicksForAxis(domain: [number, number], count = 5): number[] {
  return computeTicks(domain[0], domain[1], count);
}

/** Finds the index of the nearest category to a given SVG x position. */
export function findNearestCategoryIndex(
  svgX: number,
  categories: string[],
  xScale: (cat: string) => number,
): number {
  if (categories.length === 0) return -1;
  let minDist = Infinity;
  let minIdx = 0;
  for (let i = 0; i < categories.length; i++) {
    const d = Math.abs(xScale(categories[i]) - svgX);
    if (d < minDist) {
      minDist = d;
      minIdx = i;
    }
  }
  return minIdx;
}

/** Gets the y value for a series at a given category key. */
export function getYAtCategory(series: ChartSeries, category: string): number | undefined {
  return series.data.find((pt) => String(pt.x) === category)?.y;
}

/** Returns true if any data point in the series has a string x value. */
export function isSeriesCategorical(series: ChartSeries[]): boolean {
  for (const s of series) {
    for (const pt of s.data) {
      if (typeof pt.x === "string") return true;
    }
  }
  return false;
}
