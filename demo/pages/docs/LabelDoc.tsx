import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const labelProps: PropRow[] = [
  {
    prop: "intent",
    type: `"default" | "muted" | "required"`,
    default: `"default"`,
    description: 'Color style. "required" appends a red asterisk (*) via CSS after-content',
  },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Text and icon size" },
  {
    prop: "...rest",
    type: "LabelHTMLAttributes<HTMLLabelElement>",
    description: "All native label attributes including htmlFor, children, etc.",
  },
];

const typesCode = `import type { LabelHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

type LabelProps =
  React.LabelHTMLAttributes<HTMLLabelElement> &
  VariantProps<typeof labelVariants>;

// Resolved variant shape:
interface LabelVariants {
  intent?: "default" | "muted" | "required";
  size?:   "sm" | "md" | "lg";
}
// Note: intent="required" uses CSS after-content to append a red * marker`;

const usageCode = `import { Label, Input } from "@jacshuo/onyx";

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" placeholder="you@example.com" />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="name" intent="required">Full name (required)</Label>
        <Input id="name" placeholder="Jane Doe" />
      </div>
      <div className="flex flex-col gap-1">
        <Label intent="muted">Optional field</Label>
        <Input placeholder="Optional" />
      </div>
    </div>
  );
}`;

export default function LabelDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Label</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Label } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={labelProps} />
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
