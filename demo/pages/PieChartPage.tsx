import React from "react";
import { PieChart } from "../../src";
import { Section, PageTitle, CodeExample, PropTable } from "./helpers";

const marketData = [
  { id: "chrome", label: "Chrome", value: 65.4 },
  { id: "safari", label: "Safari", value: 18.9 },
  { id: "firefox", label: "Firefox", value: 7.2 },
  { id: "edge", label: "Edge", value: 4.8 },
  { id: "other", label: "Other", value: 3.7 },
];

const budgetData = [
  { id: "engineering", label: "Engineering", value: 450 },
  { id: "marketing", label: "Marketing", value: 180 },
  { id: "sales", label: "Sales", value: 220 },
  { id: "operations", label: "Operations", value: 130 },
];

const customColors = [
  { id: "design", label: "Design", value: 30, color: "var(--color-primary-500)" },
  { id: "dev", label: "Development", value: 55, color: "var(--color-success-500)" },
  { id: "qa", label: "QA", value: 15, color: "var(--color-warning-500)" },
];

export default function PieChartPage() {
  return (
    <div className="max-w-4xl space-y-10">
      <PageTitle>PieChart</PageTitle>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">
        Pure SVG pie and donut chart with animated slice entrance, hover explosion, configurable
        labels, donut center text, and interactive legend.
      </p>

      {/* 1. Basic pie */}
      <Section title="Basic Pie Chart">
        <PieChart title="Browser Market Share" data={marketData} height={300} labelType="percent" />
        <CodeExample
          code={`<PieChart
  title="Browser Market Share"
  data={[
    { id: "chrome", label: "Chrome", value: 65.4 },
    { id: "safari", label: "Safari", value: 18.9 },
    // ...
  ]}
  labelType="percent"
/>`}
        />
      </Section>

      {/* 2. Donut chart */}
      <Section title="Donut Chart with Center Label">
        <PieChart
          title="Q4 Budget Allocation"
          data={budgetData}
          donut
          donutThickness={0.55}
          centerLabel="$980K"
          centerSubLabel="Total Budget"
          height={300}
          labelType="label+percent"
        />
        <CodeExample
          code={`<PieChart
  data={budgetData}
  donut
  donutThickness={0.55}
  centerLabel="$980K"
  centerSubLabel="Total Budget"
  labelType="label+percent"
/>`}
        />
      </Section>

      {/* 3. No labels */}
      <Section title="No Labels (Clean)">
        <PieChart
          title="Clean Pie — Labels Hidden"
          data={marketData}
          labelType="none"
          height={280}
          padAngle={2}
        />
        <CodeExample
          code={`<PieChart
  data={marketData}
  labelType="none"
  padAngle={2}
/>`}
        />
      </Section>

      {/* 4. Label type comparison */}
      <Section title="Label Types">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          {(["percent", "value", "label", "label+percent"] as const).map((lt) => (
            <div
              key={lt}
              className="rounded-lg border border-primary-200 p-3 dark:border-primary-700"
            >
              <p className="mb-1 text-xs font-medium text-secondary-500">{`labelType="${lt}"`}</p>
              <PieChart
                data={marketData.slice(0, 3)}
                labelType={lt}
                height={200}
                legend={false}
                animateOnMount={false}
              />
            </div>
          ))}
        </div>
        <CodeExample
          code={`<PieChart data={slices} labelType="label+percent" />
<PieChart data={slices} labelType="value" />
<PieChart data={slices} labelType="label" />
<PieChart data={slices} labelType="none" />`}
        />
      </Section>

      {/* 5. Explode on hover */}
      <Section title="Explode on Hover">
        <div className="mb-3 rounded-lg border border-primary-200 bg-primary-50 p-3 text-xs text-primary-700 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-300">
          💡 Hover or touch a slice to see it pop outward. The tooltip shows value and percentage.
        </div>
        <PieChart
          title="Hover to explode slices"
          data={marketData}
          explodeOnHover
          explodeOffset={12}
          donut
          centerLabel="Market"
          height={300}
          labelType="none"
        />
        <CodeExample
          code={`<PieChart
  data={slices}
  explodeOnHover
  explodeOffset={12}
/>`}
        />
      </Section>

      {/* 6. Custom colors */}
      <Section title="Custom Slice Colors">
        <PieChart
          title="Time Allocation — Custom Colors"
          data={customColors}
          donut
          donutThickness={0.6}
          height={280}
          labelType="label+percent"
        />
        <CodeExample
          code={`const slices = [
  { id: "design", label: "Design", value: 30, color: "var(--color-primary-500)" },
  { id: "dev", label: "Development", value: 55, color: "var(--color-success-500)" },
  { id: "qa", label: "QA", value: 15, color: "var(--color-warning-500)" },
];
<PieChart data={slices} donut />`}
        />
      </Section>

      {/* 7. Legend interaction */}
      <Section title="Legend Interaction">
        <div className="mb-3 rounded-lg border border-primary-200 bg-primary-50 p-3 text-xs text-primary-700 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-300">
          💡 Click legend items to hide/show slices. The remaining slices redistribute in place.
        </div>
        <PieChart
          title="Click legend to toggle slices"
          data={marketData}
          legendPosition="right"
          height={280}
          labelType="none"
        />
      </Section>

      {/* 8. Empty state */}
      <Section title="Empty State">
        <PieChart data={[]} height={200} emptyText="No market data available" />
        <CodeExample code={`<PieChart data={[]} emptyText="No market data available" />`} />
      </Section>

      {/* Props */}
      <Section title="Props">
        <PropTable
          rows={[
            {
              prop: "data",
              type: "PieSlice[]",
              required: true,
              description: "Array of slices with id, label, value, optional color.",
            },
            {
              prop: "donut",
              type: "boolean",
              default: "false",
              description: "Render as a donut chart.",
            },
            {
              prop: "donutThickness",
              type: "number",
              default: "0.5",
              description: "Inner radius ratio (0–1, donut mode only).",
            },
            {
              prop: "startAngle",
              type: "number",
              default: "-90",
              description: "Starting angle in degrees (-90 = top).",
            },
            {
              prop: "padAngle",
              type: "number",
              default: "1",
              description: "Gap between slices in degrees.",
            },
            {
              prop: "labelType",
              type: '"none" | "percent" | "value" | "label" | "label+percent"',
              default: '"percent"',
              description: "Controls what text appears near each slice.",
            },
            {
              prop: "centerLabel",
              type: "string",
              description: "Primary text in the donut center hole.",
            },
            {
              prop: "centerSubLabel",
              type: "string",
              description: "Secondary text below centerLabel.",
            },
            {
              prop: "explodeOnHover",
              type: "boolean",
              default: "true",
              description: "Slice pops outward on hover.",
            },
            {
              prop: "explodeOffset",
              type: "number",
              default: "8",
              description: "Outward offset in px for exploded slices.",
            },
            { prop: "height", type: "number", default: "300", description: "Chart height in px." },
            { prop: "legend", type: "boolean", default: "true", description: "Show legend." },
            {
              prop: "legendPosition",
              type: '"top" | "bottom" | "left" | "right"',
              default: '"bottom"',
              description: "Legend placement.",
            },
          ]}
        />
      </Section>
    </div>
  );
}
