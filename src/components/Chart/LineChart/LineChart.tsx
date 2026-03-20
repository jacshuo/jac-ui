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
  computeXCategories,
  computeYDomain,
  createLinearScale,
  createCategoryScale,
  buildPolylinePoints,
  buildSmoothPath,
  buildAreaPath,
  computeTicksForAxis,
  findNearestCategoryIndex,
  getYAtCategory,
  isSeriesCategorical,
} from "./LineChart.logic";
import type { LineChartProps } from "./types";
import "./LineChart.css";

/* ── Legend sub-component ─────────────────────────────── */
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
          <span className="h-2.5 w-5 rounded-sm shrink-0" style={{ background: item.color }} />
          {item.label}
        </button>
      ))}
    </div>
  );
}

/* ── LineChart ────────────────────────────────────────── */
export function LineChart({
  series,
  xAxis,
  yAxis,
  y2Axis,
  y2Series = [],
  smooth = false,
  showDots = true,
  area = false,
  strokeWidth = 2,
  title,
  height = 300,
  className,
  legend = true,
  legendPosition = "bottom",
  animateOnMount = true,
  emptyText = "No data to display",
}: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    label: string;
    items: { name: string; value: string; color: string }[];
  } | null>(null);
  const [crosshairX, setCrosshairX] = useState<number | null>(null);

  /* ── Resize observer ─────────────────────────────────── */
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

  /* ── Legend state ─────────────────────────────────────── */
  const seriesIds = useMemo(() => series.map((s) => s.id), [series]);
  const { visible, toggle, isVisible } = useChartLegend(seriesIds);

  /* ── Colors ───────────────────────────────────────────── */
  const palette = useMemo(() => getDefaultPalette(series.length), [series.length]);
  const colorMap = useMemo(
    () => new Map(series.map((s, i) => [s.id, s.color ?? palette[i]])),
    [series, palette],
  );

  /* ── Dimensions & scales ─────────────────────────────── */
  const margins = useMemo(
    () => computeMargins(!!xAxis?.label, !!yAxis?.label, !!y2Axis),
    [xAxis?.label, yAxis?.label, y2Axis],
  );
  const dim = useMemo(
    () => computeDimensions(containerWidth, height, margins),
    [containerWidth, height, margins],
  );
  const xIsCategory = useMemo(() => isSeriesCategorical(series), [series]);
  const categories = useMemo(
    () => (xIsCategory ? computeXCategories(series, visible) : []),
    [series, visible, xIsCategory],
  );

  const xScale = useMemo<(v: number | string) => number>(() => {
    if (xIsCategory) {
      const catScale = createCategoryScale(categories, [dim.plotLeft, dim.plotRight]);
      return (v: string | number) => catScale(v as string);
    }
    const allX = series.flatMap((s) => s.data.map((p) => p.x as number));
    if (allX.length === 0) return () => dim.plotLeft;
    const xMin = Math.min(...allX);
    const xMax = Math.max(...allX);
    const ls = createLinearScale([xMin, xMax], [dim.plotLeft, dim.plotRight]);
    return (v) => ls(v as number);
  }, [series, xIsCategory, categories, dim]);

  const yDomain = useMemo(() => computeYDomain(series, visible, yAxis), [series, visible, yAxis]);
  const yScale = useMemo(
    () => createLinearScale(yDomain, [dim.plotBottom, dim.plotTop]),
    [yDomain, dim],
  );
  const yTicks = useMemo(
    () => computeTicksForAxis(yDomain, yAxis?.tickCount ?? 5),
    [yDomain, yAxis?.tickCount],
  );

  const y2Domain = useMemo(() => {
    if (!y2Axis) return null;
    const y2SeriesData = series.filter((s) => y2Series.includes(s.id));
    return computeYDomain(y2SeriesData, visible, y2Axis);
  }, [y2Axis, series, y2Series, visible]);

  const y2Scale = useMemo(() => {
    if (!y2Domain) return null;
    return createLinearScale(y2Domain, [dim.plotBottom, dim.plotTop]);
  }, [y2Domain, dim]);

  const y2Ticks = useMemo(() => {
    if (!y2Domain) return [];
    return computeTicksForAxis(y2Domain, y2Axis?.tickCount ?? 5);
  }, [y2Domain, y2Axis?.tickCount]);

  const xTicks = useMemo(() => {
    if (xIsCategory) return categories;
    const allX = series.flatMap((s) => s.data.map((p) => Number(p.x)));
    if (allX.length === 0) return [];
    const xMin = Math.min(...allX);
    const xMax = Math.max(...allX);
    return computeTicksForAxis([xMin, xMax], xAxis?.tickCount ?? 6);
  }, [xIsCategory, categories, series, xAxis?.tickCount]);

  /* ── Interaction handlers ─────────────────────────────── */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGRectElement>) => {
      const svgEl = e.currentTarget.closest("svg");
      if (!svgEl) return;
      const svgRect = svgEl.getBoundingClientRect();
      const svgX = e.clientX - svgRect.left;
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      let nearestLabel = "";
      let crossX = svgX;

      if (xIsCategory && categories.length > 0) {
        const catScale = createCategoryScale(categories, [dim.plotLeft, dim.plotRight]);
        const idx = findNearestCategoryIndex(svgX, categories, catScale);
        nearestLabel = categories[idx] ?? "";
        crossX = catScale(nearestLabel);
      } else if (!xIsCategory) {
        const numTicks = xTicks as number[];
        nearestLabel = formatAxisValue(
          ((svgX - dim.plotLeft) / dim.plotWidth) * (numTicks[numTicks.length - 1] - numTicks[0]) +
            numTicks[0],
          xAxis?.format,
        );
        crossX = svgX;
      }

      const tooltipItems = series
        .filter((s) => isVisible(s.id))
        .map((s) => {
          const useY2 = y2Series.includes(s.id) && y2Scale != null;
          const _scale = useY2 ? y2Scale! : yScale;
          let yVal: number | undefined;
          if (xIsCategory) {
            yVal = getYAtCategory(s, nearestLabel);
          } else {
            // find nearest point
            const svgXVal = svgX;
            let minDist = Infinity;
            let nearest: number | undefined;
            for (const pt of s.data) {
              const px = xScale(pt.x);
              const d = Math.abs(px - svgXVal);
              if (d < minDist) {
                minDist = d;
                nearest = pt.y;
              }
            }
            yVal = nearest;
          }
          return {
            name: s.name,
            value: yVal !== undefined ? formatAxisValue(yVal, yAxis?.format) : "—",
            color: colorMap.get(s.id) ?? "var(--color-chart-1)",
          };
        });

      if (crossX >= dim.plotLeft && crossX <= dim.plotRight) {
        setCrosshairX(crossX);
      }

      const tooltipX = e.clientX - containerRect.left + 12;
      const tooltipY = e.clientY - containerRect.top - 10;
      setTooltip({ x: tooltipX, y: tooltipY, label: nearestLabel, items: tooltipItems });
    },
    [
      xIsCategory,
      categories,
      dim,
      series,
      isVisible,
      y2Series,
      y2Scale,
      yScale,
      xScale,
      xTicks,
      xAxis?.format,
      yAxis?.format,
      colorMap,
    ],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
    setCrosshairX(null);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<SVGRectElement>) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;
      const svgEl = e.currentTarget.closest("svg");
      if (!svgEl) return;
      const svgRect = svgEl.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      const svgX = touch.clientX - svgRect.left;
      let crossX = svgX;
      let nearestLabel = "";
      if (xIsCategory && categories.length > 0) {
        const catScale = createCategoryScale(categories, [dim.plotLeft, dim.plotRight]);
        const idx = findNearestCategoryIndex(svgX, categories, catScale);
        nearestLabel = categories[idx] ?? "";
        crossX = catScale(nearestLabel);
      }
      if (crossX >= dim.plotLeft && crossX <= dim.plotRight) {
        setCrosshairX(crossX);
      }
      const tooltipItems = series
        .filter((s) => isVisible(s.id))
        .map((s) => ({
          name: s.name,
          value:
            xIsCategory && nearestLabel
              ? formatAxisValue(getYAtCategory(s, nearestLabel) ?? 0, yAxis?.format)
              : "—",
          color: colorMap.get(s.id) ?? "var(--color-chart-1)",
        }));
      setTooltip({
        x: touch.clientX - containerRect.left + 12,
        y: touch.clientY - containerRect.top - 10,
        label: nearestLabel,
        items: tooltipItems,
      });
    },
    [xIsCategory, categories, dim, series, isVisible, yAxis?.format, colorMap],
  );

  /* ── Legend items ─────────────────────────────────────── */
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

  /* ── Empty state ──────────────────────────────────────── */
  const hasData = series.some((s) => s.data.length > 0);

  const svgContent = (
    <svg
      role="img"
      aria-label={title ?? "Line chart"}
      width={dim.width}
      height={dim.height}
      viewBox={`0 0 ${dim.width} ${dim.height}`}
      shapeRendering="geometricPrecision"
    >
      {/* Horizontal grid lines */}
      {yAxis?.gridLines !== false &&
        yTicks.map((tick) => {
          const y = yScale(tick);
          return (
            <line
              key={tick}
              x1={dim.plotLeft}
              x2={dim.plotRight}
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeWidth={0.5}
              strokeDasharray="4 4"
              className="text-secondary-200 dark:text-secondary-700"
            />
          );
        })}

      {/* Area fills */}
      {area &&
        series.map((s) => {
          if (!isVisible(s.id) || s.data.length === 0) return null;
          const useY2 = y2Series.includes(s.id) && y2Scale != null;
          const scaleY = useY2 ? y2Scale! : yScale;
          const color = colorMap.get(s.id) ?? "var(--color-chart-1)";
          const d = buildAreaPath(s.data, xScale, scaleY, smooth, dim.plotBottom);
          return (
            <path
              key={`area-${s.id}`}
              d={d}
              fill={color}
              fillOpacity={0.15}
              stroke="none"
              className={animateOnMount ? "chart-area-animate" : ""}
            />
          );
        })}

      {/* Lines */}
      {series.map((s) => {
        if (!isVisible(s.id) || s.data.length === 0) return null;
        const useY2 = y2Series.includes(s.id) && y2Scale != null;
        const scaleY = useY2 ? y2Scale! : yScale;
        const color = colorMap.get(s.id) ?? "var(--color-chart-1)";
        if (smooth) {
          return (
            <path
              key={s.id}
              d={buildSmoothPath(s.data, xScale, scaleY)}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={animateOnMount ? "chart-line-animate" : ""}
            />
          );
        }
        return (
          <polyline
            key={s.id}
            points={buildPolylinePoints(s.data, xScale, scaleY)}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animateOnMount ? "chart-line-animate" : ""}
          />
        );
      })}

      {/* Dots */}
      {showDots &&
        series.map((s) => {
          if (!isVisible(s.id)) return null;
          const useY2 = y2Series.includes(s.id) && y2Scale != null;
          const scaleY = useY2 ? y2Scale! : yScale;
          const color = colorMap.get(s.id) ?? "var(--color-chart-1)";
          return s.data.map((pt, idx) => (
            <circle
              key={`${s.id}-${idx}`}
              cx={xScale(pt.x)}
              cy={scaleY(pt.y)}
              r={3}
              fill={color}
              stroke="white"
              strokeWidth={1.5}
              className={cn("chart-dot", animateOnMount ? "chart-dot-animate" : "")}
            />
          ));
        })}

      {/* Crosshair */}
      {crosshairX != null && (
        <line
          className="chart-crosshair"
          x1={crosshairX}
          x2={crosshairX}
          y1={dim.plotTop}
          y2={dim.plotBottom}
          stroke="currentColor"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.5}
          style={{ color: "var(--color-secondary-400)" }}
        />
      )}

      {/* Y Axis */}
      <line
        x1={dim.plotLeft}
        x2={dim.plotLeft}
        y1={dim.plotTop}
        y2={dim.plotBottom}
        stroke="currentColor"
        strokeWidth={1}
        className="text-secondary-300 dark:text-secondary-600"
      />
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

      {/* Y2 Axis */}
      {y2Axis && y2Scale && (
        <>
          <line
            x1={dim.plotRight}
            x2={dim.plotRight}
            y1={dim.plotTop}
            y2={dim.plotBottom}
            stroke="currentColor"
            strokeWidth={1}
            className="text-secondary-300 dark:text-secondary-600"
          />
          {y2Ticks.map((tick) => {
            const y = y2Scale(tick);
            return (
              <g key={tick}>
                <line
                  x1={dim.plotRight}
                  x2={dim.plotRight + 4}
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth={1}
                  className="text-secondary-300 dark:text-secondary-600"
                />
                <text
                  x={dim.plotRight + 6}
                  y={y}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fontSize={10}
                  fill="currentColor"
                  className="text-secondary-500 dark:text-secondary-400"
                >
                  {formatAxisValue(tick, y2Axis?.format)}
                </text>
              </g>
            );
          })}
          {y2Axis?.label && (
            <text
              x={dim.plotTop + dim.plotHeight / 2}
              y={-(dim.width - 14)}
              textAnchor="middle"
              fontSize={11}
              fill="currentColor"
              className="text-secondary-600 dark:text-secondary-400"
              transform="rotate(90)"
            >
              {y2Axis.label}
            </text>
          )}
        </>
      )}

      {/* X Axis */}
      <line
        x1={dim.plotLeft}
        x2={dim.plotRight}
        y1={dim.plotBottom}
        y2={dim.plotBottom}
        stroke="currentColor"
        strokeWidth={1}
        className="text-secondary-300 dark:text-secondary-600"
      />
      {(xIsCategory ? categories : (xTicks as (number | string)[])).map((tick, i) => {
        const x = xScale(tick);
        return (
          <g key={i}>
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

      {/* Interaction overlay */}
      <rect
        x={dim.plotLeft}
        y={dim.plotTop}
        width={dim.plotWidth}
        height={dim.plotHeight}
        fill="transparent"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchStart}
        onTouchEnd={handleMouseLeave}
        style={{ cursor: "crosshair" }}
      />
    </svg>
  );

  const isRow = legendPosition === "left" || legendPosition === "right";

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

      {/* Tooltip */}
      {tooltip && (
        <div
          className={chartTooltipVariants()}
          style={{ left: tooltip.x, top: tooltip.y }}
          role="tooltip"
        >
          {tooltip.label && (
            <div className="mb-1 font-medium text-primary-200">{tooltip.label}</div>
          )}
          {tooltip.items.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ background: item.color }} />
              <span className="text-primary-300">{item.name}:</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
