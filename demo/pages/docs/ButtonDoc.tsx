import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const buttonProps: PropRow[] = [
  {
    prop: "intent",
    type: `"primary" | "secondary" | "danger" | "warning" | "ghost" | "outline"`,
    default: `"primary"`,
    description:
      "Visual style variant. primary/secondary/danger/warning are filled. ghost is transparent with hover. outline has a border.",
  },
  {
    prop: "size",
    type: `"sm" | "md" | "lg"`,
    default: `"md"`,
    description: "Button height and padding (sm=h-7, md=h-9, lg=h-11)",
  },
  {
    prop: "className",
    type: "string",
    description: "Extra CSS classes applied to the <button> element",
  },
  {
    prop: "...rest",
    type: "ButtonHTMLAttributes<HTMLButtonElement>",
    description: "All native button attributes: onClick, disabled, type, children, aria-*, etc.",
  },
];

const typesCode = `import type { ButtonHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

type ButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

// Resolved variant shape:
interface ButtonVariants {
  intent?: "primary" | "secondary" | "danger" | "warning" | "ghost" | "outline";
  size?:   "sm" | "md" | "lg";
}`;

const usageCode = `import { Button } from "@jacshuo/onyx";

export function Example() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button intent="primary">Primary</Button>
      <Button intent="secondary">Secondary</Button>
      <Button intent="danger">Danger</Button>
      <Button intent="warning">Warning</Button>
      <Button intent="ghost">Ghost</Button>
      <Button intent="outline">Outline</Button>
      <Button intent="primary" size="sm">Small</Button>
      <Button intent="primary" size="lg">Large</Button>
      <Button intent="primary" disabled>Disabled</Button>
    </div>
  );
}`;

export default function ButtonDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Button</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Button } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={buttonProps} />
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
