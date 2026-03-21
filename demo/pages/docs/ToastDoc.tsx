import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const toastProviderProps: PropRow[] = [
  { prop: "children", type: "React.ReactNode", required: true, description: "Application subtree" },
  {
    prop: "defaultPosition",
    type: "ToastPosition",
    default: '"top-right"',
    description: "Default position for toasts when not overridden per toast",
  },
  {
    prop: "defaultDuration",
    type: "number",
    default: "4000",
    description: "Default auto-dismiss delay in milliseconds",
  },
];

const toastOptionsProps: PropRow[] = [
  { prop: "title", type: "string", description: "Toast headline" },
  { prop: "description", type: "string", description: "Supporting body text" },
  {
    prop: "variant",
    type: '"default" | "success" | "danger" | "warning" | "info"',
    default: '"default"',
    description: "Visual intent / color",
  },
  {
    prop: "duration",
    type: "number",
    default: "4000",
    description: "Auto-dismiss delay in ms. Pass 0 to disable",
  },
  {
    prop: "dismissible",
    type: "boolean",
    default: "true",
    description: "Show close button on the toast",
  },
  { prop: "action", type: "ToastAction", description: "Optional action button" },
  {
    prop: "position",
    type: "ToastPosition",
    description: "Override the default position per toast",
  },
  {
    prop: "onDismiss",
    type: "(id: string) => void",
    description: "Called when the toast is dismissed",
  },
];

const toastActionProps: PropRow[] = [
  { prop: "label", type: "string", required: true, description: "Button label" },
  { prop: "onClick", type: "() => void", required: true, description: "Click handler" },
];

const usageCode = `// 1. Wrap your app with ToastProvider
import { ToastProvider } from "@jacshuo/onyx";

function App() {
  return (
    <ToastProvider defaultPosition="top-right" defaultDuration={4000}>
      <YourApp />
    </ToastProvider>
  );
}

// 2. Trigger toasts with the useToast hook
import { useToast } from "@jacshuo/onyx";

function Page() {
  const { toast, dismiss, dismissAll } = useToast();

  return (
    <button
      onClick={() =>
        toast({
          title: "Saved!",
          description: "Your changes have been saved.",
          variant: "success",
        })
      }
    >
      Save
    </button>
  );
}`;

const variantsCode = `const { toast } = useToast();

toast({ title: "Default",  variant: "default"  });
toast({ title: "Success",  variant: "success"  });
toast({ title: "Error",    variant: "danger"   });
toast({ title: "Warning",  variant: "warning"  });
toast({ title: "Info",     variant: "info"     });`;

const actionCode = `const { toast, dismiss } = useToast();

toast({
  title: "File deleted",
  variant: "danger",
  action: {
    label: "Undo",
    onClick: () => console.log("undo"),
  },
});`;

const typesCode = `export type ToastVariant = "default" | "success" | "danger" | "warning" | "info";

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastOptions = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  dismissible?: boolean;
  action?: ToastAction;
  position?: ToastPosition;
  onDismiss?: (id: string) => void;
};

export type ToastProviderProps = {
  children: React.ReactNode;
  defaultPosition?: ToastPosition;
  defaultDuration?: number;
};

export type ToastContextValue = {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

// Hook
export declare function useToast(): ToastContextValue;`;

export default function ToastDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Toast</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import {
  ToastProvider,
  useToast,
  type ToastOptions,
  type ToastVariant,
  type ToastPosition,
  type ToastAction,
  type ToastProviderProps,
} from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="ToastProvider Props">
        <PropTable rows={toastProviderProps} title="ToastProvider" />
      </Section>

      <Section title="ToastOptions">
        <PropTable rows={toastOptionsProps} title="toast(options)" />
      </Section>

      <Section title="ToastAction">
        <PropTable rows={toastActionProps} title="ToastAction" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Variants">
        <CodeExample code={variantsCode} />
      </Section>

      <Section title="Action Button">
        <CodeExample code={actionCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>
    </div>
  );
}
