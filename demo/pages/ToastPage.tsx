import { useToast } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";
import { Button } from "../../src";
import { Bell, CheckCircle2, XCircle, AlertTriangle, Info, Pin, Trash2 } from "lucide-react";

/* ── Code snippets ───────────────────────────────────── */

const providerCode = `// 1. Wrap your app once in <ToastProvider>
import { ToastProvider } from "@jacshuo/onyx";

function App() {
  return (
    <ToastProvider defaultPosition="top-right" defaultDuration={4000}>
      <YourApp />
    </ToastProvider>
  );
}

// 2. Trigger toasts from anywhere inside the tree
import { useToast } from "@jacshuo/onyx";

function MyComponent() {
  const { toast, dismiss, dismissAll } = useToast();

  const handleSave = () => {
    toast({ title: "Saved!", variant: "success" });
  };
}`;

const variantsCode = `const { toast } = useToast();

toast({ title: "Default",  description: "A neutral notification." });
toast({ title: "Success",  description: "Operation succeeded.", variant: "success" });
toast({ title: "Danger",   description: "Something went wrong.",  variant: "danger" });
toast({ title: "Warning",  description: "Proceed with caution.",  variant: "warning" });
toast({ title: "Info",     description: "Here is some info.",     variant: "info" });`;

const positionCode = `toast({ title: "Top Right",     position: "top-right" });
toast({ title: "Top Left",      position: "top-left" });
toast({ title: "Top Center",    position: "top-center" });
toast({ title: "Bottom Right",  position: "bottom-right" });
toast({ title: "Bottom Left",   position: "bottom-left" });
toast({ title: "Bottom Center", position: "bottom-center" });`;

const persistCode = `// duration: 0 means it stays until manually dismissed
toast({
  title: "Pinned",
  description: "This toast will not auto-dismiss.",
  duration: 0,
  variant: "info",
});`;

const actionCode = `toast({
  title: "File deleted",
  description: "project.zip was moved to trash.",
  variant: "default",
  action: {
    label: "Undo",
    onClick: () => console.log("undo!"),
  },
});`;

const dismissCode = `const { toast, dismiss, dismissAll } = useToast();

// Dismiss a single toast by id
const id = toast({ title: "Hello", duration: 0 });
dismiss(id);

// Dismiss all visible toasts
dismissAll();`;

/* ── Page component ──────────────────────────────────── */

export default function ToastPage() {
  const { toast, dismissAll } = useToast();

  return (
    <div className="space-y-8">
      <PageTitle>Toast</PageTitle>

      {/* Provider setup */}
      <Section title="Provider setup">
        <p className="text-sm text-primary-600 dark:text-primary-400">
          Wrap your app once in{" "}
          <code className="rounded bg-primary-100 px-1 font-mono text-xs dark:bg-primary-800">
            &lt;ToastProvider&gt;
          </code>{" "}
          — this demo&apos;s{" "}
          <code className="rounded bg-primary-100 px-1 font-mono text-xs dark:bg-primary-800">
            App.tsx
          </code>{" "}
          already does this, so every page can call{" "}
          <code className="rounded bg-primary-100 px-1 font-mono text-xs dark:bg-primary-800">
            useToast()
          </code>{" "}
          directly.
        </p>
        <CodeExample code={providerCode} />
      </Section>

      {/* Variants */}
      <Section title="Variants">
        <div className="flex flex-wrap gap-3">
          <Button
            intent="secondary"
            onClick={() => toast({ title: "Default", description: "A neutral notification." })}
          >
            <Bell className="h-4 w-4" /> Default
          </Button>
          <Button
            intent="primary"
            onClick={() =>
              toast({
                title: "Success",
                description: "Operation completed successfully.",
                variant: "success",
              })
            }
          >
            <CheckCircle2 className="h-4 w-4" /> Success
          </Button>
          <Button
            intent="danger"
            onClick={() =>
              toast({
                title: "Danger",
                description: "Something went wrong. Please try again.",
                variant: "danger",
              })
            }
          >
            <XCircle className="h-4 w-4" /> Danger
          </Button>
          <Button
            intent="warning"
            onClick={() =>
              toast({
                title: "Warning",
                description: "Proceed with caution.",
                variant: "warning",
              })
            }
          >
            <AlertTriangle className="h-4 w-4" /> Warning
          </Button>
          <Button
            intent="primary"
            onClick={() =>
              toast({
                title: "Info",
                description: "Here is some useful information.",
                variant: "info",
              })
            }
          >
            <Info className="h-4 w-4" /> Info
          </Button>
        </div>
        <CodeExample code={variantsCode} />
      </Section>

      {/* Positions */}
      <Section title="Positions">
        <p className="text-sm text-primary-600 dark:text-primary-400">
          Each toast can override the provider&apos;s default position.
        </p>
        <div className="flex flex-wrap gap-3">
          {(
            [
              "top-right",
              "top-left",
              "top-center",
              "bottom-right",
              "bottom-left",
              "bottom-center",
            ] as const
          ).map((pos) => (
            <Button
              key={pos}
              intent="secondary"
              onClick={() =>
                toast({
                  title: pos,
                  description: "Positioned at " + pos,
                  variant: "info",
                  position: pos,
                })
              }
            >
              {pos}
            </Button>
          ))}
        </div>
        <CodeExample code={positionCode} />
      </Section>

      {/* Persistent toast */}
      <Section title="Persistent (duration: 0)">
        <div className="flex flex-wrap gap-3">
          <Button
            intent="primary"
            onClick={() =>
              toast({
                title: "Pinned notification",
                description: "This toast will not auto-dismiss. Click × to close it.",
                variant: "info",
                duration: 0,
              })
            }
          >
            <Pin className="h-4 w-4" /> Persistent toast
          </Button>
        </div>
        <CodeExample code={persistCode} />
      </Section>

      {/* Action button */}
      <Section title="With action button">
        <div className="flex flex-wrap gap-3">
          <Button
            intent="secondary"
            onClick={() =>
              toast({
                title: "File deleted",
                description: "project.zip was moved to trash.",
                variant: "default",
                action: {
                  label: "Undo",
                  onClick: () => toast({ title: "Restored!", variant: "success", duration: 2000 }),
                },
              })
            }
          >
            Delete with Undo
          </Button>
          <Button
            intent="primary"
            onClick={() =>
              toast({
                title: "Update available",
                description: "A new version (v2.4.0) is ready.",
                variant: "info",
                duration: 0,
                action: {
                  label: "Install now",
                  onClick: () =>
                    toast({
                      title: "Installing…",
                      variant: "success",
                      duration: 2000,
                    }),
                },
              })
            }
          >
            With action
          </Button>
        </div>
        <CodeExample code={actionCode} />
      </Section>

      {/* Not dismissible */}
      <Section title="Non-dismissible">
        <div className="flex flex-wrap gap-3">
          <Button
            intent="secondary"
            onClick={() =>
              toast({
                title: "Processing…",
                description: "Please wait while we handle your request.",
                variant: "warning",
                dismissible: false,
                duration: 3000,
              })
            }
          >
            Non-dismissible (3 s)
          </Button>
        </div>
      </Section>

      {/* dismissAll */}
      <Section title="Dismiss all">
        <div className="flex flex-wrap gap-3">
          <Button
            intent="primary"
            onClick={() => {
              toast({ title: "Toast 1", variant: "success" });
              toast({ title: "Toast 2", variant: "info" });
              toast({ title: "Toast 3", variant: "warning" });
            }}
          >
            Spawn 3 toasts
          </Button>
          <Button intent="danger" onClick={dismissAll}>
            <Trash2 className="h-4 w-4" /> Dismiss all
          </Button>
        </div>
        <CodeExample code={dismissCode} />
      </Section>
    </div>
  );
}
