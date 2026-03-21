import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const lineProps: PropRow[] = [
  {
    prop: "series",
    type: "ChartSeries[]",
    required: true,
    description:
      "Array of data series. Each series has an id, name, color, and data array of {x, y} points.",
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
    prop: "smooth",
    type: "boolean",
    default: "false",
    description: "Render smooth Catmull-Rom curves instead of straight polylines.",
  },
  {
    prop: "showDots",
    type: "boolean",
    default: "false",
    description: "Render a dot marker at each data point.",
  },
  {
    prop: "area",
    type: "boolean",
    default: "false",
    description: "Fill the area beneath each line with a semi-transparent colour.",
  },
  { prop: "strokeWidth", type: "number", default: "2", description: "Line stroke width in px." },
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
    description: "Lines draw in with a path-length animation when the chart first mounts.",
  },
  {
    prop: "emptyText",
    type: "string",
    default: `"No data"`,
    description: "Placeholder text shown when all series are empty or hidden.",
  },
];

const usageCode = `import { LineChart } from "@jacshuo/onyx";

const series = [
  {
    id: "users",
    name: "Active Users",
    data: [
      { x: "Jan", y: 1200 },
      { x: "Feb", y: 1900 },
      { x: "Mar", y: 1500 },
      { x: "Apr", y: 2300 },
      { x: "May", y: 2800 },
      { x: "Jun", y: 3200 },
    ],
  },
  {
    id: "sessions",
    name: "Sessions",
    data: [
      { x: "Jan", y: 3100 },
      { x: "Feb", y: 4400 },
      { x: "Mar", y: 3900 },
      { x: "Apr", y: 5200 },
      { x: "May", y: 6100 },
      { x: "Jun", y: 7500 },
    ],
  },
];

export function Example() {
  return (
    <LineChart
      title="Monthly Engagement"
      series={series}
      smooth
      area
      showDots
      legend
      legendPosition="top"
      height={300}
    />
  );
}`;

const dualAxisCode = `import { LineChart } from "@jacshuo/onyx";

// Render one series on the primary Y axis and another on a secondary axis
// for data with very different value ranges.

export function DualAxisExample() {
  return (
    <LineChart
      title="Revenue vs Conversion Rate"
      series={[
        { id: "revenue",    name: "Revenue ($)",       data: revenueData },
        { id: "conversion", name: "Conversion Rate (%)", data: conversionData },
      ]}
      y2Series={["conversion"]}
      yAxis={{ label: "Revenue ($)" }}
      y2Axis={{ label: "Rate (%)", max: 100 }}
      smooth
      legend
      height={320}
    />
  );
}`;

const typesCode = `import type { ChartSeries, AxisConfig } from "@jacshuo/onyx";

// ChartSeries
interface ChartSeries {
  id:      string;
  name:    string;
  color?:  string;           // defaults to palette color
  data:    ChartDataPoint[];
}

// ChartDataPoint
interface ChartDataPoint {
  x:       number | string;  // category label or numeric value
  y:       number;
  label?:  string;           // custom tooltip label
}

// AxisConfig
interface AxisConfig {
  label?:      string;
  min?:        number;
  max?:        number;
  tickCount?:  number;
  format?:     (v: number | string) => string;
  gridLines?:  boolean;
}`;

export default function LineChartDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>LineChart</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { LineChart } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={lineProps} />
      </Section>

      <Section title="Basic Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Dual Y Axis">
        <CodeExample code={dualAxisCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>
    </div>
  );
}
