import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const pieProps: PropRow[] = [
  {
    prop: "data",
    type: "PieSlice[]",
    required: true,
    description: "Array of slices. Each slice has an id, label, value, and optional color.",
  },
  {
    prop: "donut",
    type: "boolean",
    default: "false",
    description: "Render as a donut chart with a hollow centre.",
  },
  {
    prop: "donutThickness",
    type: "number",
    default: "0.55",
    description: "Inner radius ratio (0–1). Only applies when donut is true.",
  },
  {
    prop: "startAngle",
    type: "number",
    default: "-90",
    description: "Starting angle in degrees. -90 = top of the circle.",
  },
  { prop: "padAngle", type: "number", default: "0", description: "Gap between slices in degrees." },
  {
    prop: "labelType",
    type: `"none" | "percent" | "value" | "label" | "label+percent"`,
    default: `"percent"`,
    description: "Controls what text is rendered as a slice callout label.",
  },
  {
    prop: "centerLabel",
    type: "string",
    description: "Primary text rendered in the donut centre hole. Only applies when donut is true.",
  },
  {
    prop: "centerSubLabel",
    type: "string",
    description: "Secondary text rendered below centerLabel.",
  },
  {
    prop: "explodeOnHover",
    type: "boolean",
    default: "false",
    description: "Slice pops outward when hovered.",
  },
  {
    prop: "explodeOffset",
    type: "number",
    default: "12",
    description: "Distance in px a hovered slice moves outward.",
  },
  { prop: "title", type: "string", description: "Optional chart title rendered above the SVG." },
  { prop: "height", type: "number", default: "300", description: "Chart height in px." },
  { prop: "className", type: "string", description: "Extra CSS classes on the root container." },
  {
    prop: "legend",
    type: "boolean",
    default: "false",
    description: "Show an interactive legend. Clicking a label toggles the slice visibility.",
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
    description: "Slices sweep in with a CSS animation on first mount.",
  },
  {
    prop: "emptyText",
    type: "string",
    default: `"No data"`,
    description: "Placeholder text shown when the data array is empty.",
  },
];

const usageCode = `import { PieChart } from "@jacshuo/onyx";

const data = [
  { id: "direct",  label: "Direct",  value: 38 },
  { id: "organic", label: "Organic", value: 27 },
  { id: "social",  label: "Social",  value: 18 },
  { id: "email",   label: "Email",   value: 17 },
];

export function Example() {
  return (
    <PieChart
      title="Traffic Sources"
      data={data}
      labelType="label+percent"
      explodeOnHover
      legend
      legendPosition="bottom"
      height={320}
    />
  );
}`;

const donutCode = `import { PieChart } from "@jacshuo/onyx";

const storage = [
  { id: "photos",   label: "Photos",   value: 52 },
  { id: "videos",   label: "Videos",   value: 30 },
  { id: "docs",     label: "Documents", value: 12 },
  { id: "other",    label: "Other",    value: 6  },
];

export function DonutExample() {
  return (
    <PieChart
      title="Storage Breakdown"
      data={storage}
      donut
      donutThickness={0.6}
      centerLabel="94 GB"
      centerSubLabel="used"
      labelType="percent"
      legend
      height={320}
    />
  );
}`;

const typesCode = `import type { PieSlice } from "@jacshuo/onyx";

interface PieSlice {
  id: string;
  label: string;
  value: number;
  color?: string;   // hex or CSS colour; defaults to the palette colour
}`;

export default function PieChartDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>PieChart</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { PieChart } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={pieProps} />
      </Section>

      <Section title="Basic Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Donut with Centre Label">
        <CodeExample code={donutCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>
    </div>
  );
}
