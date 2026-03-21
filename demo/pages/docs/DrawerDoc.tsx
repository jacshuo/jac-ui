import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const drawerProps: PropRow[] = [
  {
    prop: "open",
    type: "boolean",
    required: true,
    description: "Controls whether the drawer is visible",
  },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    required: true,
    description: "Callback to update the open state",
  },
  {
    prop: "side",
    type: '"left" | "right" | "top" | "bottom"',
    default: '"right"',
    description: "The edge the drawer slides in from",
  },
  {
    prop: "size",
    type: "string",
    default: '"20rem"',
    description: "CSS value for width (horizontal) or height (vertical)",
  },
  {
    prop: "backdrop",
    type: "boolean",
    default: "true",
    description: "Show a dimmed backdrop behind the drawer",
  },
  {
    prop: "closeOnBackdropClick",
    type: "boolean",
    default: "true",
    description: "Close the drawer when the backdrop is clicked",
  },
  { prop: "children", type: "React.ReactNode", required: true, description: "Drawer content" },
  { prop: "className", type: "string", description: "Extra CSS classes on the drawer panel" },
];

const subComponentProps: PropRow[] = [
  { prop: "children", type: "React.ReactNode", required: true, description: "Slot content" },
  { prop: "className", type: "string", description: "Extra CSS classes" },
];

const usageCode = `import { useState } from "react";
import { Button, Drawer, DrawerHeader, DrawerBody, DrawerFooter, DrawerClose } from "@jacshuo/onyx";

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>

      <Drawer open={open} onOpenChange={setOpen} side="right" size="24rem">
        <DrawerHeader>
          <h2 className="text-lg font-semibold">Settings</h2>
          <DrawerClose onClick={() => setOpen(false)} />
        </DrawerHeader>

        <DrawerBody>
          <p>Drawer body content goes here.</p>
        </DrawerBody>

        <DrawerFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DrawerFooter>
      </Drawer>
    </>
  );
}`;

const sidesCode = `import { Drawer } from "@jacshuo/onyx";

// Drawer can enter from any edge:
<Drawer open={open} onOpenChange={setOpen} side="left">...</Drawer>
<Drawer open={open} onOpenChange={setOpen} side="right">...</Drawer>
<Drawer open={open} onOpenChange={setOpen} side="top">...</Drawer>
<Drawer open={open} onOpenChange={setOpen} side="bottom">...</Drawer>`;

const typesCode = `export type DrawerSide = "left" | "right" | "top" | "bottom";

export type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: DrawerSide;
  size?: string;
  backdrop?: boolean;
  closeOnBackdropClick?: boolean;
  children: React.ReactNode;
  className?: string;
};

export type DrawerHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

export type DrawerBodyProps = {
  children: React.ReactNode;
  className?: string;
};

export type DrawerFooterProps = {
  children: React.ReactNode;
  className?: string;
};`;

export default function DrawerDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Drawer</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
  type DrawerProps,
  type DrawerSide,
} from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="Drawer Props">
        <PropTable rows={drawerProps} title="Drawer" />
      </Section>

      <Section title="Sub-component Props">
        <p className="text-sm text-secondary-600 mb-4">
          <code>DrawerHeader</code>, <code>DrawerBody</code>, and <code>DrawerFooter</code> all
          share the same props:
        </p>
        <PropTable rows={subComponentProps} title="DrawerHeader / DrawerBody / DrawerFooter" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Sides">
        <CodeExample code={sidesCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>
    </div>
  );
}
