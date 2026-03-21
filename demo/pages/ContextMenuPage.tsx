import React, { useState } from "react";
import { ContextMenu } from "../../src";
import type { ContextMenuItem } from "../../src";
import { Section, PageTitle, CodeExample, PropTable } from "./helpers";
import {
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  Edit,
  Download,
  Share2,
  Star,
  FolderOpen,
  Info,
  RefreshCw,
  Terminal,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

const basicItems: ContextMenuItem[] = [
  { key: "cut", label: "Cut", icon: <Scissors />, shortcut: "⌘X", onClick: () => alert("Cut") },
  { key: "copy", label: "Copy", icon: <Copy />, shortcut: "⌘C", onClick: () => alert("Copy") },
  {
    key: "paste",
    label: "Paste",
    icon: <Clipboard />,
    shortcut: "⌘V",
    onClick: () => alert("Paste"),
  },
  { key: "sep1", label: "", separator: true },
  {
    key: "rename",
    label: "Rename",
    icon: <Edit />,
    shortcut: "F2",
    onClick: () => alert("Rename"),
  },
  { key: "share", label: "Share", icon: <Share2 />, onClick: () => alert("Share") },
  { key: "sep2", label: "", separator: true },
  {
    key: "delete",
    label: "Delete",
    icon: <Trash2 />,
    shortcut: "Del",
    danger: true,
    onClick: () => alert("Delete"),
  },
];

const nestedItems: ContextMenuItem[] = [
  { key: "open", label: "Open", icon: <FolderOpen />, onClick: () => alert("Open") },
  {
    key: "open-with",
    label: "Open With",
    icon: <ArrowRight />,
    children: [
      {
        key: "editor",
        label: "Code Editor",
        icon: <Terminal />,
        onClick: () => alert("Code Editor"),
      },
      { key: "browser", label: "Browser", icon: <ExternalLink />, onClick: () => alert("Browser") },
      {
        key: "app-sub",
        label: "Other App",
        icon: <Share2 />,
        children: [
          { key: "app1", label: "App One", onClick: () => alert("App One") },
          { key: "app2", label: "App Two", onClick: () => alert("App Two") },
          { key: "app3", label: "App Three", onClick: () => alert("App Three") },
        ],
      },
    ],
  },
  { key: "sep1", label: "", separator: true },
  { key: "star", label: "Add to Favourites", icon: <Star />, onClick: () => alert("Starred") },
  { key: "info", label: "Properties", icon: <Info />, onClick: () => alert("Properties") },
  { key: "refresh", label: "Refresh", icon: <RefreshCw />, onClick: () => alert("Refresh") },
  { key: "sep2", label: "", separator: true },
  { key: "download", label: "Download", icon: <Download />, onClick: () => alert("Download") },
  {
    key: "delete",
    label: "Move to Trash",
    icon: <Trash2 />,
    danger: true,
    onClick: () => alert("Delete"),
  },
];

const dataConfig: ContextMenuItem[] = [
  { key: "copy", label: "Copy Cell", icon: <Copy />, shortcut: "⌘C" },
  { key: "paste", label: "Paste", icon: <Clipboard />, shortcut: "⌘V" },
  { key: "sep", label: "", separator: true },
  { key: "insert-above", label: "Insert Row Above", disabled: true },
  { key: "insert-below", label: "Insert Row Below" },
  { key: "delete-row", label: "Delete Row", danger: true },
];

const basicCode = `import { ContextMenu } from "@jacshuo/onyx";

const items = [
  { key: "copy", label: "Copy", icon: <Copy />, shortcut: "⌘C", onClick: () => {} },
  { key: "sep", label: "", separator: true },
  { key: "delete", label: "Delete", icon: <Trash2 />, danger: true, onClick: () => {} },
];

// Desktop: right-click to open | Mobile: long-press to open
<ContextMenu items={items}>
  <div className="rounded-lg border border-dashed p-8 text-center">
    Right-click or long-press me
  </div>
</ContextMenu>`;

const nestedCode = `const nestedItems = [
  { key: "open", label: "Open", icon: <FolderOpen /> },
  {
    key: "open-with",
    label: "Open With",
    icon: <ArrowRight />,
    children: [
      { key: "editor", label: "Code Editor", icon: <Terminal /> },
      { key: "browser", label: "Browser", icon: <ExternalLink /> },
      {
        key: "more",
        label: "Other App",
        children: [
          { key: "app1", label: "App One" },
          { key: "app2", label: "App Two" },
        ],
      },
    ],
  },
  { key: "delete", label: "Move to Trash", icon: <Trash2 />, danger: true },
];

<ContextMenu items={nestedItems}>
  <Card>File.pdf</Card>
</ContextMenu>`;

const wrapCode = `// Wrap multiple elements — context menu applies to all
<ContextMenu items={items}>
  <div className="grid grid-cols-3 gap-4">
    {files.map(f => <FileCard key={f.id} file={f} />)}
  </div>
</ContextMenu>`;

const propRows = [
  {
    prop: "items",
    type: "ContextMenuItem[]",
    required: true,
    description: "Menu data — supports nested children for submenus",
  },
  {
    prop: "children",
    type: "ReactNode",
    required: true,
    description: "Trigger element(s) — context menu applies to all descendants",
  },
  { prop: "disabled", type: "boolean", description: "Disables context menu activation" },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    description: "Called when the menu opens or closes",
  },
];

const itemRows = [
  { prop: "key", type: "string", required: true, description: "Unique identifier" },
  { prop: "label", type: "ReactNode", required: true, description: "Display text" },
  { prop: "icon", type: "ReactNode", description: "Leading icon" },
  { prop: "shortcut", type: "string", description: "Keyboard shortcut shown on the right" },
  { prop: "disabled", type: "boolean", description: "Grays out item and ignores clicks" },
  { prop: "danger", type: "boolean", description: "Renders in danger/red color" },
  { prop: "separator", type: "boolean", description: "Renders a divider line instead of an item" },
  {
    prop: "children",
    type: "ContextMenuItem[]",
    description: "Nested submenu items (infinite depth)",
  },
  { prop: "onClick", type: "(e: MouseEvent) => void", description: "Click handler" },
];

export default function ContextMenuPage() {
  const [log, setLog] = useState<string[]>([]);

  const loggedItems: ContextMenuItem[] = [
    {
      key: "copy",
      label: "Copy",
      icon: <Copy />,
      shortcut: "⌘C",
      onClick: () =>
        setLog((l) => [`Copy clicked at ${new Date().toLocaleTimeString()}`, ...l.slice(0, 4)]),
    },
    {
      key: "share",
      label: "Share",
      icon: <Share2 />,
      onClick: () =>
        setLog((l) => [`Share clicked at ${new Date().toLocaleTimeString()}`, ...l.slice(0, 4)]),
    },
    { key: "sep", label: "", separator: true },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash2 />,
      danger: true,
      onClick: () =>
        setLog((l) => [`Delete clicked at ${new Date().toLocaleTimeString()}`, ...l.slice(0, 4)]),
    },
  ];

  return (
    <div className="space-y-8">
      <PageTitle>ContextMenu</PageTitle>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">
        Floating context menu activated by <strong>right-click</strong> on desktop or{" "}
        <strong>long-press (500 ms)</strong> on mobile/touch. Supports infinite-depth{" "}
        <strong>submenus</strong>, icons, shortcuts, disabled/danger items, and is{" "}
        <strong>data-driven</strong> via the{" "}
        <code className="rounded bg-primary-100 px-1 py-0.5 text-xs dark:bg-primary-800">
          items
        </code>{" "}
        prop. Works with Electron (uses native DOM events, no browser-specific APIs).
      </p>

      <Section title="Basic usage">
        <ContextMenu items={basicItems}>
          <div className="flex cursor-context-menu items-center justify-center rounded-xl border-2 border-dashed border-primary-300 bg-primary-50/50 p-12 text-sm text-secondary-500 transition-colors hover:border-primary-400 hover:bg-primary-50 dark:border-primary-700 dark:bg-primary-900/30 dark:hover:border-primary-600">
            🖱 Right-click (desktop) or hold (mobile) to open context menu
          </div>
        </ContextMenu>
        <CodeExample code={basicCode} />
      </Section>

      <Section title="Nested submenus (3 levels)">
        <ContextMenu items={nestedItems}>
          <div className="flex cursor-context-menu items-center gap-4 rounded-xl border border-primary-200 bg-white p-6 shadow-sm dark:border-primary-700 dark:bg-primary-900">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-800 dark:text-primary-300">
              <FolderOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-primary-800 dark:text-primary-100">Project.zip</p>
              <p className="text-xs text-secondary-500">
                Right-click for context menu with submenus
              </p>
            </div>
          </div>
        </ContextMenu>
        <CodeExample code={nestedCode} />
      </Section>

      <Section title="Wrapping multiple elements">
        <ContextMenu items={dataConfig}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["Q1 Data", "Q2 Data", "Q3 Data", "Q4 Data"].map((cell) => (
              <div
                key={cell}
                className="cursor-context-menu rounded-lg border border-primary-200 bg-white p-4 text-center text-sm font-medium text-primary-700 shadow-sm transition-colors hover:border-primary-400 hover:bg-primary-50 dark:border-primary-700 dark:bg-primary-900 dark:text-primary-200"
              >
                {cell}
              </div>
            ))}
          </div>
        </ContextMenu>
        <CodeExample code={wrapCode} />
      </Section>

      <Section title="With action log">
        <div className="grid gap-4 sm:grid-cols-2">
          <ContextMenu items={loggedItems} onOpenChange={(open) => !open && setLog((l) => l)}>
            <div className="flex cursor-context-menu items-center justify-center rounded-xl border-2 border-dashed border-primary-300 bg-primary-50/50 p-10 text-sm text-secondary-500 hover:border-primary-400 dark:border-primary-700 dark:bg-primary-900/30">
              Right-click to interact
            </div>
          </ContextMenu>
          <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-4 dark:border-primary-700 dark:bg-primary-900/30">
            <p className="mb-2 text-xs font-semibold text-secondary-500">Action log:</p>
            {log.length === 0 ? (
              <p className="text-xs text-secondary-400 italic">No actions yet…</p>
            ) : (
              <ul className="space-y-1">
                {log.map((entry, i) => (
                  <li key={i} className="text-xs text-primary-600 dark:text-primary-300">
                    {entry}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>

      <Section title="Disabled state">
        <ContextMenu items={basicItems} disabled>
          <div className="flex cursor-not-allowed items-center justify-center rounded-xl border-2 border-dashed border-secondary-200 bg-secondary-50 p-10 text-sm text-secondary-400 dark:border-secondary-700 dark:bg-secondary-900/20">
            Context menu is disabled on this element
          </div>
        </ContextMenu>
      </Section>

      <Section title="ContextMenu Props">
        <PropTable rows={propRows} />
      </Section>

      <Section title="ContextMenuItem Shape">
        <PropTable rows={itemRows} />
      </Section>
    </div>
  );
}
