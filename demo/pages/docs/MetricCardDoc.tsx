import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const metricCardProps: PropRow[] = [
  { prop: "value", type: "number", required: true, description: "Target number to count up to" },
  { prop: "title", type: "string", required: true, description: "Card heading" },
  {
    prop: "from",
    type: "number",
    default: "0",
    description: "Starting value for counter animation",
  },
  { prop: "decimals", type: "number", default: "0", description: "Decimal places to display" },
  {
    prop: "animateDuration",
    type: "number",
    default: "1200",
    description: "Animation duration in milliseconds",
  },
  {
    prop: "formatter",
    type: "(value: number) => string",
    description: "Custom number formatter; overrides decimals",
  },
  { prop: "prefix", type: "ReactNode", description: "Static prefix before the animated number" },
  { prop: "suffix", type: "ReactNode", description: "Static suffix after the animated number" },
  { prop: "icon", type: "ReactNode", description: "Top-right accent icon" },
  { prop: "trend", type: `"up" | "down" | "flat"`, description: "Trend arrow direction" },
  { prop: "trendValue", type: "string", description: "Trend label (e.g. '+5.2%')" },
  { prop: "description", type: "string", description: "Caption below the trend" },
  {
    prop: "intent",
    type: `"primary" | "success" | "danger" | "warning"`,
    default: `"primary"`,
    description: "Color accent (gradient bar + icon color)",
  },
  {
    prop: "size",
    type: `"sm" | "md" | "lg"`,
    default: `"md"`,
    description: "Card padding and font size",
  },
  { prop: "className", type: "string", description: "Extra class names" },
];

const importCode = `import { MetricCard } from "@jacshuo/onyx";
import type { MetricCardProps } from "@jacshuo/onyx";`;

const usageCode = `import { MetricCard } from "@jacshuo/onyx";
import { DollarSign, ShoppingCart } from "lucide-react";

// Basic animated counter
<MetricCard
  title="Monthly Revenue"
  value={128500}
  prefix="$"
  formatter={(v) => v.toLocaleString("en-US")}
  trend="up"
  trendValue="+8.3%"
  description="vs last month"
  icon={<DollarSign />}
  intent="success"
/>

// Custom animation duration
<MetricCard
  title="Orders"
  value={3420}
  animateDuration={2000}
  icon={<ShoppingCart />}
  intent="primary"
/>

// Decimal values
<MetricCard
  title="Conversion Rate"
  value={3.74}
  decimals={2}
  suffix="%"
  trend="down"
  trendValue="-0.2%"
  intent="danger"
/>`;

const typeCode = `import type { MetricCardProps } from "@jacshuo/onyx";

interface MetricCardProps extends VariantProps<typeof metricCardVariants> {
  value: number;
  title: string;
  from?: number;
  decimals?: number;
  animateDuration?: number;
  formatter?: (value: number) => string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "flat";
  trendValue?: string;
  description?: string;
  className?: string;
}`;

export default function MetricCardDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>MetricCard</PageTitle>

      <Section title="Import">
        <CodeExample code={importCode} />
      </Section>

      <Section title="Description">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          A dashboard card with an <strong>animated number counter</strong> driven by
          requestAnimationFrame and an easeOutQuart easing curve. The decorative top-gradient border
          shifts color based on <code>intent</code>. Supports custom formatters, decimal places,
          trend arrows, and prefix/suffix decorations.
        </p>
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Types">
        <CodeExample code={typeCode} />
      </Section>

      <Section title="Props">
        <PropTable rows={metricCardProps} />
      </Section>
    </div>
  );
}
