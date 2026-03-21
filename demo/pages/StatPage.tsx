import React from "react";
import { Stat } from "../../src";
import { Section, PageTitle, CodeExample, PropTable } from "./helpers";
import { Users, ShoppingCart, TrendingUp, DollarSign, Package, Activity } from "lucide-react";

const basicCode = `<Stat
  title="Total Revenue"
  value="$48,295"
  icon={<DollarSign />}
  trend="up"
  trendValue="+12.5%"
  description="vs last month"
/>`;

const intentCode = `<Stat title="Users" value="8,294" intent="primary" icon={<Users />} />
<Stat title="Revenue" value="$94k" intent="success" icon={<DollarSign />} />
<Stat title="Errors" value="42" intent="danger" icon={<Activity />} />
<Stat title="Pending" value="123" intent="warning" icon={<Package />} />`;

const trendCode = `<Stat title="Sales" value="1,024" trend="up" trendValue="+8%" description="vs last week" />
<Stat title="Bounce Rate" value="36%" trend="down" trendValue="-3.2%" description="this month" />
<Stat title="Sessions" value="4,200" trend="neutral" trendValue="0%" description="no change" />`;

const propRows = [
  {
    prop: "title",
    type: "string",
    required: true,
    description: "Metric label displayed above the value",
  },
  { prop: "value", type: "ReactNode", required: true, description: "Primary value to display" },
  { prop: "prefix", type: "ReactNode", description: "Displayed before the value (e.g. '$')" },
  { prop: "suffix", type: "ReactNode", description: "Displayed after the value (e.g. '%')" },
  { prop: "icon", type: "ReactNode", description: "Icon shown in the card corner" },
  {
    prop: "trend",
    type: `"up" | "down" | "neutral"`,
    description: "Trend direction — shows icon and color",
  },
  { prop: "trendValue", type: "string", description: "Trend percentage or label (e.g. '+12%')" },
  { prop: "description", type: "string", description: "Secondary description below the trend" },
  {
    prop: "intent",
    type: `"primary" | "success" | "danger" | "warning"`,
    default: `"primary"`,
    description: "Color accent for icon and border",
  },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Padding scale" },
];

export default function StatPage() {
  return (
    <div className="space-y-8">
      <PageTitle>Stat</PageTitle>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">
        At-a-glance statistics card. Use in grids for dashboards — shows a metric title, value,
        optional icon, and trend indicator.
      </p>

      <Section title="Basic">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat
            title="Monthly Revenue"
            value="$48,295"
            icon={<DollarSign />}
            trend="up"
            trendValue="+12.5%"
            description="vs last month"
          />
          <Stat
            title="Active Users"
            value="8,294"
            icon={<Users />}
            trend="up"
            trendValue="+4.1%"
            description="this week"
          />
          <Stat
            title="Orders"
            value="1,847"
            icon={<ShoppingCart />}
            trend="down"
            trendValue="-2.3%"
            description="vs yesterday"
          />
        </div>
        <CodeExample code={basicCode} />
      </Section>

      <Section title="Intents">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat title="Users" value="8,294" intent="primary" icon={<Users />} />
          <Stat title="Revenue" value="$94k" intent="success" icon={<DollarSign />} />
          <Stat title="Errors" value="42" intent="danger" icon={<Activity />} />
          <Stat title="Pending" value="123" intent="warning" icon={<Package />} />
        </div>
        <CodeExample code={intentCode} />
      </Section>

      <Section title="Trend states">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat
            title="Sales"
            value="1,024"
            icon={<TrendingUp />}
            intent="success"
            trend="up"
            trendValue="+8%"
            description="vs last week"
          />
          <Stat
            title="Bounce Rate"
            value="36%"
            icon={<Activity />}
            intent="danger"
            trend="down"
            trendValue="-3.2%"
            description="this month"
          />
          <Stat
            title="Sessions"
            value="4,200"
            icon={<Users />}
            trend="neutral"
            trendValue="0%"
            description="no change"
          />
        </div>
        <CodeExample code={trendCode} />
      </Section>

      <Section title="With prefix / suffix">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Stat
            title="Conversion Rate"
            value="3.8"
            suffix="%"
            icon={<Activity />}
            trend="up"
            trendValue="+0.4%"
          />
          <Stat
            title="Avg Order Value"
            value="94"
            prefix="$"
            icon={<ShoppingCart />}
            trend="up"
            trendValue="+$7"
            description="this week"
          />
        </div>
      </Section>

      <Section title="Sizes">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat title="Small" value="42" size="sm" icon={<Package />} intent="primary" />
          <Stat title="Medium (default)" value="42" size="md" icon={<Package />} intent="success" />
          <Stat title="Large" value="42" size="lg" icon={<Package />} intent="warning" />
        </div>
      </Section>

      <Section title="Props">
        <PropTable rows={propRows} />
      </Section>
    </div>
  );
}
