import React from "react";
import { LineChart } from "../../src";
import { Section, PageTitle, CodeExample, PropTable } from "./helpers";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const series1 = {
  id: "revenue",
  name: "Revenue",
  data: months.map((m, i) => ({ x: m, y: [42, 58, 61, 79, 87, 102, 119, 113, 98, 77, 65, 88][i] })),
};
const series2 = {
  id: "costs",
  name: "Costs",
  data: months.map((m, i) => ({ x: m, y: [38, 41, 47, 52, 59, 68, 73, 71, 65, 58, 54, 62][i] })),
};
const series3 = {
  id: "profit",
  name: "Profit",
  data: months.map((m, i) => ({ x: m, y: [4, 17, 14, 27, 28, 34, 46, 42, 33, 19, 11, 26][i] })),
};

const tempSeries = {
  id: "temp",
  name: "Temperature (°C)",
  data: months.map((m, i) => ({ x: m, y: [-3, -1, 5, 12, 18, 24, 27, 26, 20, 13, 5, -1][i] })),
};
const rainSeries = {
  id: "rain",
  name: "Rainfall (mm)",
  data: months.map((m, i) => ({ x: m, y: [52, 45, 62, 78, 89, 71, 44, 38, 55, 82, 90, 61][i] })),
};

export default function LineChartPage() {
  return (
    <div className="max-w-4xl space-y-10">
      <PageTitle>LineChart</PageTitle>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">
        Pure SVG line chart with responsive layout, multi-series support, smooth curves, area fill,
        dual Y-axis, interactive tooltip, and animated entrance. Hover or touch to explore data.
      </p>

      {/* 1. Basic */}
      <Section title="Basic Line Chart">
        <LineChart
          title="Monthly Revenue vs Costs"
          series={[series1, series2]}
          height={260}
          yAxis={{ label: "USD (K)" }}
        />
        <CodeExample
          code={`<LineChart
  title="Monthly Revenue vs Costs"
  series={[
    { id: "revenue", name: "Revenue", data: [...] },
    { id: "costs", name: "Costs", data: [...] },
  ]}
  height={260}
  yAxis={{ label: "USD (K)" }}
/>`}
        />
      </Section>

      {/* 2. Area chart */}
      <Section title="Area Chart">
        <LineChart
          title="Revenue, Costs & Profit (area fill)"
          series={[series1, series2, series3]}
          area
          height={260}
        />
        <CodeExample
          code={`<LineChart
  series={[revenueSeries, costsSeries, profitSeries]}
  area
  height={260}
/>`}
        />
      </Section>

      {/* 3. Smooth curves */}
      <Section title="Smooth Bezier Curves">
        <LineChart
          title="Revenue — Smooth Curves"
          series={[series1, series3]}
          smooth
          showDots={false}
          height={240}
          strokeWidth={2.5}
        />
        <CodeExample
          code={`<LineChart
  series={[...]}
  smooth
  showDots={false}
  strokeWidth={2.5}
/>`}
        />
      </Section>

      {/* 4. Dual Y-axis */}
      <Section title="Dual Y-Axis — Temperature & Rainfall">
        <LineChart
          title="Climate Data"
          series={[tempSeries, rainSeries]}
          height={260}
          yAxis={{ label: "Temperature (°C)", format: (v) => `${v}°` }}
          y2Axis={{ label: "Rainfall (mm)", format: (v) => `${v}mm` }}
          y2Series={["rain"]}
          smooth
        />
        <CodeExample
          code={`<LineChart
  series={[tempSeries, rainSeries]}
  yAxis={{ label: "Temperature (°C)", format: (v) => \`\${v}°\` }}
  y2Axis={{ label: "Rainfall (mm)", format: (v) => \`\${v}mm\` }}
  y2Series={["rain"]}
  smooth
/>`}
        />
      </Section>

      {/* 5. Legend interactions */}
      <Section title="Legend Interaction">
        <div className="mb-3 rounded-lg border border-primary-200 bg-primary-50 p-3 text-xs text-primary-700 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-300">
          💡 Click legend items below to show/hide individual series. Touch on mobile to interact
          with the tooltip.
        </div>
        <LineChart
          title="Click a legend item to toggle series visibility"
          series={[series1, series2, series3]}
          legendPosition="right"
          height={260}
        />
        <CodeExample
          code={`<LineChart
  series={[...]}
  legendPosition="right"
  legend={true}
/>`}
        />
      </Section>

      {/* 6. Custom axis formatting */}
      <Section title="Custom Axis Formatting">
        <LineChart
          title="Revenue with custom axis"
          series={[series1]}
          height={240}
          yAxis={{
            label: "Revenue",
            min: 0,
            max: 150,
            tickCount: 6,
            format: (v) => `$${v}K`,
            gridLines: true,
          }}
        />
        <CodeExample
          code={`<LineChart
  series={[...]}
  yAxis={{
    label: "Revenue",
    min: 0,
    max: 150,
    tickCount: 6,
    format: (v) => \`$\${v}K\`,
    gridLines: true,
  }}
/>`}
        />
      </Section>

      {/* 7. No data / empty state */}
      <Section title="Empty State">
        <LineChart
          title="Empty Chart"
          series={[]}
          height={200}
          emptyText="No sales data available for this period"
        />
        <CodeExample
          code={`<LineChart
  series={[]}
  emptyText="No sales data available for this period"
/>`}
        />
      </Section>

      {/* Props table */}
      <Section title="Props">
        <PropTable
          rows={[
            {
              prop: "series",
              type: "ChartSeries[]",
              required: true,
              description: "Array of data series to render.",
            },
            {
              prop: "xAxis",
              type: "AxisConfig",
              description: "X axis configuration (label, format, tickCount).",
            },
            { prop: "yAxis", type: "AxisConfig", description: "Primary Y axis configuration." },
            {
              prop: "y2Axis",
              type: "AxisConfig",
              description: "Secondary Y axis on the right side.",
            },
            {
              prop: "y2Series",
              type: "string[]",
              default: "[]",
              description: "Series IDs mapped to the secondary Y axis.",
            },
            {
              prop: "smooth",
              type: "boolean",
              default: "false",
              description: "Render smooth bezier curves.",
            },
            {
              prop: "showDots",
              type: "boolean",
              default: "true",
              description: "Show data point dot markers.",
            },
            {
              prop: "area",
              type: "boolean",
              default: "false",
              description: "Fill area under each line.",
            },
            {
              prop: "strokeWidth",
              type: "number",
              default: "2",
              description: "Line stroke width in px.",
            },
            { prop: "height", type: "number", default: "300", description: "Chart height in px." },
            { prop: "legend", type: "boolean", default: "true", description: "Show legend." },
            {
              prop: "legendPosition",
              type: '"top" | "bottom" | "left" | "right"',
              default: '"bottom"',
              description: "Legend placement.",
            },
            {
              prop: "animateOnMount",
              type: "boolean",
              default: "true",
              description: "Animate lines on first render.",
            },
            {
              prop: "emptyText",
              type: "string",
              default: '"No data to display"',
              description: "Text shown when series is empty.",
            },
          ]}
        />
      </Section>
    </div>
  );
}
