import React, { useState } from "react";
import { MetricCard } from "../../src";
import { Section, PageTitle, CodeExample, PropTable } from "./helpers";
import { Users, DollarSign, ShoppingCart, Activity, TrendingUp, Package } from "lucide-react";

const basicCode = `<MetricCard
  title="Total Revenue"
  value={128940}
  prefix="$"
  formatter={(v) => v.toLocaleString("en-US", { maximumFractionDigits: 0 })}
  icon={<DollarSign />}
  trend="up"
  trendValue="+14.2%"
  description="vs last quarter"
  animateDuration={1500}
/>`;

const intentCode = `<MetricCard title="Users" value={8294} intent="primary" icon={<Users />} />
<MetricCard title="Revenue" value={94200} prefix="$" intent="success" icon={<DollarSign />} />
<MetricCard title="Failed" value={42} intent="danger" icon={<Activity />} />
<MetricCard title="Pending" value={123} intent="warning" icon={<Package />} />`;

const formatterCode = `<MetricCard
  title="Conversion Rate"
  value={3.78}
  decimals={2}
  suffix="%"
  animateDuration={800}
/>
<MetricCard
  title="Revenue"
  value={128940}
  formatter={(v) => "$" + v.toLocaleString("en-US", { maximumFractionDigits: 0 })}
  animateDuration={2000}
/>`;

const propRows = [
  { prop: "title", type: "string", required: true, description: "Card heading label" },
  {
    prop: "value",
    type: "number",
    required: true,
    description: "Target numeric value to animate to",
  },
  { prop: "from", type: "number", default: "0", description: "Starting value for the animation" },
  {
    prop: "decimals",
    type: "number",
    default: "0",
    description: "Decimal places in displayed value",
  },
  { prop: "prefix", type: "ReactNode", description: "Displayed before the value" },
  { prop: "suffix", type: "ReactNode", description: "Displayed after the value" },
  {
    prop: "formatter",
    type: "(v: number) => string",
    description: "Custom number formatter — overrides decimals",
  },
  {
    prop: "animateDuration",
    type: "number",
    default: "1200",
    description: "Counter animation duration in ms",
  },
  { prop: "icon", type: "ReactNode", description: "Icon in the card corner" },
  { prop: "trend", type: `"up" | "down" | "neutral"`, description: "Trend direction" },
  { prop: "trendValue", type: "string", description: "Trend label (e.g. '+12%')" },
  { prop: "description", type: "string", description: "Secondary text below the trend" },
  {
    prop: "intent",
    type: `"primary" | "success" | "danger" | "warning"`,
    default: `"primary"`,
    description: "Border and icon accent color",
  },
];

export default function MetricCardPage() {
  const [key, setKey] = useState(0);

  return (
    <div className="space-y-8">
      <PageTitle>MetricCard</PageTitle>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">
        Dashboard metric card with a smooth number counter animation and trend indicator. The
        counter runs an easeOutQuart animation from{" "}
        <code className="rounded bg-primary-100 px-1 py-0.5 text-xs dark:bg-primary-800">from</code>{" "}
        to{" "}
        <code className="rounded bg-primary-100 px-1 py-0.5 text-xs dark:bg-primary-800">
          value
        </code>{" "}
        on mount (or when{" "}
        <code className="rounded bg-primary-100 px-1 py-0.5 text-xs dark:bg-primary-800">
          value
        </code>{" "}
        changes).
      </p>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          className="rounded-lg border border-primary-300 px-3 py-1.5 text-sm text-primary-700 hover:bg-primary-50 dark:border-primary-600 dark:text-primary-300 dark:hover:bg-primary-800"
        >
          ↺ Re-animate
        </button>
      </div>

      <Section title="Basic">
        <div key={key} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Total Revenue"
            value={128940}
            formatter={(v) => "$" + v.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            icon={<DollarSign />}
            trend="up"
            trendValue="+14.2%"
            description="vs last quarter"
            animateDuration={1500}
          />
          <MetricCard
            title="Active Users"
            value={8294}
            icon={<Users />}
            intent="primary"
            trend="up"
            trendValue="+4.1%"
            description="this week"
            animateDuration={1200}
          />
          <MetricCard
            title="Orders"
            value={1847}
            icon={<ShoppingCart />}
            intent="success"
            trend="down"
            trendValue="-2.3%"
            description="vs yesterday"
            animateDuration={900}
          />
        </div>
        <CodeExample code={basicCode} />
      </Section>

      <Section title="Intents">
        <div key={`${key}-i`} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Users" value={8294} intent="primary" icon={<Users />} />
          <MetricCard
            title="Revenue"
            value={94200}
            formatter={(v) => `$${(v / 1000).toFixed(1)}k`}
            intent="success"
            icon={<DollarSign />}
          />
          <MetricCard title="Errors" value={42} intent="danger" icon={<Activity />} />
          <MetricCard title="Pending" value={123} intent="warning" icon={<Package />} />
        </div>
        <CodeExample code={intentCode} />
      </Section>

      <Section title="Custom formatters">
        <div key={`${key}-f`} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MetricCard
            title="Conversion Rate"
            value={3.78}
            decimals={2}
            suffix="%"
            animateDuration={800}
            icon={<TrendingUp />}
            trend="up"
            trendValue="+0.4%"
          />
          <MetricCard
            title="Revenue"
            value={128940}
            formatter={(v) => "$" + v.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            animateDuration={2000}
            icon={<DollarSign />}
            intent="success"
            trend="up"
            trendValue="+14.2%"
            description="annual total"
          />
        </div>
        <CodeExample code={formatterCode} />
      </Section>

      <Section title="Props">
        <PropTable rows={propRows} />
      </Section>
    </div>
  );
}
