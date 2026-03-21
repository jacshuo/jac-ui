import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const tooltipProps: PropRow[] = [
  { prop: "content", type: "React.ReactNode", required: true, description: "Tooltip body content" },
  {
    prop: "children",
    type: "React.ReactNode",
    required: true,
    description: "The trigger element the tooltip attaches to",
  },
  {
    prop: "position",
    type: `"top" | "bottom" | "left" | "right"`,
    default: `"top"`,
    description: "Placement relative to the trigger element",
  },
  {
    prop: "intent",
    type: `"default" | "light"`,
    default: `"default"`,
    description: "Dark (default) or light/bordered tooltip appearance",
  },
  { prop: "delay", type: "number", default: "200", description: "Show delay in milliseconds" },
  {
    prop: "maxWidth",
    type: "string | number",
    description: "Max width; enables text wrapping when set",
  },
  { prop: "className", type: "string", description: "Extra CSS classes on the tooltip bubble" },
];

const typesCode = `import type { VariantProps } from "class-variance-authority";

type TooltipProps = VariantProps<typeof tooltipVariants> & {
  content:     React.ReactNode;   // required — tooltip body
  children:    React.ReactNode;   // required — trigger element
  position?:   "top" | "bottom" | "left" | "right";
  delay?:      number;            // default: 200ms
  maxWidth?:   string | number;
  className?:  string;
};

// Resolved variant shape:
interface TooltipVariants {
  intent?: "default" | "light";
}`;

const usageCode = `import { Tooltip, Button } from "@jacshuo/onyx";

export function Example() {
  return (
    <div className="flex gap-4 flex-wrap">
      <Tooltip content="Save your work" position="top">
        <Button size="sm">Save (top)</Button>
      </Tooltip>
      <Tooltip content="Delete permanently" position="bottom" intent="light">
        <Button size="sm" intent="danger">Delete</Button>
      </Tooltip>
      <Tooltip
        content="This tooltip has a longer description that wraps."
        maxWidth={200}
        delay={0}
      >
        <Button size="sm" intent="ghost">Long tooltip</Button>
      </Tooltip>
    </div>
  );
}`;

const tokenCode = `/* Override Tooltip max width in your CSS */
:root {
  --tooltip-max-width: 16rem; /* also overridable per-instance via the maxWidth prop */
}`;

export default function TooltipDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Tooltip</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Tooltip } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={tooltipProps} />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>

      <Section title="CSS Token Overrides">
        <p className="mb-3 text-sm text-secondary-600 dark:text-secondary-400">
          The maximum width of the tooltip bubble is a CSS custom property. The{" "}
          <code>maxWidth</code> prop overrides this inline on a per-instance basis.
        </p>
        <CodeExample code={tokenCode} />
      </Section>
    </div>
  );
}
