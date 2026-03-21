import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const checkboxProps: PropRow[] = [
  { prop: "checked", type: "boolean", description: "Controlled checked state" },
  {
    prop: "defaultChecked",
    type: "boolean",
    default: "false",
    description: "Uncontrolled initial checked state",
  },
  {
    prop: "indeterminate",
    type: "boolean",
    default: "false",
    description: "Shows dash icon overriding checkmark; overrides checked visually",
  },
  {
    prop: "onCheckedChange",
    type: "(checked: boolean) => void",
    description: "Fires after toggle",
  },
  { prop: "label", type: "string", description: "Accessible label text shown beside the checkbox" },
  {
    prop: "intent",
    type: `"primary" | "secondary" | "success" | "danger" | "warning"`,
    default: `"primary"`,
    description: "Checked indicator fill color",
  },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Box dimensions" },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Dims and removes pointer events",
  },
  { prop: "id", type: "string", description: "Custom id; auto-generated with useId() otherwise" },
];

const typesCode = `import type { InputHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

export type CheckboxProps =
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> &
  Omit<VariantProps<typeof checkboxVariants>, "checked"> & {
    checked?: boolean;
    defaultChecked?: boolean;
    indeterminate?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    label?: string;
  };

// Resolved variant shape:
interface CheckboxVariants {
  intent?: "primary" | "secondary" | "success" | "danger" | "warning";
  size?:   "sm" | "md" | "lg";
}`;

const usageCode = `import { Checkbox } from "@jacshuo/onyx";
import { useState } from "react";

export function Example() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Checkbox
        label="Accept terms"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Checkbox label="Success intent" intent="success" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
    </div>
  );
}`;

export default function CheckboxDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Checkbox</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Checkbox, type CheckboxProps } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={checkboxProps} />
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
