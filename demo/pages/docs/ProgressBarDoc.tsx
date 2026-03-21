import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const progressBarProps: PropRow[] = [
  {
    prop: "value",
    type: "number",
    default: "0",
    description: "Current progress 0–100 (automatically clamped)",
  },
  {
    prop: "showLabel",
    type: "boolean",
    default: "false",
    description: "Show percentage label inside the fill (hidden for xs/sm sizes)",
  },
  {
    prop: "indeterminate",
    type: "boolean",
    default: "false",
    description: "Looping animation for unknown progress; ignores value",
  },
  {
    prop: "animated",
    type: "boolean",
    default: "false",
    description: "Shine/pulse glow animation on the fill",
  },
  {
    prop: "duration",
    type: "number",
    default: "500",
    description: "Fill transition duration in milliseconds",
  },
  {
    prop: "intent",
    type: `"primary" | "success" | "danger" | "warning"`,
    default: `"primary"`,
    description: "Fill color",
  },
  { prop: "size", type: `"xs" | "sm" | "md" | "lg"`, default: `"md"`, description: "Bar height" },
  {
    prop: "edge",
    type: `"none" | "top" | "bottom"`,
    default: `"none"`,
    description: "Portal a fixed full-width bar to the top or bottom of the viewport",
  },
];

const typesCode = `import type { HTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

export type ProgressBarProps =
  React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof progressBarVariants> & {
    value?:          number;   // 0–100, auto-clamped
    showLabel?:      boolean;
    indeterminate?:  boolean;
    animated?:       boolean;
    duration?:       number;   // ms, default 500
  };

// Resolved variant shape:
interface ProgressBarVariants {
  intent?: "primary" | "success" | "danger" | "warning";
  size?:   "xs" | "sm" | "md" | "lg";
  edge?:   "none" | "top" | "bottom";
}`;

const usageCode = `import { ProgressBar } from "@jacshuo/onyx";

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <ProgressBar value={65} showLabel intent="primary" />
      <ProgressBar value={30} intent="success" size="sm" />
      <ProgressBar indeterminate intent="warning" size="xs" />
    </div>
  );
}`;

export default function ProgressBarDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>ProgressBar</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { ProgressBar, type ProgressBarProps } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={progressBarProps} />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>
    </div>
  );
}
