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
  computeCategories,
  computeBarYDomain,
  createLinearScale,
  computeTicksForAxis,
  buildGroupedBarSpecs,
  buildStackedBarSpecs,
  buildGroupedHorizontalBarSpecs,
  buildStackedHorizontalBarSpecs,
} from "./BarChart.logic";
import type { BarChartProps } from "./types";
import "./BarChart.css";

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

export function BarChart({
  series,
  xAxis,
  yAxis,
  orientation = "vertical",
  grouped = true,
  barRadius = 4,
  barPadding = 0.2,
  groupPadding = 0.3,
  title,
  height = 300,
  className,
  legend = true,
  legendPosition = "bottom",
  animateOnMount = true,
  emptyText = "No data to display",
}: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    category: string;
    items: { name: string; value: string; color: string }[];
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

  const isHorizontal = orientation === "horizontal";
  const margins = useMemo(
    () => computeMargins(!!xAxis?.label, !!yAxis?.label, false),
    [xAxis?.label, yAxis?.label],
  );
  const dim = useMemo(
    () => computeDimensions(containerWidth, height, margins),
    [containerWidth, height, margins],
  );

  const categories = useMemo(() => computeCategories(series, visible), [series, visible]);

  const yDomain = useMemo(
    () => computeBarYDomain(series, visible, grouped, isHorizontal ? xAxis : yAxis),
    [series, visible, grouped, isHorizontal, xAxis, yAxis],
  );

  const yScale = useMemo(
    () =>
      createLinearScale(
        yDomain,
        isHorizontal ? [dim.plotLeft, dim.plotRight] : [dim.plotBottom, dim.plotTop],
      ),
    [yDomain, dim, isHorizontal],
  );
  const yTicks = useMemo(
    () => computeTicksForAxis(yDomain, (isHorizontal ? xAxis : yAxis)?.tickCount ?? 5),
    [yDomain, isHorizontal, xAxis, yAxis],
  );

  /* Build bar specs */
  const barSpecs = useMemo(() => {
    if (isHorizontal) {
      return grouped
        ? buildGroupedHorizontalBarSpecs(
            series,
            visible,
            categories,
            colorMap,
            dim.plotLeft,
            dim.plotTop,
            dim.plotHeight,
            yScale,
            groupPadding,
            barPadding,
          )
        : buildStackedHorizontalBarSpecs(
            series,
            visible,
            categories,
            colorMap,
            dim.plotLeft,
            dim.plotTop,
            dim.plotHeight,
            yScale,
            groupPadding,
          );
    }
    return grouped
      ? buildGroupedBarSpecs(
          series,
          visible,
          categories,
          colorMap,
          dim.plotLeft,
          dim.plotWidth,
          dim.plotBottom,
          dim.plotTop,
          yScale,
          groupPadding,
          barPadding,
        )
      : buildStackedBarSpecs(
          series,
          visible,
          categories,
          colorMap,
          dim.plotLeft,
          dim.plotWidth,
          dim.plotBottom,
          yScale,
          groupPadding,
        );
  }, [
    series,
    visible,
    categories,
    colorMap,
    dim,
    yScale,
    grouped,
    isHorizontal,
    groupPadding,
    barPadding,
  ]);

  /* Category scale for horizontal axis labels */
  const catBandWidth = categories.length > 0 ? dim.plotWidth / categories.length : 1;
  const catBandHeight = categories.length > 0 ? dim.plotHeight / categories.length : 1;

  const handleBarHover = useCallback(
    (e: React.MouseEvent<SVGRectElement>, category: string) => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      const items = series
        .filter((s) => isVisible(s.id))
        .map((s) => {
          const pt = s.data.find((d) => String(d.x) === category);
          return {
            name: s.name,
            value: pt ? formatAxisValue(pt.y, yAxis?.format) : "—",
            color: colorMap.get(s.id) ?? "var(--color-chart-1)",
          };
        });
      setTooltip({
        x: e.clientX - containerRect.left + 12,
        y: e.clientY - containerRect.top - 10,
        category,
        items,
      });
    },
    [series, isVisible, colorMap, yAxis?.format],
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
      aria-label={title ?? "Bar chart"}
      width={dim.width}
      height={dim.height}
      viewBox={`0 0 ${dim.width} ${dim.height}`}
      shapeRendering="geometricPrecision"
    >
      {/* Grid lines */}
      {yTicks.map((tick) => {
        const px = yScale(tick);
        return isHorizontal ? (
          <line
            key={tick}
            x1={px}
            x2={px}
            y1={dim.plotTop}
            y2={dim.plotBottom}
            stroke="currentColor"
            strokeWidth={0.5}
            strokeDasharray="4 4"
            className="text-secondary-200 dark:text-secondary-700"
          />
        ) : (
          <line
            key={tick}
            x1={dim.plotLeft}
            x2={dim.plotRight}
            y1={px}
            y2={px}
            stroke="currentColor"
            strokeWidth={0.5}
            strokeDasharray="4 4"
            className="text-secondary-200 dark:text-secondary-700"
          />
        );
      })}

      {/* Bars */}
      {barSpecs.map((spec) => {
        const rx = Math.min(barRadius, spec.width / 2, spec.height / 2);
        const key = `${spec.seriesId}-${spec.category}`;
        if (isHorizontal) {
          return (
            <rect
              key={key}
              x={spec.x}
              y={spec.y}
              width={spec.width}
              height={spec.height}
              rx={rx}
              fill={spec.color}
              className={cn("chart-bar-h", animateOnMount && "chart-bar-animate")}
              onMouseMove={(e) => handleBarHover(e, spec.category)}
              onMouseLeave={() => setTooltip(null)}
            />
          );
        }
        return (
          <rect
            key={key}
            x={spec.x}
            y={spec.y}
            width={spec.width}
            height={spec.height}
            rx={rx}
            fill={spec.color}
            className={cn("chart-bar-v", animateOnMount && "chart-bar-animate")}
            onMouseMove={(e) => handleBarHover(e, spec.category)}
            onMouseLeave={() => setTooltip(null)}
          />
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

      {/* Y ticks and labels */}
      {!isHorizontal &&
        yTicks.map((tick) => {
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

      {/* X ticks (numeric) for horizontal orientation */}
      {isHorizontal &&
        yTicks.map((tick) => {
          const x = yScale(tick);
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

      {/* Category labels */}
      {categories.map((cat, gi) => {
        if (isHorizontal) {
          const y = dim.plotTop + (gi + 0.5) * catBandHeight;
          return (
            <text
              key={cat}
              x={dim.plotLeft - 6}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={10}
              fill="currentColor"
              className="text-secondary-500 dark:text-secondary-400"
            >
              {cat}
            </text>
          );
        }
        const x = dim.plotLeft + (gi + 0.5) * catBandWidth;
        return (
          <text
            key={cat}
            x={x}
            y={dim.plotBottom + 14}
            textAnchor="middle"
            fontSize={10}
            fill="currentColor"
            className="text-secondary-500 dark:text-secondary-400"
          >
            {cat}
          </text>
        );
      })}

      {yAxis?.label && !isHorizontal && (
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
          <div className="mb-1 font-medium text-primary-200">{tooltip.category}</div>
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
