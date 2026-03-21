import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const indicatorProps: PropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    required: true,
    description: "The element the indicator is attached to",
  },
  {
    prop: "show",
    type: "boolean",
    default: "true",
    description: "Whether the indicator dot/badge is visible",
  },
  {
    prop: "content",
    type: "React.ReactNode",
    description:
      'Content inside the badge (e.g. number). Numbers >99 display as "99+". Ignored when dot=true',
  },
  {
    prop: "dot",
    type: "boolean",
    description: "Show as a dot only (no content). Auto-enabled when content is omitted",
  },
  {
    prop: "pulse",
    type: "boolean",
    default: "false",
    description: "Show pulsing ring animation around the indicator",
  },
  {
    prop: "intent",
    type: `"primary" | "success" | "danger" | "warning" | "info"`,
    default: `"danger"`,
    description: "Indicator color",
  },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Badge size" },
  {
    prop: "placement",
    type: `"top-right" | "top-left" | "bottom-right" | "bottom-left"`,
    default: `"top-right"`,
    description: "Corner position relative to the child element",
  },
  { prop: "className", type: "string", description: "Extra CSS classes on the wrapper" },
];

const typesCode = `import type { VariantProps } from "class-variance-authority";

export interface IndicatorProps extends VariantProps<typeof indicatorVariants> {
  children:   React.ReactNode;  // required — element to attach to
  show?:      boolean;          // default: true
  content?:   React.ReactNode;  // badge content; >99 shows "99+"
  dot?:       boolean;          // dot-only mode (auto when no content)
  pulse?:     boolean;          // pulsing ring animation
  className?: string;
}

// Resolved variant shape:
interface IndicatorVariants {
  intent?:    "primary" | "success" | "danger" | "warning" | "info";
  size?:      "sm" | "md" | "lg";
  placement?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}`;

const usageCode = `import { Indicator, Button } from "@jacshuo/onyx";

export function Example() {
  return (
    <Indicator content={3} intent="danger" pulse>
      <Button>Inbox</Button>
    </Indicator>
  );
}`;

const tokenCode = `/* Override Indicator dot size in your CSS */
:root {
  --indicator-dot-size-sm: 0.375rem;
  --indicator-dot-size-md: 0.5rem;
  --indicator-dot-size-lg: 0.625rem;
}`;

export default function IndicatorDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Indicator</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Indicator, type IndicatorProps } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={indicatorProps} />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>

      <Section title="CSS Token Overrides">
        <p className="mb-3 text-sm text-secondary-600 dark:text-secondary-400">
          The indicator dot size for each size step is a CSS custom property. Override to scale the
          dot diameter independently of the badge content size.
        </p>
        <CodeExample code={tokenCode} />
      </Section>
    </div>
  );
}
