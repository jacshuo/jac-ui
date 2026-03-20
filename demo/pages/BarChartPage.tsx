import React from "react";
import { BarChart } from "../../src";
import { Section, PageTitle, CodeExample, PropTable } from "./helpers";

const categories = ["Q1", "Q2", "Q3", "Q4"];

const productA = {
  id: "product-a",
  name: "Product A",
  data: categories.map((q, i) => ({ x: q, y: [120, 145, 162, 178][i] })),
};
const productB = {
  id: "product-b",
  name: "Product B",
  data: categories.map((q, i) => ({ x: q, y: [95, 88, 110, 125][i] })),
};
const productC = {
  id: "product-c",
  name: "Product C",
  data: categories.map((q, i) => ({ x: q, y: [60, 72, 68, 85][i] })),
};

const departments = ["Engineering", "Marketing", "Sales", "Support", "Design"];
const headcount = {
  id: "headcount",
  name: "Headcount",
  data: departments.map((d, i) => ({ x: d, y: [42, 18, 31, 25, 14][i] })),
};

export default function BarChartPage() {
  return (
    <div className="max-w-4xl space-y-10">
      <PageTitle>BarChart</PageTitle>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">
        Pure SVG bar chart supporting grouped and stacked modes, vertical and horizontal
        orientations, multi-series, interactive tooltip, and smooth mount animation.
      </p>

      {/* 1. Grouped bar chart */}
      <Section title="Grouped Bar Chart (Vertical)">
        <BarChart
          title="Quarterly Sales by Product"
          series={[productA, productB, productC]}
          height={280}
          yAxis={{ label: "Units sold" }}
          xAxis={{ label: "Quarter" }}
        />
        <CodeExample
          code={`<BarChart
  title="Quarterly Sales by Product"
  series={[productA, productB, productC]}
  height={280}
  yAxis={{ label: "Units sold" }}
  xAxis={{ label: "Quarter" }}
/>`}
        />
      </Section>

      {/* 2. Stacked bars */}
      <Section title="Stacked Bars">
        <BarChart
          title="Quarterly Sales (Stacked)"
          series={[productA, productB, productC]}
          grouped={false}
          height={280}
        />
        <CodeExample
          code={`<BarChart
  series={[productA, productB, productC]}
  grouped={false}
  height={280}
/>`}
        />
      </Section>

      {/* 3. Horizontal */}
      <Section title="Horizontal Orientation">
        <BarChart
          title="Department Headcount"
          series={[headcount]}
          orientation="horizontal"
          height={260}
          xAxis={{ label: "Employees" }}
        />
        <CodeExample
          code={`<BarChart
  series={[headcountSeries]}
  orientation="horizontal"
  height={260}
  xAxis={{ label: "Employees" }}
/>`}
        />
      </Section>

      {/* 4. Single series */}
      <Section title="Single Series">
        <BarChart
          title="Product A — Quarterly Revenue"
          series={[productA]}
          height={240}
          barRadius={6}
          yAxis={{ format: (v) => `$${v}K` }}
        />
        <CodeExample
          code={`<BarChart
  series={[productA]}
  barRadius={6}
  yAxis={{ format: (v) => \`$\${v}K\` }}
/>`}
        />
      </Section>

      {/* 5. Rounded bars — custom padding */}
      <Section title="Custom Bar Radius & Padding">
        <BarChart
          title="Sales with custom styling"
          series={[productA, productB]}
          height={260}
          barRadius={8}
          barPadding={0.1}
          groupPadding={0.4}
        />
        <CodeExample
          code={`<BarChart
  series={[productA, productB]}
  barRadius={8}
  barPadding={0.1}
  groupPadding={0.4}
/>`}
        />
      </Section>

      {/* 6. Legend interaction */}
      <Section title="Legend Interaction">
        <div className="mb-3 rounded-lg border border-primary-200 bg-primary-50 p-3 text-xs text-primary-700 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-300">
          💡 Click legend items to show/hide an entire series. Hover a bar to see its tooltip.
        </div>
        <BarChart
          title="Toggle series via legend"
          series={[productA, productB, productC]}
          legendPosition="top"
          height={260}
        />
      </Section>

      {/* 7. Empty state */}
      <Section title="Empty State">
        <BarChart series={[]} height={200} emptyText="No quarterly data available" />
        <CodeExample
          code={`<BarChart
  series={[]}
  emptyText="No quarterly data available"
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
              prop: "orientation",
              type: '"vertical" | "horizontal"',
              default: '"vertical"',
              description: "Bar direction.",
            },
            {
              prop: "grouped",
              type: "boolean",
              default: "true",
              description: "true = side-by-side bars; false = stacked.",
            },
            {
              prop: "barRadius",
              type: "number",
              default: "4",
              description: "Corner radius for bar caps in px.",
            },
            {
              prop: "barPadding",
              type: "number",
              default: "0.2",
              description: "Gap between bars within a group (0–1).",
            },
            {
              prop: "groupPadding",
              type: "number",
              default: "0.3",
              description: "Gap between category groups (0–1).",
            },
            { prop: "xAxis", type: "AxisConfig", description: "X axis configuration." },
            { prop: "yAxis", type: "AxisConfig", description: "Y axis configuration." },
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
              description: "Animate bars on first render.",
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
