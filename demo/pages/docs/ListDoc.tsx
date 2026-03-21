import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const listProps: PropRow[] = [
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Item size / padding" },
  {
    prop: "intent",
    type: `"default" | "striped"`,
    default: `"default"`,
    description: "List visual style",
  },
  {
    prop: "...rest",
    type: "HTMLAttributes<HTMLUListElement>",
    description: "All native ul attributes",
  },
];

const listItemProps: PropRow[] = [
  { prop: "actions", type: "React.ReactNode", description: "Action buttons revealed on hover" },
  {
    prop: "...rest",
    type: "LiHTMLAttributes<HTMLLIElement>",
    description: "All native li attributes",
  },
];

const usageCode = `import { List, ListItem, Button } from "@jacshuo/onyx";
import { Trash2 } from "lucide-react";

const items = ["Apple", "Banana", "Cherry"];

export function Example() {
  return (
    <List intent="striped">
      {items.map((item) => (
        <ListItem
          key={item}
          actions={
            <Button size="xs" intent="ghost">
              <Trash2 size={14} />
            </Button>
          }
        >
          {item}
        </ListItem>
      ))}
    </List>
  );
}`;

const typesCode = `import type { HTMLAttributes, LiHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

type ListProps =
  React.HTMLAttributes<HTMLUListElement> &
  VariantProps<typeof listVariants> & {
    size?: "sm" | "md" | "lg";
  };

export type ListItemProps =
  React.LiHTMLAttributes<HTMLLIElement> & {
    actions?: React.ReactNode;   // buttons on the right (shown on hover; always visible on touch)
  };

// Resolved variant shape:
interface ListVariants {
  intent?: "default" | "bordered" | "hover";
  size?:   "sm" | "md" | "lg";
}`;

const tokenCode = `/* Override List item sizing in your CSS */
:root {
  /* Vertical padding per size */
  --list-item-py-sm: 0.25rem;
  --list-item-py-md: 0.375rem;
  --list-item-py-lg: 0.5rem;

  /* Font size per size */
  --list-item-text-sm: 0.75rem;
  --list-item-text-md: 0.875rem;
  --list-item-text-lg: 1rem;

  /* Icon size per size */
  --list-item-icon-sm: 0.75rem;
  --list-item-icon-md: 0.875rem;
  --list-item-icon-lg: 1rem;

  /* Minimum touch target height for row action buttons */
  --row-action-touch-min: 2.25rem;
}`;

export default function ListDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>List</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { List, ListItem, type ListItemProps } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="List Props">
        <PropTable rows={listProps} title="List" />
      </Section>

      <Section title="ListItem Props">
        <PropTable rows={listItemProps} title="ListItem" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>

      <Section title="CSS Token Overrides">
        <p className="mb-3 text-sm text-secondary-600 dark:text-secondary-400">
          List exposes item spacing and typography tokens for each size step. Override to adjust
          density independently of the <code>size</code> prop.
        </p>
        <CodeExample code={tokenCode} />
      </Section>
    </div>
  );
}
