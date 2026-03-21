import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const scatterProps: PropRow[] = [
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
  { prop: "yAxis", type: "AxisConfig", description: "Y-axis configuration." },
  {
    prop: "dotRadius",
    type: "number",
    default: "5",
    description: "Radius in px of each data point dot.",
  },
  {
    prop: "dotOpacity",
    type: "number",
    default: "0.75",
    description: "Fill opacity for dots (0–1).",
  },
  {
    prop: "clusters",
    type: "boolean",
    default: "false",
    description: "Draw a faint bounding ellipse around each series' point cloud.",
  },
  {
    prop: "jitter",
    type: "boolean",
    default: "false",
    description: "Apply a small deterministic random offset to dots to reduce overlap.",
  },
  {
    prop: "jitterAmount",
    type: "number",
    default: "4",
    description: "Maximum jitter displacement in px.",
  },
  {
    prop: "linkedLines",
    type: "boolean",
    default: "false",
    description: "Draw polylines connecting same-series points in ascending X order.",
  },
  { prop: "title", type: "string", description: "Optional chart title rendered above the SVG." },
  { prop: "height", type: "number", default: "300", description: "Chart height in px." },
  { prop: "className", type: "string", description: "Extra CSS classes on the root container." },
  {
    prop: "legend",
    type: "boolean",
    default: "false",
    description: "Show an interactive legend. Clicking a label toggles the series visibility.",
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
    description: "Dots fade in with an opacity animation on first mount.",
  },
  {
    prop: "emptyText",
    type: "string",
    default: `"No data"`,
    description: "Placeholder text shown when all series are empty or hidden.",
  },
];

const usageCode = `import { ScatterChart } from "@jacshuo/onyx";

const series = [
  {
    id: "groupA",
    name: "Group A",
    data: [
      { x: 10, y: 22 },
      { x: 14, y: 31 },
      { x: 18, y: 28 },
      { x: 23, y: 41 },
      { x: 27, y: 38 },
      { x: 31, y: 50 },
    ],
  },
  {
    id: "groupB",
    name: "Group B",
    data: [
      { x: 5,  y: 60 },
      { x: 11, y: 52 },
      { x: 16, y: 47 },
      { x: 21, y: 55 },
      { x: 26, y: 43 },
      { x: 33, y: 37 },
    ],
  },
];

export function Example() {
  return (
    <ScatterChart
      title="Correlation Analysis"
      series={series}
      dotRadius={6}
      clusters
      legend
      legendPosition="top"
      height={300}
    />
  );
}`;

const jitterCode = `import { ScatterChart } from "@jacshuo/onyx";

// Use jitter + linkedLines to visualise a data trend with dense points.
export function JitteredExample() {
  return (
    <ScatterChart
      title="Response Times"
      series={denseSeries}
      dotRadius={4}
      dotOpacity={0.6}
      jitter
      jitterAmount={6}
      linkedLines
      xAxis={{ label: "Request #" }}
      yAxis={{ label: "ms" }}
      height={320}
    />
  );
}`;

const typesCode = `import type { ChartSeries, AxisConfig } from "@jacshuo/onyx";

// ScatterDataPoint
interface ScatterDataPoint {
  x:       number;
  y:       number;
  label?:  string;  // tooltip label
  r?:      number;  // point radius override
}

// ChartSeries (for ScatterChart)
interface ChartSeries {
  id:      string;
  name:    string;
  color?:  string;                 // defaults to palette color
  data:    ScatterDataPoint[];
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

export default function ScatterChartDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>ScatterChart</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { ScatterChart } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={scatterProps} />
      </Section>

      <Section title="Basic Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Jitter & Linked Lines">
        <CodeExample code={jitterCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>
    </div>
  );
}
