import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const switchProps: PropRow[] = [
  { prop: "checked", type: "boolean", description: "Controlled on/off state" },
  {
    prop: "defaultChecked",
    type: "boolean",
    default: "false",
    description: "Uncontrolled initial state",
  },
  {
    prop: "onCheckedChange",
    type: "(checked: boolean) => void",
    description: "Fires after toggle",
  },
  {
    prop: "checkedContent",
    type: "React.ReactNode",
    description: "Text or icon shown inside the track when ON; triggers auto-sizing track",
  },
  {
    prop: "uncheckedContent",
    type: "React.ReactNode",
    description: "Text or icon shown inside the track when OFF",
  },
  { prop: "label", type: "string", description: "Accessible label text beside the switch" },
  {
    prop: "intent",
    type: `"primary" | "secondary" | "success" | "danger" | "warning"`,
    default: `"primary"`,
    description: "Track fill color when ON",
  },
  {
    prop: "size",
    type: `"sm" | "md" | "lg"`,
    default: `"md"`,
    description: "Overall track/thumb dimensions",
  },
  { prop: "disabled", type: "boolean", description: "Dims and disables interaction" },
  { prop: "id", type: "string", description: "Custom id; auto-generated with useId() otherwise" },
];

const typesCode = `import type { InputHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

export type SwitchProps =
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> &
  Omit<VariantProps<typeof switchTrackVariants>, "checked"> & {
    checked?:          boolean;
    defaultChecked?:   boolean;
    onCheckedChange?:  (checked: boolean) => void;
    checkedContent?:   React.ReactNode;  // label inside track when ON
    uncheckedContent?: React.ReactNode;  // label inside track when OFF
    label?:            string;
  };

// Resolved variant shape:
interface SwitchVariants {
  intent?: "primary" | "secondary" | "success" | "danger" | "warning";
  size?:   "sm" | "md" | "lg";
}`;

const usageCode = `import { Switch } from "@jacshuo/onyx";
import { useState } from "react";

export function Example() {
  const [on, setOn] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Switch checked={on} onCheckedChange={setOn} label="Enable notifications" />
      <Switch defaultChecked intent="success" label="Auto-save" />
      <Switch intent="danger" label="Delete mode" size="sm" />
    </div>
  );
}`;

export default function SwitchDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Switch</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Switch, type SwitchProps } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={switchProps} />
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
