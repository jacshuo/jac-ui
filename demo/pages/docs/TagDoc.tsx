import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const tagProps: PropRow[] = [
  {
    prop: "intent",
    type: `"primary" | "secondary" | "success" | "danger" | "warning" | "info"`,
    default: `"primary"`,
    description: "Color theme of the tag",
  },
  {
    prop: "size",
    type: `"sm" | "md" | "lg"`,
    default: `"md"`,
    description: "Height and font size",
  },
  {
    prop: "variant",
    type: `"solid" | "outline" | "soft"`,
    default: `"solid"`,
    description: "Visual style variant",
  },
  { prop: "icon", type: "ReactNode", description: "Icon element before the label" },
  { prop: "dot", type: "boolean", description: "Colored status dot on the left" },
  { prop: "removable", type: "boolean", description: "Shows an × remove button" },
  { prop: "onRemove", type: "() => void", description: "Called when the × button is clicked" },
  { prop: "disabled", type: "boolean", description: "Dims the tag and disables interaction" },
  {
    prop: "...rest",
    type: "HTMLAttributes<HTMLSpanElement>",
    description: "All standard span attributes",
  },
];

const usageCode = `import { Tag } from "@jacshuo/onyx";
import { Shield, Zap } from "lucide-react";

// Simple label
<Tag intent="success">Active</Tag>

// With icon and dot
<Tag intent="success" dot icon={<Shield />}>Verified</Tag>

// Removable chip
<Tag intent="primary" removable onRemove={() => console.log("removed")}>
  TypeScript
</Tag>

// Outline variant
<Tag intent="danger" variant="outline">Deprecated</Tag>`;

const importCode = `import { Tag } from "@jacshuo/onyx";
import type { TagProps } from "@jacshuo/onyx";`;

const typeCode = `import type { VariantProps } from "class-variance-authority";
import type { tagVariants } from "@jacshuo/onyx";

type TagProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof tagVariants> & {
    icon?: React.ReactNode;
    removable?: boolean;
    onRemove?: () => void;
    disabled?: boolean;
    dot?: boolean;
  };`;

export default function TagDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Tag / Chip</PageTitle>

      <Section title="Import">
        <CodeExample code={importCode} />
      </Section>

      <Section title="Description">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          A compact label element for categorization, status, or filtering.{" "}
          <strong>Distinct from Badge</strong>: Tags use a pill/rounded-full shape, support dot
          indicators, icons, and removability. Badges are smaller, border-based status chips.
        </p>
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Types">
        <CodeExample code={typeCode} />
      </Section>

      <Section title="Props">
        <PropTable rows={tagProps} />
      </Section>
    </div>
  );
}
