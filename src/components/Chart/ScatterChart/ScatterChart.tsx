import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import {
  chartContainerVariants,
  chartLegendVariants,
  chartTooltipVariants,
} from "../../../styles/theme";
import { useChartLegend } from "../useChartLegend";
import { getDefaultPalette, formatAxisValue } from "../chart.utils";
import {
  computeMargins,
  computeDimensions,
  computeXDomain,
  computeYDomain,
  createLinearScale,
  computeTicksForAxis,
  deterministicJitter,
  computeBoundingEllipse,
} from "./ScatterChart.logic";
import type { ScatterChartProps } from "./types";
import "./ScatterChart.css";

function ChartLegend({
  items,
  position,
  onToggle,
}: {
  items: { id: string; label: string; color: string; visible: boolean }[];
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
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function ScatterChart({
  series,
  xAxis,
  yAxis,
  dotRadius = 5,
  dotOpacity = 0.75,
  clusters = false,
  jitter = false,
  jitterAmount = 12,
  linkedLines = false,
  title,
  height = 300,
  className,
  legend = true,
  legendPosition = "bottom",
  animateOnMount = true,
  emptyText = "No data to display",
}: ScatterChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    seriesName: string;
    xVal: string;
    yVal: string;
    color: string;
  } | null>(null);

  useEffect(() => {
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

  const seriesIds = useMemo(() => series.map((s) => s.id), [series]);
  const { visible, toggle, isVisible } = useChartLegend(seriesIds);

  const palette = useMemo(() => getDefaultPalette(series.length), [series.length]);
  const colorMap = useMemo(
    () => new Map(series.map((s, i) => [s.id, s.color ?? palette[i]])),
    [series, palette],
  );

  const margins = useMemo(
    () => computeMargins(!!xAxis?.label, !!yAxis?.label, false),
    [xAxis?.label, yAxis?.label],
  );
  const dim = useMemo(
    () => computeDimensions(containerWidth, height, margins),
    [containerWidth, height, margins],
  );

  const xDomain = useMemo(() => computeXDomain(series, visible, xAxis), [series, visible, xAxis]);
  const yDomain = useMemo(() => computeYDomain(series, visible, yAxis), [series, visible, yAxis]);

  const xScale = useMemo(
    () => createLinearScale(xDomain, [dim.plotLeft, dim.plotRight]),
    [xDomain, dim],
  );
  const yScale = useMemo(
    () => createLinearScale(yDomain, [dim.plotBottom, dim.plotTop]),
    [yDomain, dim],
  );

  const xTicks = useMemo(
    () => computeTicksForAxis(xDomain, xAxis?.tickCount ?? 6),
    [xDomain, xAxis?.tickCount],
  );
  const yTicks = useMemo(
    () => computeTicksForAxis(yDomain, yAxis?.tickCount ?? 5),
    [yDomain, yAxis?.tickCount],
  );

  const handleDotHover = useCallback(
    (
      e: React.MouseEvent<SVGCircleElement>,
      seriesName: string,
      xVal: number | string,
      yVal: number,
      color: string,
    ) => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      setTooltip({
        x: e.clientX - containerRect.left + 12,
        y: e.clientY - containerRect.top - 10,
        seriesName,
        xVal: formatAxisValue(xVal, xAxis?.format),
        yVal: formatAxisValue(yVal, yAxis?.format),
        color,
      });
    },
    [xAxis?.format, yAxis?.format],
  );

  const handleTouchDot = useCallback(
    (
      e: React.TouchEvent<SVGCircleElement>,
      seriesName: string,
      xVal: number | string,
      yVal: number,
      color: string,
    ) => {
      e.preventDefault();
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      const touch = e.touches[0];
      if (!touch) return;
      setTooltip({
        x: touch.clientX - containerRect.left + 12,
        y: touch.clientY - containerRect.top - 10,
        seriesName,
        xVal: formatAxisValue(xVal, xAxis?.format),
        yVal: formatAxisValue(yVal, yAxis?.format),
        color,
      });
    },
    [xAxis?.format, yAxis?.format],
  );

  const legendItems = useMemo(
    () =>
      series.map((s, i) => ({
        id: s.id,
        label: s.name,
        color: s.color ?? palette[i],
        visible: isVisible(s.id),
      })),
    [series, palette, isVisible],
  );

  const hasData = series.some((s) => s.data.length > 0);
  const isRow = legendPosition === "left" || legendPosition === "right";

  const svgContent = (
    <svg
      role="img"
      aria-label={title ?? "Scatter chart"}
      width={dim.width}
      height={dim.height}
      viewBox={`0 0 ${dim.width} ${dim.height}`}
      shapeRendering="geometricPrecision"
    >
      {/* Grid lines */}
      {yTicks.map((tick) => (
        <line
          key={tick}
          x1={dim.plotLeft}
          x2={dim.plotRight}
          y1={yScale(tick)}
          y2={yScale(tick)}
          stroke="currentColor"
          strokeWidth={0.5}
          strokeDasharray="4 4"
          className="text-secondary-200 dark:text-secondary-700"
        />
      ))}

      {/* Cluster ellipses */}
      {clusters &&
        series.map((s, si) => {
          if (!isVisible(s.id) || s.data.length < 2) return null;
          const color = colorMap.get(s.id) ?? "var(--color-chart-1)";
          const xs = s.data.map((pt) => xScale(Number(pt.x)));
          const ys = s.data.map((pt) => yScale(pt.y));
          const ellipse = computeBoundingEllipse(xs, ys, 16);
          if (!ellipse) return null;
          return (
            <ellipse
              key={`cluster-${s.id}`}
              cx={ellipse.cx}
              cy={ellipse.cy}
              rx={ellipse.rx}
              ry={ellipse.ry}
              fill={color}
              fillOpacity={0.06}
              stroke={color}
              strokeOpacity={0.3}
              strokeWidth={1.5}
              strokeDasharray="5 3"
              className={animateOnMount ? "chart-cluster-ellipse" : ""}
              style={{ animationDelay: `${si * 0.1}s` }}
            />
          );
        })}

      {/* Linked lines */}
      {linkedLines &&
        series.map((s) => {
          if (!isVisible(s.id) || s.data.length < 2) return null;
          const color = colorMap.get(s.id) ?? "var(--color-chart-1)";
          const sorted = [...s.data].sort((a, b) => Number(a.x) - Number(b.x));
          const pts = sorted
            .map((pt) => `${xScale(Number(pt.x)).toFixed(2)},${yScale(pt.y).toFixed(2)}`)
            .join(" ");
          return (
            <polyline
              key={`link-${s.id}`}
              points={pts}
              fill="none"
              stroke={color}
              strokeWidth={1.5}
              className="chart-scatter-link"
            />
          );
        })}

      {/* Dots */}
      {series.map((s, si) => {
        if (!isVisible(s.id)) return null;
        const color = colorMap.get(s.id) ?? "var(--color-chart-1)";
        return (
          <g key={s.id} className="chart-scatter-group">
            {s.data.map((pt, pi) => {
              const [jx, jy] = jitter ? deterministicJitter(si, pi, jitterAmount) : [0, 0];
              const cx = xScale(Number(pt.x)) + jx;
              const cy = yScale(pt.y) + jy;
              return (
                <circle
                  key={pi}
                  cx={cx}
                  cy={cy}
                  r={dotRadius}
                  fill={color}
                  fillOpacity={dotOpacity}
                  stroke={color}
                  strokeWidth={1}
                  strokeOpacity={0.5}
                  className={cn(
                    "chart-scatter-dot",
                    animateOnMount && "chart-scatter-dot--animate",
                  )}
                  style={{ color }}
                  onMouseMove={(e) => handleDotHover(e, s.name, pt.x, pt.y, color)}
                  onMouseLeave={() => setTooltip(null)}
                  onTouchStart={(e) => handleTouchDot(e, s.name, pt.x, pt.y, color)}
                  onTouchEnd={() => setTooltip(null)}
                />
              );
            })}
          </g>
        );
      })}

      {/* Axes */}
      <line
        x1={dim.plotLeft}
        x2={dim.plotLeft}
        y1={dim.plotTop}
        y2={dim.plotBottom}
        stroke="currentColor"
        strokeWidth={1}
        className="text-secondary-300 dark:text-secondary-600"
      />
      <line
        x1={dim.plotLeft}
        x2={dim.plotRight}
        y1={dim.plotBottom}
        y2={dim.plotBottom}
        stroke="currentColor"
        strokeWidth={1}
        className="text-secondary-300 dark:text-secondary-600"
      />

      {/* Y Axis ticks */}
      {yTicks.map((tick) => {
        const y = yScale(tick);
        return (
          <g key={tick}>
            <line
              x1={dim.plotLeft - 4}
              x2={dim.plotLeft}
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeWidth={1}
              className="text-secondary-300 dark:text-secondary-600"
            />
            <text
              x={dim.plotLeft - 6}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={10}
              fill="currentColor"
              className="text-secondary-500 dark:text-secondary-400"
            >
              {formatAxisValue(tick, yAxis?.format)}
            </text>
          </g>
        );
      })}

      {/* X Axis ticks */}
      {xTicks.map((tick) => {
        const x = xScale(tick);
        return (
          <g key={tick}>
            <line
              x1={x}
              x2={x}
              y1={dim.plotBottom}
              y2={dim.plotBottom + 4}
              stroke="currentColor"
              strokeWidth={1}
              className="text-secondary-300 dark:text-secondary-600"
            />
            <text
              x={x}
              y={dim.plotBottom + 14}
              textAnchor="middle"
              fontSize={10}
              fill="currentColor"
              className="text-secondary-500 dark:text-secondary-400"
            >
              {formatAxisValue(tick, xAxis?.format)}
            </text>
          </g>
        );
      })}

      {yAxis?.label && (
        <text
          x={-(dim.plotTop + dim.plotHeight / 2)}
          y={14}
          textAnchor="middle"
          fontSize={11}
          fill="currentColor"
          className="text-secondary-600 dark:text-secondary-400"
          transform="rotate(-90)"
        >
          {yAxis.label}
        </text>
      )}
      {xAxis?.label && (
        <text
          x={dim.plotLeft + dim.plotWidth / 2}
          y={dim.height - 4}
          textAnchor="middle"
          fontSize={11}
          fill="currentColor"
          className="text-secondary-600 dark:text-secondary-400"
        >
          {xAxis.label}
        </text>
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
      <div className={cn("flex items-start", isRow && "gap-0")}>
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
          <div className="flex items-center gap-1.5 mb-1">
            <span className="h-2 w-2 rounded-full" style={{ background: tooltip.color }} />
            <span className="font-medium">{tooltip.seriesName}</span>
          </div>
          <div className="text-primary-300">
            X: <span className="font-medium text-primary-50">{tooltip.xVal}</span>
            {"  "}
            Y: <span className="font-medium text-primary-50">{tooltip.yVal}</span>
          </div>
        </div>
      )}
    </div>
  );
}
