import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const alertProps: PropRow[] = [
  {
    prop: "intent",
    type: `"success" | "warning" | "error" | "info"`,
    default: `"info"`,
    description: "Alert color / severity",
  },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Padding size" },
];

const alertOptionsProps: PropRow[] = [
  { prop: "message", type: "string", required: true, description: "Alert message text" },
  { prop: "title", type: "string", description: "Alert title" },
  {
    prop: "intent",
    type: `"success" | "warning" | "error" | "info"`,
    default: `"info"`,
    description: "Color / severity",
  },
  {
    prop: "position",
    type: "AlertPosition",
    default: `"top-right"`,
    description: "Screen position for the toast",
  },
  {
    prop: "duration",
    type: "number",
    default: "3000",
    description: "Auto-dismiss time in ms (0 = permanent)",
  },
];

const alertPositionValues = `"top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"`;

const inlineUsageCode = `import { Alert, AlertIcon, AlertContent, AlertTitle, AlertDescription } from "@jacshuo/onyx";

export function Example() {
  return (
    <Alert intent="success">
      <AlertIcon />
      <AlertContent>
        <AlertTitle>Saved!</AlertTitle>
        <AlertDescription>Your changes have been saved.</AlertDescription>
      </AlertContent>
    </Alert>
  );
}`;

const toastUsageCode = `import { useAlert } from "@jacshuo/onyx";

export function Example() {
  const { show } = useAlert();

  return (
    <button
      onClick={() =>
        show({
          message: "Operation complete",
          title: "Success",
          intent: "success",
          position: "top-right",
          duration: 3000,
        })
      }
    >
      Show toast
    </button>
  );
}`;

const typesCode = `import type { HTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

// Inline static Alert
type AlertProps =
  React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants>;

// Static Alert sub-components (all accept className + native HTML attrs):
// AlertTitle, AlertIcon, AlertContent, AlertDescription

// Imperative toast API (no provider needed):
type AlertPosition =
  | "top-right" | "top-left" | "bottom-right" | "bottom-left"
  | "top-center" | "bottom-center";

type AlertOptions = {
  message:    string;          // required
  intent?:    "success" | "warning" | "error" | "info";
  title?:     string;
  position?:  AlertPosition;   // default: "top-right"
  duration?:  number;          // ms; 0 = persistent; default: 5000
};

// alert.show(options: AlertOptions): string  → returns toast id
// alert.dismiss(id: string): void
// configureAlertTopOffset(offset: number): void  → adjusts fixed positioning`;

const tokenCode = `/* Override toast notification width in your CSS */
:root {
  --toast-width: 20rem;
}`;

export default function AlertDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Alert / Toast</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { Alert, AlertIcon, AlertContent, AlertTitle, AlertDescription, useAlert } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="Alert (inline) Props">
        <PropTable rows={alertProps} title="Alert" />
      </Section>

      <Section title="AlertPosition">
        <p className="rounded-lg border border-primary-200 bg-primary-50 p-3 font-mono text-xs text-primary-700 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-300">
          {alertPositionValues}
        </p>
      </Section>

      <Section title="useAlert — AlertOptions">
        <p className="mb-2 text-sm text-primary-600 dark:text-primary-400">
          The{" "}
          <code className="rounded bg-primary-100 px-1 font-mono text-xs dark:bg-primary-800">
            useAlert()
          </code>{" "}
          hook returns a{" "}
          <code className="rounded bg-primary-100 px-1 font-mono text-xs dark:bg-primary-800">
            show(options)
          </code>{" "}
          function for programmatic toast alerts.
        </p>
        <PropTable rows={alertOptionsProps} title="AlertOptions" />
      </Section>

      <Section title="Inline Alert Usage">
        <CodeExample code={inlineUsageCode} />
      </Section>

      <Section title="Toast (useAlert) Usage">
        <CodeExample code={toastUsageCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>

      <Section title="CSS Token Overrides">
        <p className="mb-3 text-sm text-secondary-600 dark:text-secondary-400">
          The toast notification panel width is a CSS custom property. Override globally to change
          the width of all toasts produced by <code>useAlert()</code>.
        </p>
        <CodeExample code={tokenCode} />
      </Section>
    </div>
  );
}
