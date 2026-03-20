import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const baseProps: PropRow[] = [
  {
    prop: "series",
    type: "ChartSeries[]",
    required: true,
    description:
      "Array of data series to render. Each series has an id, name, color, and data array of {x, y} points.",
  },
  {
    prop: "xAxis",
    type: "AxisConfig",
    description: "X-axis configuration (label, min, max, tickCount, format, gridLines).",
  },
  { prop: "yAxis", type: "AxisConfig", description: "Primary Y-axis configuration." },
  {
    prop: "y2Axis",
    type: "AxisConfig",
    description: "Secondary (right-side) Y-axis configuration.",
  },
  {
    prop: "y2Series",
    type: "string[]",
    description: "Series IDs that map to the secondary Y axis.",
  },
  {
    prop: "orientation",
    type: `"vertical" | "horizontal"`,
    default: `"vertical"`,
    description: "Vertical = categories on X, values on Y. Horizontal = flipped axes.",
  },
  {
    prop: "grouped",
    type: "boolean",
    default: "true",
    description:
      "When true bars for each category are placed side-by-side; when false they are stacked.",
  },
  {
    prop: "barRadius",
    type: "number",
    default: "4",
    description: "Corner radius in px applied to the leading edge of each bar.",
  },
  {
    prop: "barPadding",
    type: "number",
    default: "0.15",
    description: "Gap ratio between individual bars within a group (0–1).",
  },
  {
    prop: "groupPadding",
    type: "number",
    default: "0.25",
    description: "Gap ratio between category groups (0–1).",
  },
  { prop: "title", type: "string", description: "Optional chart title rendered above the SVG." },
  { prop: "height", type: "number", default: "300", description: "Chart height in px." },
  { prop: "className", type: "string", description: "Extra CSS classes on the root container." },
  {
    prop: "legend",
    type: "boolean",
    default: "false",
    description: "Show an interactive legend. Clicking a series label toggles its visibility.",
  },
  {
    prop: "legendPosition",
    type: `"top" | "bottom" | "left" | "right"`,
    default: `"bottom"`,
    description: "Placement of the legend relative to the chart.",
  },
  {
    prop: "animateOnMount",
    type: "boolean",
    default: "true",
    description: "Bars rise/extend in with a CSS animation when the chart first mounts.",
  },
  {
    prop: "emptyText",
    type: "string",
    default: `"No data"`,
    description: "Placeholder text shown when all series are empty or hidden.",
  },
];

const usageCode = `import { BarChart } from "@jacshuo/onyx";

const series = [
  {
    id: "revenue",
    name: "Revenue",
    data: [
      { x: "Q1", y: 42000 },
      { x: "Q2", y: 65000 },
      { x: "Q3", y: 58000 },
      { x: "Q4", y: 71000 },
    ],
  },
  {
    id: "costs",
    name: "Costs",
    data: [
      { x: "Q1", y: 28000 },
      { x: "Q2", y: 35000 },
      { x: "Q3", y: 31000 },
      { x: "Q4", y: 39000 },
    ],
  },
];

export function Example() {
  return (
    <BarChart
      title="Quarterly Financials"
      series={series}
      grouped
      barRadius={4}
      legend
      legendPosition="top"
      height={320}
    />
  );
}`;

const horizontalCode = `import { BarChart } from "@jacshuo/onyx";

const series = [
  {
    id: "score",
    name: "Score",
    data: [
      { x: "TypeScript", y: 92 },
      { x: "React",      y: 88 },
      { x: "CSS",        y: 74 },
      { x: "Node.js",   y: 65 },
    ],
  },
];

export function HorizontalExample() {
  return (
    <BarChart
      title="Skill Proficiency"
      series={series}
      orientation="horizontal"
      barRadius={6}
      height={260}
    />
  );
}`;

const typesCode = `import type { ChartSeries, AxisConfig } from "@jacshuo/onyx";

// ChartSeries
interface ChartSeries {
  id: string;
  name: string;
  color?: string;            // defaults to the palette colour
  data: ChartDataPoint[];
}

// ChartDataPoint
interface ChartDataPoint {
  x: number | string;        // category label or numeric value
  y: number;
  label?: string;            // custom tooltip label
}

// AxisConfig
interface AxisConfig {
  label?: string;            // axis title
  min?: number;
  max?: number;
  tickCount?: number;
  format?: (v: number | string) => string;
  gridLines?: boolean;
}`;

export default function BarChartDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>BarChart</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { BarChart } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={baseProps} />
      </Section>

      <Section title="Basic Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Horizontal Orientation">
        <CodeExample code={horizontalCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>
    </div>
  );
}
