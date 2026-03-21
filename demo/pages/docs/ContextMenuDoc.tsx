import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const contextMenuProps: PropRow[] = [
  {
    prop: "items",
    type: "ContextMenuItem[]",
    required: true,
    description: "Menu item definitions (recursive via children)",
  },
  {
    prop: "children",
    type: "ReactNode",
    required: true,
    description: "Target element that triggers the menu",
  },
  { prop: "disabled", type: "boolean", description: "Prevents the menu from opening" },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    description: "Fired when the menu opens or closes",
  },
  { prop: "className", type: "string", description: "Extra class on the wrapper div" },
];

const contextMenuItemProps: PropRow[] = [
  { prop: "key", type: "string", required: true, description: "Unique identifier" },
  { prop: "label", type: "ReactNode", required: true, description: "Display text or JSX" },
  { prop: "icon", type: "ReactNode", description: "Leading icon" },
  {
    prop: "shortcut",
    type: "string",
    description: "Keyboard shortcut hint displayed on the right",
  },
  { prop: "danger", type: "boolean", description: "Renders item in danger (red) color" },
  { prop: "disabled", type: "boolean", description: "Grays out the item and prevents onClick" },
  { prop: "separator", type: "boolean", description: "Renders a divider instead of a button row" },
  {
    prop: "children",
    type: "ContextMenuItem[]",
    description: "Nested sub-menu items (infinite depth)",
  },
  { prop: "onClick", type: "() => void", description: "Called when a leaf item is clicked" },
];

const importCode = `import { ContextMenu } from "@jacshuo/onyx";
import type { ContextMenuProps, ContextMenuItem } from "@jacshuo/onyx";`;

const usageCode = `import { ContextMenu } from "@jacshuo/onyx";
import type { ContextMenuItem } from "@jacshuo/onyx";
import { Copy, Trash2, Share2 } from "lucide-react";

const items: ContextMenuItem[] = [
  { key: "copy",  label: "Copy",  icon: <Copy size={14} />, shortcut: "⌘C", onClick: () => copy() },
  { key: "paste", label: "Paste", shortcut: "⌘V", onClick: () => paste() },
  { key: "sep1",  label: "",      separator: true },
  {
    key: "share",
    label: "Share",
    icon: <Share2 size={14} />,
    children: [
      { key: "share-link",  label: "Copy link",   onClick: () => shareLink() },
      { key: "share-email", label: "Send by email", onClick: () => shareEmail() },
    ],
  },
  { key: "delete", label: "Delete", icon: <Trash2 size={14} />, danger: true, onClick: () => del() },
];

// Desktop: right-click activates the menu
// Mobile: 500 ms long-press activates the menu
<ContextMenu items={items}>
  <div className="p-4 border rounded">Right-click or long-press me</div>
</ContextMenu>

// Disable the menu entirely
<ContextMenu items={items} disabled>
  <div className="p-4 border rounded opacity-50">Locked</div>
</ContextMenu>`;

const electronNote = `// Electron integration pattern:
// The component uses DOM events (contextmenu / touchstart) so it works
// identically inside Electron's BrowserWindow without any changes.
// To replace with native Electron menus, listen to onOpenChange and call
// ipcRenderer.send("show-context-menu", items) instead of rendering the portal.`;

const typeCode = `import type { ContextMenuItem, ContextMenuProps } from "@jacshuo/onyx";

interface ContextMenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  separator?: boolean;
  children?: ContextMenuItem[];
  onClick?: () => void;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  children: React.ReactNode;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}`;

export default function ContextMenuDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>ContextMenu</PageTitle>

      <Section title="Import">
        <CodeExample code={importCode} />
      </Section>

      <Section title="Description">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          A portal-based context menu that opens on <strong>right-click</strong> (desktop) or 500 ms{" "}
          <strong>long-press</strong> (mobile / touch). The panel position is automatically adjusted
          to stay within the viewport. Supports infinite nesting via the <code>children</code> array
          on any item, icons, keyboard shortcut hints, danger coloring, separators, and disabled
          states. Works identically in a normal browser and inside an{" "}
          <strong>Electron BrowserWindow</strong>.
        </p>
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Electron Integration">
        <CodeExample code={electronNote} />
      </Section>

      <Section title="Types">
        <CodeExample code={typeCode} />
      </Section>

      <Section title="ContextMenuItem Props">
        <PropTable rows={contextMenuItemProps} />
      </Section>

      <Section title="ContextMenu Props">
        <PropTable rows={contextMenuProps} />
      </Section>
    </div>
  );
}
