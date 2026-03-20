/** Returns an array of CSS custom property references for chart series colors. */
export function getDefaultPalette(count: number): string[] {
  const tokens = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
    "var(--color-chart-5)",
    "var(--color-chart-6)",
    "var(--color-chart-7)",
    "var(--color-chart-8)",
  ];
  return Array.from({ length: count }, (_, i) => tokens[i % tokens.length]);
}

/** Computes a padded [min, max] range from raw data extents. */
export function clampRange(min: number, max: number, padding = 0.1): [number, number] {
  if (min === max) {
    return [min - 1, max + 1];
  }
  const range = max - min;
  const pad = range * padding;
  return [Math.floor(min - pad), Math.ceil(max + pad)];
}

/** Generates evenly spaced tick values between min and max (inclusive). */
export function computeTicks(min: number, max: number, count: number): number[] {
  if (count <= 1) return [min];
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => +(min + i * step).toFixed(10));
}

/** Formats an axis value using an optional custom formatter. */
export function formatAxisValue(
  v: number | string,
  formatter?: (v: number | string) => string,
): string {
  if (formatter) return formatter(v);
  if (typeof v === "number") {
    if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
    return Number.isInteger(v) ? v.toString() : v.toFixed(2);
  }
  return String(v);
}

/** Converts polar coordinates to Cartesian (0° = top, clockwise). */
export function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

/** Builds an SVG arc path string from startAngle to endAngle (degrees). */
export function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return [
    "M",
    start.x.toFixed(3),
    start.y.toFixed(3),
    "A",
    r,
    r,
    0,
    largeArcFlag,
    1,
    end.x.toFixed(3),
    end.y.toFixed(3),
  ].join(" ");
}
