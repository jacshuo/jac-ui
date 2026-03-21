import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const dialogProps: PropRow[] = [
  { prop: "open", type: "boolean", required: true, description: "Controlled open state" },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    required: true,
    description: "Open state change callback",
  },
  {
    prop: "modal",
    type: "boolean",
    default: "true",
    description: "Render as modal with backdrop overlay",
  },
  {
    prop: "closeOnOutsideClick",
    type: "boolean",
    default: "true",
    description: "Close when clicking outside the dialog",
  },
];

const dialogContentProps: PropRow[] = [
  {
    prop: "size",
    type: `"sm" | "md" | "lg" | "xl" | "full"`,
    default: `"md"`,
    description: "Dialog width",
  },
  {
    prop: "position",
    type: `"center" | "bottom"`,
    default: `"center"`,
    description: "Vertical position of the dialog",
  },
];

const usageCode = `import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Button,
} from "@jacshuo/onyx";
import { useState } from "react";

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Confirm action</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button intent="secondary">Cancel</Button>
            </DialogClose>
            <Button intent="danger" onClick={() => setOpen(false)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}`;

const typesCode = `// Dialog (provider/context)
type DialogProps = {
  open:                boolean;                   // required — controlled
  onOpenChange:        (open: boolean) => void;   // required
  modal?:              boolean;                   // default: true — lock scroll + backdrop + Escape
  closeOnOutsideClick?: boolean;                  // default: false
  children:            React.ReactNode;
};

// DialogContent
type DialogContentProps =
  React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof dialogContentVariants> & {
    position?: "center" | "bottom";  // default: "center"; "bottom" = sheet/drawer
  };

// Sub-components (all accept className + native HTML attrs):
// DialogHeader (<div>), DialogTitle (<h2>), DialogDescription (<p>),
// DialogFooter (<div>), DialogClose (<button> — absolute × button)

// Resolved variant shape:
interface DialogContentVariants {
  size?: "sm" | "md" | "lg" | "xl" | "full";  // controls max-width
}
// Supports stacked/nested dialogs via internal depth stack. Portals to document.body.`;

const tokenCode = `/* Override Dialog bottom-sheet corner radius in your CSS */
:root {
  --dialog-sheet-radius: 0.75rem; /* applies when DialogContent position="bottom" */
}`;

export default function DialogDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Dialog</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose,
} from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="Dialog Props">
        <PropTable rows={dialogProps} title="Dialog" />
      </Section>

      <Section title="DialogContent Props">
        <PropTable rows={dialogContentProps} title="DialogContent" />
      </Section>

      <Section title="Sub-components">
        <p className="text-sm text-primary-600 dark:text-primary-400">
          DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose — pass through
          their respective HTML element attributes.
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
          The top corner radius of the bottom-sheet (when <code>position=&ldquo;bottom&rdquo;</code>
          ) is a CSS custom property. Override to match your design system&apos;s radius scale.
        </p>
        <CodeExample code={tokenCode} />
      </Section>
    </div>
  );
}
