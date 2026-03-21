import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const treeProps: PropRow[] = [
  {
    prop: "showLines",
    type: "boolean",
    default: "false",
    description: "Show connecting guide lines",
  },
  { prop: "showRoot", type: "boolean", default: "false", description: "Show root node" },
  { prop: "expandedKeys", type: "Set<string>", description: "Controlled expanded node keys" },
  {
    prop: "defaultExpandedKeys",
    type: `Set<string> | "all"`,
    description: "Initial expanded keys (uncontrolled)",
  },
  {
    prop: "onExpandedKeysChange",
    type: "(keys: Set<string>) => void",
    description: "Expansion change callback",
  },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Node size" },
];

const treeItemProps: PropRow[] = [
  { prop: "nodeKey", type: "string", description: "Unique key for controlled expansion" },
  { prop: "label", type: "React.ReactNode", required: true, description: "Node label content" },
  { prop: "icon", type: "React.ReactNode", description: "Leading icon" },
  { prop: "actions", type: "React.ReactNode", description: "Hover-revealed action buttons" },
  {
    prop: "defaultExpanded",
    type: "boolean",
    default: "false",
    description: "Initial expansion state (uncontrolled)",
  },
  { prop: "expanded", type: "boolean", description: "Controlled expansion state" },
  { prop: "onToggle", type: "(expanded: boolean) => void", description: "Toggle callback" },
];

const usageCode = `import { Tree, TreeItem } from "@jacshuo/onyx";
import { Folder, File } from "lucide-react";

export function Example() {
  return (
    <Tree showLines defaultExpandedKeys="all">
      <TreeItem label="src" icon={<Folder size={14} />}>
        <TreeItem label="components" icon={<Folder size={14} />}>
          <TreeItem label="Button.tsx" icon={<File size={14} />} />
          <TreeItem label="Badge.tsx"  icon={<File size={14} />} />
        </TreeItem>
        <TreeItem label="index.ts" icon={<File size={14} />} />
      </TreeItem>
    </Tree>
  );
}`;

const typesCode = `type TreeProps =
  React.HTMLAttributes<HTMLUListElement> & {
    showLines?:           boolean;              // default: true — indent guide lines
    showRoot?:            boolean;              // default: true — render root items
    expandedKeys?:        Set<string>;          // controlled expanded nodes
    defaultExpandedKeys?: Set<string> | "all"; // uncontrolled; default: "all"
    onExpandedKeysChange?: (keys: Set<string>) => void;
    size?:                "sm" | "md" | "lg";  // default: "md"
  };

type TreeItemProps = {
  nodeKey?:        string;           // unique key; falls back to label string
  label:           React.ReactNode; // required
  icon?:           React.ReactNode;
  actions?:        React.ReactNode; // hover action buttons on the right
  defaultExpanded?: boolean;        // per-item uncontrolled expand state
  expanded?:       boolean;         // per-item controlled expand state
  onToggle?:       (expanded: boolean) => void;
  children?:       React.ReactNode; // nested TreeItem elements
  className?:      string;
};`;

const tokenCode = `/* Override Tree item sizing in your CSS */
:root {
  /* Vertical padding per size */
  --tree-item-py-sm: 0.125rem;
  --tree-item-py-md: 0.25rem;
  --tree-item-py-lg: 0.375rem;

  /* Font size per size */
  --tree-item-text-sm: 0.75rem;
  --tree-item-text-md: 0.875rem;
  --tree-item-text-lg: 1rem;

  /* Icon size per size */
  --tree-item-icon-sm: 0.875rem;
  --tree-item-icon-md: 1rem;
  --tree-item-icon-lg: 1.125rem;
}`;

export default function TreeDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Tree</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Tree, TreeItem } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Tree Props">
        <PropTable rows={treeProps} title="Tree" />
      </Section>

      <Section title="TreeItem Props">
        <PropTable rows={treeItemProps} title="TreeItem" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>

      <Section title="CSS Token Overrides">
        <p className="mb-3 text-sm text-secondary-600 dark:text-secondary-400">
          Tree exposes item spacing and typography tokens for each size step. Override to adjust
          density independently of the <code>size</code> prop.
        </p>
        <CodeExample code={tokenCode} />
      </Section>
    </div>
  );
}
