import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const badgeProps: PropRow[] = [
  {
    prop: "intent",
    type: `"primary" | "success" | "warning" | "error" | "info"`,
    default: `"primary"`,
    description: "Semantic color variant",
  },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Text and icon size" },
  {
    prop: "...rest",
    type: "HTMLAttributes<HTMLSpanElement>",
    description: "All native span attributes: children, onClick, className, etc.",
  },
];

const typesCode = `import type { HTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

type BadgeProps =
  React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

// Resolved variant shape:
interface BadgeVariants {
  intent?: "primary" | "success" | "warning" | "error" | "info";
  size?:   "sm" | "md" | "lg";
}`;

const usageCode = `import { Badge } from "@jacshuo/onyx";

export function Example() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Badge intent="primary">New</Badge>
      <Badge intent="success">Active</Badge>
      <Badge intent="danger" size="sm">Error</Badge>
      <Badge intent="warning">Warning</Badge>
    </div>
  );
}`;

const tokenCode = `/* Override Badge sizing in your CSS */
:root {
  /* Horizontal padding per size */
  --badge-px-sm: 0.375rem;
  --badge-px-md: 0.625rem;
  --badge-px-lg: 0.75rem;

  /* Vertical padding per size */
  --badge-py-sm: 0px;
  --badge-py-md: 0.125rem;
  --badge-py-lg: 0.25rem;

  /* Font size per size */
  --badge-text-sm: 0.625rem;
  --badge-text-md: 0.75rem;
  --badge-text-lg: 0.875rem;

  /* Icon size per size */
  --badge-icon-sm: 0.625rem;
  --badge-icon-md: 0.75rem;
  --badge-icon-lg: 0.875rem;
}`;

export default function BadgeDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Badge</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Badge } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={badgeProps} />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>

      <Section title="CSS Token Overrides">
        <p className="mb-3 text-sm text-secondary-600 dark:text-secondary-400">
          Badge exposes padding and typography tokens for each size step. Override to fine-tune
          sizing without changing the <code>size</code> prop.
        </p>
        <CodeExample code={tokenCode} />
      </Section>
    </div>
  );
}
