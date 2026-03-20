import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import {
  chartContainerVariants,
  chartLegendVariants,
  chartTooltipVariants,
} from "../../../styles/theme";
import { useChartLegend } from "../useChartLegend";
import { getDefaultPalette, formatAxisValue, polarToCartesian } from "../chart.utils";
import { computeSliceSpecs, computeExplodeTranslate } from "./PieChart.logic";
import type { PieChartProps } from "./types";
import "./PieChart.css";

function ChartLegend({
  items,
  position,
  onToggle,
}: {
  items: { id: string; label: string; color: string; visible: boolean; percent: number }[];
  position: "top" | "bottom" | "left" | "right";
  onToggle: (id: string) => void;
}) {
  return (
    <div className={chartLegendVariants({ position })}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onToggle(item.id)}
          className={cn(
            "flex items-center gap-1.5 cursor-pointer rounded px-1.5 py-1 text-xs text-primary-700 transition-opacity hover:bg-primary-100 dark:text-primary-300 dark:hover:bg-primary-800",
            !item.visible && "opacity-40",
          )}
          aria-pressed={item.visible}
        >
          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: item.color }} />
          <span>{item.label}</span>
          <span className="text-secondary-400">({item.percent}%)</span>
        </button>
      ))}
    </div>
  );
}

export function PieChart({
  data,
  donut = false,
  donutThickness = 0.5,
  startAngle = -90,
  padAngle = 0,
  labelType = "percent",
  centerLabel,
  centerSubLabel,
  explodeOnHover = true,
  explodeOffset = 8,
  title,
  height = 300,
  className,
  legend = true,
  legendPosition = "bottom",
  animateOnMount = true,
  emptyText = "No data to display",
}: PieChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(400);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    items: { label: string; value: string; percent: string; color: string }[];
  } | null>(null);
  const [labelOffsets, setLabelOffsets] = useState<Record<string, { dx: number; dy: number }>>({});
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origDx: number;
    origDy: number;
  } | null>(null);

  useEffect(() => {
    // Observe the SVG wrapper div, NOT the outer container.
    // When legend is left/right, the wrapper is narrower than the outer div,
    // and using the outer width causes the SVG to overflow its flex cell.
    const el = svgWrapRef.current;
    if (!el) return;
    const initial = el.getBoundingClientRect().width;
    if (initial > 0) setContainerWidth(initial);
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setContainerWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Global pointer tracking for label drag ────────────────────────────
  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      const d = dragRef.current;
      if (!d) return;
      if ("touches" in e && e.cancelable) e.preventDefault();
      const clientX =
        "touches" in e
          ? ((e as TouchEvent).touches[0]?.clientX ?? d.startX)
          : (e as MouseEvent).clientX;
      const clientY =
        "touches" in e
          ? ((e as TouchEvent).touches[0]?.clientY ?? d.startY)
          : (e as MouseEvent).clientY;
      setLabelOffsets((prev) => ({
        ...prev,
        [d.id]: { dx: d.origDx + clientX - d.startX, dy: d.origDy + clientY - d.startY },
      }));
    }
    function onEnd() {
      dragRef.current = null;
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

  const sliceIds = useMemo(() => data.map((s) => s.id), [data]);
  const { visible, toggle, isVisible } = useChartLegend(sliceIds);

  const palette = useMemo(() => getDefaultPalette(data.length), [data.length]);

  // ── Label layout constants ─────────────────────────────────────────────
  const FONT_SZ = 10;
  const CHAR_W = 6.4; // estimated px per char @ font-size 10
  const RADIAL = 18; // radial outward segment length
  const TICK = 14; // horizontal tick length
  const EDGE = 6; // minimum gap from SVG boundary

  // ── Geometry: circle is always centered, outerR reserves space for radial ──
  const svgWidth = containerWidth;
  const svgHeight = height;
  const cx = svgWidth / 2;
  const cy = svgHeight / 2;
  // Reserve just enough for the radial arm; tick+text are clamped later.
  const RADIAL_GUARD = labelType !== "none" ? RADIAL + EDGE + 4 : EDGE + 4;
  const outerR = Math.max(Math.min(cx, cy) - RADIAL_GUARD, 20);
  const innerR = donut ? outerR * donutThickness : 0;

  const sliceSpecs = useMemo(
    () => computeSliceSpecs(data, visible, palette, outerR, innerR, cx, cy, startAngle, padAngle),
    [data, visible, palette, outerR, innerR, cx, cy, startAngle, padAngle],
  );

  // Reset label drag offsets whenever the visible slice set changes
  const sliceIdKey = useMemo(() => sliceSpecs.map((s) => s.id).join(","), [sliceSpecs]);
  useEffect(() => {
    setLabelOffsets({});
  }, [sliceIdKey]);

  const handleSliceHover = useCallback(
    (e: React.MouseEvent<SVGPathElement>, id: string) => {
      if (dragRef.current) return; // suppress tooltip while dragging a label
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      setHoveredId(id);
      const spec = sliceSpecs.find((s) => s.id === id);
      if (!spec) return;
      setTooltip({
        x: e.clientX - containerRect.left + 12,
        y: e.clientY - containerRect.top - 10,
        items: [
          {
            label: spec.label,
            value: formatAxisValue(spec.value),
            percent: `${spec.percent}%`,
            color: spec.color,
          },
        ],
      });
    },
    [sliceSpecs],
  );

  const handleSliceLeave = useCallback(() => {
    setHoveredId(null);
    setTooltip(null);
  }, []);

  const handleLabelDragStart = useCallback(
    (id: string, clientX: number, clientY: number) => {
      const orig = labelOffsets[id] ?? { dx: 0, dy: 0 };
      dragRef.current = { id, startX: clientX, startY: clientY, origDx: orig.dx, origDy: orig.dy };
    },
    [labelOffsets],
  );

  const handleTouchSlice = useCallback(
    (e: React.TouchEvent<SVGPathElement>, id: string) => {
      e.preventDefault();
      setHoveredId(id);
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      const touch = e.touches[0];
      if (!touch) return;
      const spec = sliceSpecs.find((s) => s.id === id);
      if (!spec) return;
      setTooltip({
        x: touch.clientX - containerRect.left + 12,
        y: touch.clientY - containerRect.top - 10,
        items: [
          {
            label: spec.label,
            value: formatAxisValue(spec.value),
            percent: `${spec.percent}%`,
            color: spec.color,
          },
        ],
      });
    },
    [sliceSpecs],
  );

  const legendItems = useMemo(() => {
    const total = data.reduce((a, s) => a + s.value, 0);
    return data.map((s, i) => ({
      id: s.id,
      label: s.label,
      color: s.color ?? palette[i],
      visible: isVisible(s.id),
      percent: total > 0 ? Math.round((s.value / total) * 1000) / 10 : 0,
    }));
  }, [data, palette, isVisible]);

  const hasData = data.length > 0 && data.some((s) => s.value > 0);
  const isRow = legendPosition === "left" || legendPosition === "right";

  /* ── Collision-aware label layout ────────────────────────────────────── */
  const resolvedLabels = useMemo(() => {
    if (labelType === "none") return [];

    const LINE_H = FONT_SZ + 3;
    const minY = EDGE + FONT_SZ * 0.5;
    const maxY = svgHeight - EDGE - FONT_SZ * 0.5;

    // 1. Collect initial label positions
    const labels = sliceSpecs
      .filter((s) => s.percent >= 3)
      .map((spec) => {
        let text = "";
        switch (labelType) {
          case "percent":
            text = `${spec.percent}%`;
            break;
          case "value":
            text = formatAxisValue(spec.value);
            break;
          case "label":
            text = spec.label;
            break;
          case "label+percent":
            text = `${spec.label} ${spec.percent}%`;
            break;
        }

        const p1 = polarToCartesian(spec.cx, spec.cy, spec.outerR + 2, spec.midAngle);
        const elbow = polarToCartesian(spec.cx, spec.cy, spec.outerR + RADIAL, spec.midAngle);
        const rad = ((spec.midAngle - 90) * Math.PI) / 180;
        const isRight = Math.cos(rad) >= 0;

        const textW = Math.ceil(text.length * CHAR_W);

        return {
          id: spec.id,
          color: spec.color,
          text,
          textW,
          p1,
          elbowX: elbow.x,
          y: elbow.y,
          isRight,
        };
      });

    // 2. Split into left / right, sort by natural Y
    const right = labels.filter((l) => l.isRight).sort((a, b) => a.y - b.y);
    const left = labels.filter((l) => !l.isRight).sort((a, b) => a.y - b.y);

    function resolveOverlaps(group: typeof labels) {
      if (group.length === 0) return;
      for (let iter = 0; iter < 20; iter++) {
        let moved = false;
        for (let i = 1; i < group.length; i++) {
          const gap = group[i].y - group[i - 1].y;
          if (gap < LINE_H) {
            const push = (LINE_H - gap) / 2;
            group[i - 1].y -= push;
            group[i].y += push;
            moved = true;
          }
        }
        if (group[0].y < minY) group[0].y = minY;
        for (let i = 1; i < group.length; i++) {
          if (group[i].y < group[i - 1].y + LINE_H) group[i].y = group[i - 1].y + LINE_H;
        }
        const last = group.length - 1;
        if (group[last].y > maxY) group[last].y = maxY;
        for (let i = last - 1; i >= 0; i--) {
          if (group[i].y > group[i + 1].y - LINE_H) group[i].y = group[i + 1].y - LINE_H;
        }
        for (const l of group) l.y = Math.max(minY, Math.min(maxY, l.y));
        if (!moved) break;
      }
    }

    resolveOverlaps(right);
    resolveOverlaps(left);
    return [...left, ...right];
  }, [sliceSpecs, labelType, svgHeight]);

  const svgContent = (
    <svg
      role="img"
      aria-label={title ?? "Pie chart"}
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      shapeRendering="geometricPrecision"
    >
      <g className={animateOnMount ? "chart-pie-animate" : ""}>
        {sliceSpecs.map((spec, i) => {
          const isHovered = hoveredId === spec.id;
          const explode = explodeOnHover && isHovered;
          const offset = computeExplodeTranslate(spec.midAngle, explode ? explodeOffset : 0);
          return (
            <path
              key={spec.id}
              d={spec.path}
              fill={spec.color}
              transform={explode ? `translate(${offset.dx}, ${offset.dy})` : undefined}
              className={cn(
                "chart-slice",
                animateOnMount && `chart-slice-animate-${Math.min(i, 7)}`,
                isHovered && "chart-slice--exploded",
              )}
              stroke={spec.color}
              strokeWidth={0.6}
              onMouseMove={(e) => handleSliceHover(e, spec.id)}
              onMouseLeave={handleSliceLeave}
              onTouchStart={(e) => handleTouchSlice(e, spec.id)}
              onTouchEnd={handleSliceLeave}
              aria-label={`${spec.label}: ${spec.percent}%`}
            />
          );
        })}
        {/* Labels — draggable on desktop & mobile */}
        {resolvedLabels.map((label) => {
          const off = labelOffsets[label.id] ?? { dx: 0, dy: 0 };
          const elbowXd = label.elbowX + off.dx;
          const yd = label.y + off.dy;
          const tickX = elbowXd + (label.isRight ? TICK : -TICK);
          const textX = label.isRight ? tickX + 3 : tickX - 3;
          // Invisible hit rect covers the tick + text so pointer events land on something real
          const hitW = TICK + 3 + label.textW + 6;
          const hitX = label.isRight ? elbowXd : elbowXd - hitW;
          const hitY = yd - FONT_SZ - 2;
          const hitH = FONT_SZ * 2 + 4;
          return (
            <g key={`label-${label.id}`} style={{ userSelect: "none" }}>
              <polyline
                points={[
                  `${label.p1.x.toFixed(2)},${label.p1.y.toFixed(2)}`,
                  `${elbowXd.toFixed(2)},${yd.toFixed(2)}`,
                  `${tickX.toFixed(2)},${yd.toFixed(2)}`,
                ].join(" ")}
                fill="none"
                stroke={label.color}
                strokeWidth={1.2}
                opacity={0.85}
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ pointerEvents: "none" }}
              />
              <text
                x={textX.toFixed(2)}
                y={yd.toFixed(2)}
                textAnchor={label.isRight ? "start" : "end"}
                dominantBaseline="middle"
                fontSize={FONT_SZ}
                fill="currentColor"
                className="text-primary-700 dark:text-primary-300"
                style={{ pointerEvents: "none" }}
              >
                {label.text}
              </text>
              {/* Transparent hit area — the actual drag handle */}
              <rect
                x={hitX}
                y={hitY}
                width={hitW}
                height={hitH}
                fill="transparent"
                style={{ cursor: "grab", touchAction: "none" }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleLabelDragStart(label.id, e.clientX, e.clientY);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  const t = e.touches[0];
                  if (t) handleLabelDragStart(label.id, t.clientX, t.clientY);
                }}
              />
            </g>
          );
        })}
      </g>

      {/* Donut center text */}
      {donut && (
        <g style={{ pointerEvents: "none" }}>
          {hoveredId && sliceSpecs.find((s) => s.id === hoveredId) ? (
            <>
              <text
                x={cx}
                y={cy - 8}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={18}
                fontWeight={600}
                fill="currentColor"
                className="text-primary-800 dark:text-primary-100"
              >
                {sliceSpecs.find((s) => s.id === hoveredId)?.percent}%
              </text>
              <text
                x={cx}
                y={cy + 12}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
                fill="currentColor"
                className="text-secondary-500 dark:text-secondary-400"
              >
                {sliceSpecs.find((s) => s.id === hoveredId)?.label}
              </text>
            </>
          ) : (
            <>
              {centerLabel && (
                <text
                  x={cx}
                  y={cy - (centerSubLabel ? 8 : 0)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={16}
                  fontWeight={600}
                  fill="currentColor"
                  className="text-primary-800 dark:text-primary-100"
                >
                  {centerLabel}
                </text>
              )}
              {centerSubLabel && (
                <text
                  x={cx}
                  y={cy + 14}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={11}
                  fill="currentColor"
                  className="text-secondary-500 dark:text-secondary-400"
                >
                  {centerSubLabel}
                </text>
              )}
            </>
          )}
        </g>
      )}
    </svg>
  );

  return (
    <div ref={containerRef} className={cn(chartContainerVariants(), className)}>
      {title && (
        <h3 className="mb-2 text-sm font-semibold text-primary-700 dark:text-primary-200">
          {title}
        </h3>
      )}
      {legend && legendPosition === "top" && (
        <ChartLegend items={legendItems} position="top" onToggle={toggle} />
      )}
      <div className={cn("flex items-start justify-center", isRow && "gap-0")}>
        {legend && legendPosition === "left" && (
          <ChartLegend items={legendItems} position="left" onToggle={toggle} />
        )}
        <div ref={svgWrapRef} className="flex-1 min-w-0 overflow-hidden">
          {!hasData ? (
            <div
              className="flex items-center justify-center text-secondary-400 dark:text-secondary-500"
              style={{ height }}
            >
              {emptyText}
            </div>
          ) : (
            svgContent
          )}
        </div>
        {legend && legendPosition === "right" && (
          <ChartLegend items={legendItems} position="right" onToggle={toggle} />
        )}
      </div>
      {legend && legendPosition === "bottom" && (
        <ChartLegend items={legendItems} position="bottom" onToggle={toggle} />
      )}
      {tooltip && (
        <div
          className={chartTooltipVariants()}
          style={{ left: tooltip.x, top: tooltip.y }}
          role="tooltip"
        >
          {tooltip.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ background: item.color }}
              />
              <span className="font-medium">{item.label}:</span>
              <span>{item.value}</span>
              <span className="text-primary-300">({item.percent})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
