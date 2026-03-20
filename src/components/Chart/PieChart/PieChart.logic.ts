import type { PieSlice } from "../types";
import { polarToCartesian } from "../chart.utils";

export interface SliceSpec {
  id: string;
  label: string;
  value: number;
  percent: number;
  color: string;
  startAngle: number;
  endAngle: number;
  midAngle: number;
  path: string;
  outerR: number;
  innerR: number;
  cx: number;
  cy: number;
}

export function computeSliceSpecs(
  data: PieSlice[],
  visibleIds: Set<string>,
  palette: string[],
  outerR: number,
  innerR: number,
  cx: number,
  cy: number,
  startAngle: number,
  padAngle: number,
): SliceSpec[] {
  const visible = data.filter((s) => visibleIds.has(s.id));
  const total = visible.reduce((acc, s) => acc + s.value, 0);
  if (total === 0) return [];

  const paletteMap = new Map(data.map((s, i) => [s.id, s.color ?? palette[i % palette.length]]));
  const specs: SliceSpec[] = [];
  let currentAngle = startAngle;

  for (const slice of visible) {
    const sliceAngle = (slice.value / total) * 360;
    const halfPad = padAngle / 2;
    const sa = currentAngle + halfPad;
    const ea = currentAngle + sliceAngle - halfPad;
    const mid = (sa + ea) / 2;

    let path: string;
    if (Math.abs(ea - sa) >= 359.9) {
      // Full circle (single slice) — draw as two arcs
      const top = polarToCartesian(cx, cy, outerR, sa);
      const bot = polarToCartesian(cx, cy, outerR, sa + 180);
      path =
        `M ${top.x.toFixed(3)} ${top.y.toFixed(3)} ` +
        `A ${outerR} ${outerR} 0 1 1 ${bot.x.toFixed(3)} ${bot.y.toFixed(3)} ` +
        `A ${outerR} ${outerR} 0 1 1 ${top.x.toFixed(3)} ${top.y.toFixed(3)} Z`;
    } else if (innerR > 0) {
      // Donut arc
      const outerStart = polarToCartesian(cx, cy, outerR, sa);
      const outerEnd = polarToCartesian(cx, cy, outerR, ea);
      const innerEnd = polarToCartesian(cx, cy, innerR, ea);
      const innerStart = polarToCartesian(cx, cy, innerR, sa);
      const largeArc = ea - sa > 180 ? 1 : 0;
      path =
        `M ${outerStart.x.toFixed(3)} ${outerStart.y.toFixed(3)} ` +
        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x.toFixed(3)} ${outerEnd.y.toFixed(3)} ` +
        `L ${innerEnd.x.toFixed(3)} ${innerEnd.y.toFixed(3)} ` +
        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x.toFixed(3)} ${innerStart.y.toFixed(3)} Z`;
    } else {
      // Regular pie slice: center → arc start → arc → close back to center
      const arcStart = polarToCartesian(cx, cy, outerR, sa);
      const arcEnd = polarToCartesian(cx, cy, outerR, ea);
      const largeArc = ea - sa > 180 ? 1 : 0;
      path =
        `M ${cx.toFixed(3)} ${cy.toFixed(3)} ` +
        `L ${arcStart.x.toFixed(3)} ${arcStart.y.toFixed(3)} ` +
        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${arcEnd.x.toFixed(3)} ${arcEnd.y.toFixed(3)} Z`;
    }

    specs.push({
      id: slice.id,
      label: slice.label,
      value: slice.value,
      percent: Math.round((slice.value / total) * 1000) / 10,
      color: paletteMap.get(slice.id) ?? "var(--color-chart-1)",
      startAngle: sa,
      endAngle: ea,
      midAngle: mid,
      path,
      outerR,
      innerR,
      cx,
      cy,
    });
    currentAngle += sliceAngle;
  }
  return specs;
}

/** Returns the translate offset (dx, dy) for a slice explosion at midAngle. */
export function computeExplodeTranslate(
  midAngle: number,
  offset: number,
): { dx: number; dy: number } {
  const rad = ((midAngle - 90) * Math.PI) / 180;
  return {
    dx: Math.cos(rad) * offset,
    dy: Math.sin(rad) * offset,
  };
}
