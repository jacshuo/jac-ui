import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const inputProps: PropRow[] = [
  {
    prop: "state",
    type: `"default" | "error"`,
    default: `"default"`,
    description: "Validation state — error shows red border and ring",
  },
  {
    prop: "inputSize",
    type: `"sm" | "md" | "lg"`,
    default: `"md"`,
    description:
      "Input height (sm=h-7, md=h-9, lg=h-11). Named inputSize to avoid conflict with HTML size attribute",
  },
  {
    prop: "prefix",
    type: "React.ReactNode",
    description: "Leading adornment with highlighted background panel (icon or text label)",
  },
  {
    prop: "suffix",
    type: "React.ReactNode",
    description: "Trailing non-interactive adornment inside the input frame",
  },
  {
    prop: "action",
    type: '{ icon: React.ReactNode; onClick: () => void; "aria-label"?: string }',
    description: "Clickable icon button at the trailing end",
  },
  {
    prop: "...rest",
    type: "InputHTMLAttributes<HTMLInputElement>",
    description: "All native input attributes (size and prefix are omitted to avoid conflicts)",
  },
];

const typesCode = `import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix"
> & {
  state?:     "default" | "error";
  inputSize?: "sm" | "md" | "lg";
  prefix?:    React.ReactNode;
  suffix?:    React.ReactNode;
  action?: {
    icon:          React.ReactNode;
    onClick:       () => void;
    "aria-label"?: string;
  };
}`;

const usageCode = `import { Input } from "@jacshuo/onyx";
import { Search } from "lucide-react";

export function Example() {
  return (
    <div className="flex flex-col gap-3 max-w-sm">
      <Input placeholder="Default input" />
      <Input
        placeholder="Search…"
        prefix={<Search size={16} />}
        inputSize="sm"
      />
      <Input
        state="error"
        defaultValue="bad value"
        placeholder="Error state"
      />
    </div>
  );
}`;

export default function InputDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Input</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Input } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={inputProps} />
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
