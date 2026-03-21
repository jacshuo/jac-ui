import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const statProps: PropRow[] = [
  { prop: "title", type: "string", required: true, description: "Label above the value" },
  {
    prop: "value",
    type: "ReactNode",
    required: true,
    description: "Primary statistic (number, money, %…)",
  },
  { prop: "prefix", type: "ReactNode", description: "Rendered before value (e.g. '$')" },
  { prop: "suffix", type: "ReactNode", description: "Rendered after value (e.g. '%')" },
  { prop: "icon", type: "ReactNode", description: "Decorative icon in the top-right corner" },
  { prop: "trend", type: `"up" | "down" | "flat"`, description: "Trend arrow direction" },
  { prop: "trendValue", type: "string", description: "Trend label (e.g. '+12.5%')" },
  { prop: "description", type: "string", description: "Secondary caption below the trend row" },
  {
    prop: "intent",
    type: `"primary" | "success" | "danger" | "warning"`,
    default: `"primary"`,
    description: "Accent color",
  },
  {
    prop: "size",
    type: `"sm" | "md" | "lg"`,
    default: `"md"`,
    description: "Card padding and font size",
  },
  { prop: "className", type: "string", description: "Extra class names merged via cn()" },
];

const importCode = `import { Stat } from "@jacshuo/onyx";
import type { StatProps } from "@jacshuo/onyx";`;

const usageCode = `import { Stat } from "@jacshuo/onyx";
import { Users } from "lucide-react";

<Stat
  title="Total Users"
  value="24,981"
  prefix="$"
  trend="up"
  trendValue="+12.5%"
  description="vs last 30 days"
  icon={<Users />}
  intent="success"
/>

<Stat
  title="Churn Rate"
  value="4.3"
  suffix="%"
  trend="down"
  trendValue="-0.8%"
  intent="danger"
/>`;

const typeCode = `import type { StatProps, StatTrend } from "@jacshuo/onyx";

type StatTrend = "up" | "down" | "flat";

interface StatProps extends VariantProps<typeof statVariants> {
  title: string;
  value: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  icon?: React.ReactNode;
  trend?: StatTrend;
  trendValue?: string;
  description?: string;
  className?: string;
}`;

export default function StatDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Stat</PageTitle>

      <Section title="Import">
        <CodeExample code={importCode} />
      </Section>

      <Section title="Description">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          A static data-display card for dashboard metrics. Supports prefix/suffix units, trend
          arrows with color coding (green up / red down), a description caption, and a decorative
          icon. Values are rendered as-is; for animated counters see <strong>MetricCard</strong>.
        </p>
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Types">
        <CodeExample code={typeCode} />
      </Section>

      <Section title="Props">
        <PropTable rows={statProps} />
      </Section>
    </div>
  );
}
