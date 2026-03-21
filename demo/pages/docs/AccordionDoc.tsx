import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const accordionProps: PropRow[] = [
  {
    prop: "type",
    type: `"single" | "multiple"`,
    default: `"single"`,
    description: "Allow one or many items open at once",
  },
  {
    prop: "defaultValue",
    type: "string[]",
    default: "[]",
    description: "Initially open items (uncontrolled)",
  },
  { prop: "value", type: "string[]", description: "Controlled open items" },
  { prop: "onValueChange", type: "(value: string[]) => void", description: "Change callback" },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Item padding size" },
  {
    prop: "intent",
    type: `"default" | "bordered"`,
    default: `"default"`,
    description: "Visual style",
  },
];

const accordionItemProps: PropRow[] = [
  { prop: "value", type: "string", required: true, description: "Unique identifier for this item" },
];

const usageCode = `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@jacshuo/onyx";

export function Example() {
  return (
    <Accordion type="single" defaultValue={["item-1"]}>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is OnyxUI?</AccordionTrigger>
        <AccordionContent>
          A cross-platform React UI component library for web and Electron.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I install it?</AccordionTrigger>
        <AccordionContent>
          Run <code>npm install @jacshuo/onyx</code> and import the CSS.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`;

const typesCode = `import type { HTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

// Accordion root
type AccordionProps =
  React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof accordionVariants> & {
    type?:          "single" | "multiple";   // default: "single"
    defaultValue?:  string[];                // uncontrolled initial open items
    value?:         string[];                // controlled open items
    onValueChange?: (value: string[]) => void;
    size?:          "sm" | "md" | "lg";
  };

// AccordionItem
type AccordionItemProps =
  React.HTMLAttributes<HTMLDivElement> & {
    value: string;  // required — unique identifier
  };

// AccordionTrigger — React.ButtonHTMLAttributes<HTMLButtonElement>
// AccordionContent — React.HTMLAttributes<HTMLDivElement>

// Resolved variant shape:
interface AccordionVariants {
  intent?: "default" | "bordered" | "ghost";
  size?:   "sm" | "md" | "lg";
}`;

const tokenCode = `/* Override Accordion spacing in your CSS */
:root {
  /* Trigger vertical padding per size */
  --accordion-trigger-py-sm: 0.375rem;
  --accordion-trigger-py-md: 0.75rem;
  --accordion-trigger-py-lg: 1rem;

  /* Content bottom padding per size */
  --accordion-content-pb-sm: 0.375rem;
  --accordion-content-pb-md: 0.75rem;
  --accordion-content-pb-lg: 1rem;

  /* Trigger font size per size */
  --accordion-trigger-text-sm: 0.75rem;
  --accordion-trigger-text-md: 0.875rem;
  --accordion-trigger-text-lg: 1rem;

  /* Content font size per size */
  --accordion-content-text-sm: 0.75rem;
  --accordion-content-text-md: 0.875rem;
  --accordion-content-text-lg: 1rem;
}`;

export default function AccordionDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Accordion</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="Accordion Props">
        <PropTable rows={accordionProps} title="Accordion" />
      </Section>

      <Section title="AccordionItem Props">
        <PropTable rows={accordionItemProps} title="AccordionItem" />
      </Section>

      <Section title="Notes">
        <p className="text-sm text-primary-600 dark:text-primary-400">
          AccordionTrigger and AccordionContent pass through their native button / div attributes.
        </p>
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>

      <Section title="CSS Token Overrides">
        <p className="mb-3 text-sm text-secondary-600 dark:text-secondary-400">
          Accordion exposes spacing and font-size tokens for each size step. Override to adjust
          density without changing the <code>size</code> prop.
        </p>
        <CodeExample code={tokenCode} />
      </Section>
    </div>
  );
}
