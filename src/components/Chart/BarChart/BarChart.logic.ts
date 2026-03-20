import type { ChartSeries, AxisConfig } from "../types";
import { clampRange, computeTicks } from "../chart.utils";
import { computeMargins, computeDimensions } from "../LineChart/LineChart.logic";
export { computeMargins, computeDimensions };

/** Extracts sorted unique category labels from all visible series. */
export function computeCategories(series: ChartSeries[], visibleIds: Set<string>): string[] {
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

/** Computes [min, max] domain for grouped bar charts (always min=0 for bars). */
export function computeBarYDomain(
  series: ChartSeries[],
  visibleIds: Set<string>,
  grouped: boolean,
  axisConfig?: AxisConfig,
): [number, number] {
  if (grouped) {
    let max = 0;
    for (const s of series) {
      if (!visibleIds.has(s.id)) continue;
      for (const pt of s.data) {
        if (pt.y > max) max = pt.y;
      }
    }
    if (max === 0) max = 1;
    const [, hi] = clampRange(0, max, 0.05);
    return [axisConfig?.min ?? 0, axisConfig?.max ?? hi];
  } else {
    // Stacked: sum values per category
    const categoryTotals = new Map<string, number>();
    for (const s of series) {
      if (!visibleIds.has(s.id)) continue;
      for (const pt of s.data) {
        const k = String(pt.x);
        categoryTotals.set(k, (categoryTotals.get(k) ?? 0) + pt.y);
      }
    }
    const max = Math.max(0, ...categoryTotals.values());
    const [, hi] = clampRange(0, max === 0 ? 1 : max, 0.05);
    return [axisConfig?.min ?? 0, axisConfig?.max ?? hi];
  }
}

/** Linear scale helper. */
export function createLinearScale(
  domain: [number, number],
  range: [number, number],
): (v: number) => number {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  if (d1 === d0) return () => (r0 + r1) / 2;
  return (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

/** Returns evenly spaced ticks. */
export function computeTicksForAxis(domain: [number, number], count = 5): number[] {
  return computeTicks(domain[0], domain[1], count);
}

export interface BarSpec {
  seriesId: string;
  category: string;
  x: number;
  y: number;
  width: number;
  height: number;
  stackBase: number;
  value: number;
  color: string;
}

/** Builds grouped bar specs for vertical orientation. */
export function buildGroupedBarSpecs(
  series: ChartSeries[],
  visibleIds: Set<string>,
  categories: string[],
  colorMap: Map<string, string>,
  plotLeft: number,
  plotWidth: number,
  plotBottom: number,
  plotTop: number,
  yScale: (v: number) => number,
  groupPadding: number,
  barPadding: number,
): BarSpec[] {
  const visibleSeries = series.filter((s) => visibleIds.has(s.id));
  const numGroups = categories.length;
  const numSeries = visibleSeries.length;
  if (numGroups === 0 || numSeries === 0) return [];

  const groupWidth = plotWidth / numGroups;
  const innerGroupWidth = groupWidth * (1 - groupPadding);
  const barWidth = numSeries > 0 ? (innerGroupWidth * (1 - barPadding)) / numSeries : 0;
  const specs: BarSpec[] = [];

  for (let gi = 0; gi < categories.length; gi++) {
    const cat = categories[gi];
    const groupLeft = plotLeft + gi * groupWidth + (groupWidth - innerGroupWidth) / 2;
    for (let si = 0; si < visibleSeries.length; si++) {
      const s = visibleSeries[si];
      const pt = s.data.find((d) => String(d.x) === cat);
      if (!pt) continue;
      const barLeft = groupLeft + si * (barWidth + (innerGroupWidth * barPadding) / numSeries);
      const yTop = yScale(pt.y);
      specs.push({
        seriesId: s.id,
        category: cat,
        x: barLeft,
        y: yTop,
        width: Math.max(barWidth, 1),
        height: Math.max(plotBottom - yTop, 0),
        stackBase: plotBottom,
        value: pt.y,
        color: colorMap.get(s.id) ?? "var(--color-chart-1)",
      });
    }
  }
  return specs;
}

/** Builds grouped bar specs for horizontal orientation (bars extend right from Y-axis). */
export function buildGroupedHorizontalBarSpecs(
  series: ChartSeries[],
  visibleIds: Set<string>,
  categories: string[],
  colorMap: Map<string, string>,
  plotLeft: number,
  plotTop: number,
  plotHeight: number,
  xScale: (v: number) => number,
  groupPadding: number,
  barPadding: number,
): BarSpec[] {
  const visibleSeries = series.filter((s) => visibleIds.has(s.id));
  const numGroups = categories.length;
  const numSeries = visibleSeries.length;
  if (numGroups === 0 || numSeries === 0) return [];

  const groupHeight = plotHeight / numGroups;
  const innerGroupHeight = groupHeight * (1 - groupPadding);
  const barH = numSeries > 0 ? (innerGroupHeight * (1 - barPadding)) / numSeries : 0;
  const specs: BarSpec[] = [];

  for (let gi = 0; gi < categories.length; gi++) {
    const cat = categories[gi];
    const groupTop = plotTop + gi * groupHeight + (groupHeight - innerGroupHeight) / 2;
    for (let si = 0; si < visibleSeries.length; si++) {
      const s = visibleSeries[si];
      const pt = s.data.find((d) => String(d.x) === cat);
      if (!pt) continue;
      const barTop =
        groupTop + si * (barH + (innerGroupHeight * barPadding) / Math.max(numSeries, 1));
      const xRight = xScale(pt.y);
      specs.push({
        seriesId: s.id,
        category: cat,
        x: plotLeft,
        y: barTop,
        width: Math.max(xRight - plotLeft, 0),
        height: Math.max(barH, 1),
        stackBase: plotLeft,
        value: pt.y,
        color: colorMap.get(s.id) ?? "var(--color-chart-1)",
      });
    }
  }
  return specs;
}

/** Builds stacked bar specs for horizontal orientation. */
export function buildStackedHorizontalBarSpecs(
  series: ChartSeries[],
  visibleIds: Set<string>,
  categories: string[],
  colorMap: Map<string, string>,
  plotLeft: number,
  plotTop: number,
  plotHeight: number,
  xScale: (v: number) => number,
  groupPadding: number,
): BarSpec[] {
  const visibleSeries = series.filter((s) => visibleIds.has(s.id));
  const numGroups = categories.length;
  if (numGroups === 0) return [];

  const barH = (plotHeight / numGroups) * (1 - groupPadding);
  const specs: BarSpec[] = [];
  const stackRights = new Map<string, number>();
  categories.forEach((c) => stackRights.set(c, plotLeft));

  for (const s of visibleSeries) {
    for (const cat of categories) {
      const pt = s.data.find((d) => String(d.x) === cat);
      if (!pt) continue;
      const currentBase = stackRights.get(cat) ?? plotLeft;
      const barWidth = Math.max(xScale(pt.y) - plotLeft, 0);
      const gi = categories.indexOf(cat);
      const groupCenter = plotTop + (gi + 0.5) * (plotHeight / numGroups);
      specs.push({
        seriesId: s.id,
        category: cat,
        x: currentBase,
        y: groupCenter - barH / 2,
        width: barWidth,
        height: Math.max(barH, 1),
        stackBase: currentBase,
        value: pt.y,
        color: colorMap.get(s.id) ?? "var(--color-chart-1)",
      });
      stackRights.set(cat, currentBase + barWidth);
    }
  }
  return specs;
}

/** Builds stacked bar specs for vertical orientation. */
export function buildStackedBarSpecs(
  series: ChartSeries[],
  visibleIds: Set<string>,
  categories: string[],
  colorMap: Map<string, string>,
  plotLeft: number,
  plotWidth: number,
  plotBottom: number,
  yScale: (v: number) => number,
  groupPadding: number,
): BarSpec[] {
  const visibleSeries = series.filter((s) => visibleIds.has(s.id));
  const numGroups = categories.length;
  if (numGroups === 0) return [];

  const barWidth = (plotWidth / numGroups) * (1 - groupPadding);
  const specs: BarSpec[] = [];
  const stackTops = new Map<string, number>();
  categories.forEach((c) => stackTops.set(c, plotBottom));

  for (const s of visibleSeries) {
    for (const cat of categories) {
      const pt = s.data.find((d) => String(d.x) === cat);
      if (!pt) continue;
      const currentBase = stackTops.get(cat) ?? plotBottom;
      const barHeight = Math.max(plotBottom - yScale(pt.y), 0);
      const newTop = currentBase - barHeight;
      const gi = categories.indexOf(cat);
      const groupCenter = plotLeft + (gi + 0.5) * (plotWidth / numGroups);
      specs.push({
        seriesId: s.id,
        category: cat,
        x: groupCenter - barWidth / 2,
        y: newTop,
        width: Math.max(barWidth, 1),
        height: barHeight,
        stackBase: currentBase,
        value: pt.y,
        color: colorMap.get(s.id) ?? "var(--color-chart-1)",
      });
      stackTops.set(cat, newTop);
    }
  }
  return specs;
}
