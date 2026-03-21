import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const textBoxProps: PropRow[] = [
  {
    prop: "state",
    type: `"default" | "error"`,
    default: `"default"`,
    description:
      "Border/ring visual state. error turns red and also activates when maxWords exceeded",
  },
  {
    prop: "size",
    type: `"sm" | "md" | "lg"`,
    default: `"md"`,
    description: "Padding, text size, and min-height",
  },
  {
    prop: "showWordCount",
    type: "boolean",
    default: "false",
    description: "Show live word-count label below the textarea",
  },
  {
    prop: "maxWords",
    type: "number",
    description:
      "Word limit; counter turns red and state becomes error when exceeded. Supports mixed CJK + Latin (each CJK char = 1 word)",
  },
  {
    prop: "...rest",
    type: "TextareaHTMLAttributes<HTMLTextAreaElement>",
    description:
      "All native textarea attributes: value, defaultValue, onChange, placeholder, disabled, rows, etc. (size is omitted)",
  },
];

const typesCode = `import type { TextareaHTMLAttributes } from "react";

export type TextBoxProps =
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & {
    state?:         "default" | "error";
    size?:          "sm" | "md" | "lg";
    showWordCount?: boolean;
    maxWords?:      number;
  };
// maxWords turns state to "error" and counter red when exceeded
// Supports mixed CJK + Latin word counting (each CJK char = 1 word)`;

const usageCode = `import { TextBox } from "@jacshuo/onyx";

export function Example() {
  return (
    <div className="flex flex-col gap-3 max-w-sm">
      <TextBox placeholder="Write something…" rows={4} />
      <TextBox
        placeholder="Max 100 words"
        showWordCount
        maxWords={100}
        rows={4}
      />
      <TextBox state="error" defaultValue="invalid input" rows={3} />
    </div>
  );
}`;

export default function TextBoxDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>TextBox</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { TextBox, type TextBoxProps } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={textBoxProps} />
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
