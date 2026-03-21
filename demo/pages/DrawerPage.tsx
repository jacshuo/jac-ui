import { useState } from "react";
import { Button, Drawer, DrawerHeader, DrawerBody, DrawerFooter, DrawerClose } from "../../src";
import { Section, PageTitle, CodeExample, PropTable, type PropRow } from "./helpers";
import type { DrawerSide } from "../../src";

const basicCode = `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open Drawer</Button>

<Drawer open={open} onClose={() => setOpen(false)}>
  <DrawerHeader>
    <h2 className="text-lg font-semibold">Title</h2>
    <DrawerClose onClose={() => setOpen(false)} />
  </DrawerHeader>
  <DrawerBody>
    <p>Drawer content goes here.</p>
  </DrawerBody>
  <DrawerFooter>
    <Button intent="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button onClick={() => setOpen(false)}>Confirm</Button>
  </DrawerFooter>
</Drawer>`;

const sidesCode = `<Drawer open={open} onClose={() => setOpen(false)} side="left">…</Drawer>
<Drawer open={open} onClose={() => setOpen(false)} side="right">…</Drawer>
<Drawer open={open} onClose={() => setOpen(false)} side="top">…</Drawer>
<Drawer open={open} onClose={() => setOpen(false)} side="bottom">…</Drawer>`;

const propRows: PropRow[] = [
  { prop: "open", type: "boolean", required: true, description: "Controls visibility." },
  {
    prop: "onClose",
    type: "() => void",
    required: true,
    description: "Called when the drawer should close.",
  },
  {
    prop: "side",
    type: '"left" | "right" | "top" | "bottom"',
    default: '"right"',
    description: "Which edge the drawer slides from.",
  },
  {
    prop: "size",
    type: "string",
    default: '"20rem"',
    description: "Width (left/right) or height (top/bottom) CSS value.",
  },
  {
    prop: "closeOnBackdropClick",
    type: "boolean",
    default: "true",
    description: "Close when clicking the backdrop.",
  },
  { prop: "children", type: "ReactNode", required: true, description: "Drawer content." },
  { prop: "className", type: "string", description: "Extra class names on the panel." },
];

export default function DrawerPage() {
  const [openSide, setOpenSide] = useState<DrawerSide | null>(null);

  function open(side: DrawerSide) {
    setOpenSide(side);
  }
  function close() {
    setOpenSide(null);
  }

  return (
    <div className="space-y-10 p-6">
      <PageTitle>Drawer</PageTitle>

      <Section title="Basic (right side)">
        <Button onClick={() => open("right")}>Open right drawer</Button>
        <CodeExample code={basicCode} />
      </Section>

      <Section title="All sides">
        <div className="flex flex-wrap gap-3">
          {(["left", "right", "top", "bottom"] as const).map((side) => (
            <Button key={side} intent="secondary" onClick={() => open(side)}>
              From {side}
            </Button>
          ))}
        </div>
        <CodeExample code={sidesCode} />
      </Section>

      {/* Shared drawer instance — changes panel side on open */}
      <Drawer
        open={openSide !== null}
        onOpenChange={(o) => !o && close()}
        side={openSide ?? "right"}
      >
        <DrawerHeader>
          <h2 className="text-lg font-semibold">
            {openSide ? openSide[0].toUpperCase() + openSide.slice(1) : ""} Drawer
          </h2>
          <DrawerClose onClose={close} />
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm">
            This drawer slides in from the <strong>{openSide}</strong> side. You can put any content
            here — forms, navigation, details panels, etc.
          </p>
          <div className="mt-4 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 rounded bg-primary-100 dark:bg-primary-800" />
            ))}
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button intent="ghost" onClick={close}>
            Cancel
          </Button>
          <Button onClick={close}>Save changes</Button>
        </DrawerFooter>
      </Drawer>

      <Section title="Props">
        <PropTable rows={propRows} />
      </Section>
    </div>
  );
}
