import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const formProps: PropRow[] = [
  {
    prop: "layout",
    type: `"stacked" | "inline"`,
    default: `"stacked"`,
    description: "Form layout direction",
  },
  {
    prop: "size",
    type: `"sm" | "md" | "lg"`,
    default: `"md"`,
    description: "Size applied to all form items",
  },
  { prop: "title", type: "React.ReactNode", description: "Form title displayed at the top" },
  { prop: "description", type: "React.ReactNode", description: "Form description below the title" },
  { prop: "footer", type: "React.ReactNode", description: "Footer content (e.g. submit button)" },
  {
    prop: "onValues",
    type: "(values: Record<string, unknown>, event: React.FormEvent) => BulkValidationResult | void",
    description: "Submit callback with all field values",
  },
];

const formItemProps: PropRow[] = [
  { prop: "label", type: "React.ReactNode", description: "Field label" },
  {
    prop: "layout",
    type: `"stacked" | "inline"`,
    description: "Override layout for this individual item",
  },
  {
    prop: "required",
    type: "boolean",
    default: "false",
    description: "Show required indicator (*)",
  },
  { prop: "hint", type: "React.ReactNode", description: "Hint text displayed below the field" },
  {
    prop: "validation",
    type: "{ status: string; message: React.ReactNode }",
    description: "Validation feedback message",
  },
  { prop: "name", type: "string", description: "HTML name attribute for the field" },
  { prop: "onValidate", type: "ValidateCallback", description: "Per-field validation function" },
];

const formSectionProps: PropRow[] = [
  { prop: "title", type: "React.ReactNode", description: "Section title" },
  { prop: "description", type: "React.ReactNode", description: "Section description" },
];

const usageCode = `import { Form, FormItem, Input, Button } from "@jacshuo/onyx";

export function Example() {
  return (
    <Form
      title="Sign up"
      layout="stacked"
      footer={<Button type="submit">Create account</Button>}
      onValues={(values) => console.log(values)}
    >
      <FormItem label="Email" required name="email">
        <Input placeholder="you@example.com" />
      </FormItem>
      <FormItem label="Password" required name="password" hint="Min 8 characters">
        <Input type="password" placeholder="••••••••" />
      </FormItem>
    </Form>
  );
}`;

const typesCode = `// Form — root form container
interface FormProps {
  layout?:     "stacked" | "inline" | "grid";    // default: "stacked"
  columns?:    number;                             // grid columns (layout="grid" only)
  className?:  string;
  onSubmit?:   (e: React.FormEvent, fd: FormData) => void;
  onValues?:   (values: Record<string, FormValue>) => BulkValidationResult | void;
  children:    React.ReactNode;
}

// FormItem — wraps a single field with label, hint, and validation
interface FormItemProps {
  label?:       string;
  hint?:        string;
  name?:        string;           // routes bulk validation errors by name
  required?:    boolean;
  onValidate?:  (value: unknown) => ValidationResult | undefined;
  className?:   string;
  children:     React.ReactNode;  // first child receives injected id/aria props
}

// ValidationResult
interface ValidationResult {
  result:  boolean;    // true = valid
  reason?: string;     // error message shown below field
}

// BulkValidationResult
type BulkValidationResult = Record<string, ValidationResult>;

// FormSection — visual grouping within the form
interface FormSectionProps {
  title?:      string;
  description?: string;
  className?:  string;
  children:    React.ReactNode;
}`;

const tokenCode = `/* Override Form layout dimensions in your CSS */
:root {
  /* Inline label width per size */
  --form-label-w-sm: 5rem;
  --form-label-w-md: 7rem;
  --form-label-w-lg: 9rem;

  /* Gap between label and field per size */
  --form-item-gap-sm: 0.5rem;
  --form-item-gap-md: 0.75rem;
  --form-item-gap-lg: 1rem;

  /* Vertical gap between form rows per size */
  --form-row-gap-sm: 0.75rem;
  --form-row-gap-md: 1.25rem;
  --form-row-gap-lg: 1.75rem;

  /* Hint text font size */
  --form-hint-text: 0.75rem;

  /* Form header bottom margin */
  --form-header-mb: 1.5rem;

  /* Footer top padding / gap between footer actions */
  --form-footer-pt: 1.5rem;
  --form-footer-gap: 0.5rem;

  /* Container border radius */
  --form-radius: 0.5rem;
}`;

export default function FormDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Form</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { Form, FormItem, FormSection, type FormProps, type FormItemProps } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="Form Props">
        <PropTable rows={formProps} title="Form" />
      </Section>

      <Section title="FormItem Props">
        <PropTable rows={formItemProps} title="FormItem" />
      </Section>

      <Section title="FormSection Props">
        <PropTable rows={formSectionProps} title="FormSection" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>

      <Section title="CSS Token Overrides">
        <p className="mb-3 text-sm text-secondary-600 dark:text-secondary-400">
          Form exposes layout dimension tokens for label widths, row/item gaps, hint text size, and
          corner rounding. Override to match your form density preference.
        </p>
        <CodeExample code={tokenCode} />
      </Section>
    </div>
  );
}
