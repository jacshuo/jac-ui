import React, { useState } from "react";
import { RibbonBar } from "../../src";
import type { RibbonTab, RibbonMode } from "../../src";
import { Section, PageTitle, CodeExample, PropTable } from "./helpers";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Copy,
  Clipboard,
  Scissors,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Image,
  Link,
  Table2,
  List,
  Heading1,
  Heading2,
  Save,
  FolderOpen,
  FilePlus,
  Printer,
  Search,
  Eye,
  Moon,
  Grid,
  Layout,
  Layers,
} from "lucide-react";

const editorTabs: RibbonTab[] = [
  {
    key: "home",
    label: "Home",
    groups: [
      {
        key: "clipboard",
        label: "Clipboard",
        items: [
          { key: "paste", label: "Paste", icon: <Clipboard />, onClick: () => alert("Paste") },
          { key: "cut", label: "Cut", icon: <Scissors />, onClick: () => alert("Cut") },
          { key: "copy", label: "Copy", icon: <Copy />, onClick: () => alert("Copy") },
        ],
      },
      {
        key: "undo",
        label: "Undo",
        items: [
          { key: "undo", label: "Undo", icon: <Undo2 />, onClick: () => alert("Undo") },
          { key: "redo", label: "Redo", icon: <Redo2 />, onClick: () => alert("Redo") },
        ],
      },
      {
        key: "font",
        label: "Font",
        items: [
          {
            key: "bold",
            label: "Bold",
            icon: <Bold />,
            active: false,
            onClick: () => alert("Bold"),
          },
          { key: "italic", label: "Italic", icon: <Italic />, onClick: () => alert("Italic") },
          {
            key: "underline",
            label: "Underline",
            icon: <Underline />,
            onClick: () => alert("Underline"),
          },
        ],
      },
      {
        key: "paragraph",
        label: "Paragraph",
        items: [
          {
            key: "align-left",
            label: "Left",
            icon: <AlignLeft />,
            onClick: () => alert("Align left"),
          },
          {
            key: "align-center",
            label: "Center",
            icon: <AlignCenter />,
            active: true,
            onClick: () => alert("Align center"),
          },
          {
            key: "align-right",
            label: "Right",
            icon: <AlignRight />,
            onClick: () => alert("Align right"),
          },
        ],
      },
    ],
  },
  {
    key: "insert",
    label: "Insert",
    groups: [
      {
        key: "content",
        label: "Content",
        items: [
          { key: "image", label: "Image", icon: <Image />, onClick: () => alert("Image") },
          { key: "link", label: "Link", icon: <Link />, onClick: () => alert("Link") },
          { key: "table", label: "Table", icon: <Table2 />, onClick: () => alert("Table") },
          { key: "list", label: "List", icon: <List />, onClick: () => alert("List") },
        ],
      },
      {
        key: "headings",
        label: "Headings",
        items: [
          { key: "h1", label: "H1", icon: <Heading1 />, onClick: () => alert("H1") },
          { key: "h2", label: "H2", icon: <Heading2 />, onClick: () => alert("H2") },
        ],
      },
    ],
  },
  {
    key: "file",
    label: "File",
    groups: [
      {
        key: "file-ops",
        label: "File",
        items: [
          { key: "new", label: "New", icon: <FilePlus />, onClick: () => alert("New") },
          { key: "open", label: "Open", icon: <FolderOpen />, onClick: () => alert("Open") },
          { key: "save", label: "Save", icon: <Save />, onClick: () => alert("Save") },
          {
            key: "print",
            label: "Print",
            icon: <Printer />,
            onClick: () => alert("Print"),
            disabled: false,
          },
        ],
      },
      {
        key: "find",
        label: "Find",
        items: [
          { key: "search", label: "Search", icon: <Search />, onClick: () => alert("Search") },
        ],
      },
    ],
  },
  {
    key: "view",
    label: "View",
    groups: [
      {
        key: "zoom",
        label: "Zoom",
        items: [
          { key: "zoom-in", label: "Zoom In", icon: <ZoomIn />, onClick: () => alert("Zoom In") },
          {
            key: "zoom-out",
            label: "Zoom Out",
            icon: <ZoomOut />,
            onClick: () => alert("Zoom Out"),
          },
        ],
      },
      {
        key: "layout",
        label: "Layout",
        items: [
          { key: "grid", label: "Grid", icon: <Grid />, onClick: () => alert("Grid") },
          {
            key: "layout",
            label: "Layout",
            icon: <Layout />,
            active: true,
            onClick: () => alert("Layout"),
          },
          { key: "layers", label: "Layers", icon: <Layers />, onClick: () => alert("Layers") },
          { key: "theme", label: "Theme", icon: <Moon />, onClick: () => alert("Theme") },
        ],
      },
      {
        key: "preview",
        label: "Preview",
        items: [
          { key: "preview", label: "Preview", icon: <Eye />, onClick: () => alert("Preview") },
        ],
      },
    ],
  },
];

const basicCode = `import { RibbonBar } from "@jacshuo/onyx";

const tabs = [
  {
    key: "home",
    label: "Home",
    groups: [
      {
        key: "clipboard",
        label: "Clipboard",
        items: [
          { key: "paste", label: "Paste", icon: <Clipboard />, onClick: () => {} },
          { key: "cut",   label: "Cut",   icon: <Scissors />, onClick: () => {} },
          { key: "copy",  label: "Copy",  icon: <Copy />,     onClick: () => {} },
        ],
      },
    ],
  },
];

<RibbonBar tabs={tabs} sticky />`;

const modeCode = `// Controlled mode
const [mode, setMode] = useState<RibbonMode>("full");
<RibbonBar
  tabs={tabs}
  mode={mode}
  onModeChange={setMode}
  sticky
/>
// Modes: "full" (icon+label stacked), "compact" (icon+label inline), "icons" (icon only)`;

const propRows = [
  {
    prop: "tabs",
    type: "RibbonTab[]",
    required: true,
    description: "Tab and group/item data structure",
  },
  { prop: "defaultTab", type: "string", description: "Initially active tab key (uncontrolled)" },
  { prop: "activeTab", type: "string", description: "Controlled active tab key" },
  {
    prop: "onTabChange",
    type: "(key: string) => void",
    description: "Called when user clicks a tab",
  },
  {
    prop: "mode",
    type: `"full" | "compact" | "icons"`,
    default: `"full"`,
    description:
      "Display density — full stacks icon+label, compact shows inline, icons hides labels",
  },
  {
    prop: "onModeChange",
    type: "(mode: RibbonMode) => void",
    description: "Called when mode cycles via the toggle button",
  },
  {
    prop: "sticky",
    type: "boolean",
    description: "Sticks the ribbon bar to the top of its container",
  },
];

const tabRows = [
  { prop: "key", type: "string", required: true, description: "Unique tab identifier" },
  { prop: "label", type: "string", required: true, description: "Tab display text" },
  { prop: "icon", type: "ReactNode", description: "Optional tab icon" },
  {
    prop: "groups",
    type: "RibbonGroup[]",
    required: true,
    description: "Command groups in this tab panel",
  },
  { prop: "hidden", type: "boolean", description: "Hides the tab from the strip" },
  {
    prop: "disabled",
    type: "boolean",
    description: "Disables the tab button and all groups/items inside it",
  },
];

export default function RibbonBarPage() {
  const [mode, setMode] = useState<RibbonMode>("full");

  return (
    <div className="space-y-8">
      <PageTitle>RibbonBar</PageTitle>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">
        Microsoft Office–style sticky command bar. Organizes commands into{" "}
        <strong>tabs → groups → items</strong>. Fully data-driven via the{" "}
        <code className="rounded bg-primary-100 px-1 py-0.5 text-xs dark:bg-primary-800">tabs</code>{" "}
        prop. Supports three display modes: <strong>full</strong> (icon + label stacked),{" "}
        <strong>compact</strong> (inline), and <strong>icons</strong> (icon only). Click the chevron
        to collapse/expand the command panel.
      </p>

      <Section title="Full mode (default)">
        <div className="relative h-52 overflow-y-auto rounded-xl border border-primary-200 dark:border-primary-700">
          <RibbonBar tabs={editorTabs} mode="full" sticky />
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <p key={i} className="text-sm text-secondary-500 dark:text-secondary-400">
                Scroll this area — the ribbon stays pinned to the top. Click a tab name to switch
                tabs, click the same tab again or the chevron (↑↓) to collapse/expand the command
                panel.
              </p>
            ))}
          </div>
        </div>
        <CodeExample code={basicCode} />
      </Section>

      <Section title="Compact mode">
        <div className="overflow-hidden rounded-xl border border-primary-200 dark:border-primary-700">
          <RibbonBar tabs={editorTabs} mode="compact" />
        </div>
      </Section>

      <Section title="Icons-only mode">
        <div className="overflow-hidden rounded-xl border border-primary-200 dark:border-primary-700">
          <RibbonBar tabs={editorTabs} mode="icons" />
        </div>
      </Section>

      <Section title="Controlled mode toggle">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(["full", "compact", "icons"] as RibbonMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  mode === m
                    ? "bg-primary-500 text-white"
                    : "bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-800 dark:text-primary-300"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="overflow-hidden rounded-xl border border-primary-200 dark:border-primary-700">
            <RibbonBar tabs={editorTabs} mode={mode} onModeChange={setMode} />
          </div>
        </div>
        <CodeExample code={modeCode} />
      </Section>

      <Section title="Disabled group &amp; tab">
        <div className="overflow-hidden rounded-xl border border-primary-200 dark:border-primary-700">
          <RibbonBar
            tabs={[
              {
                key: "home",
                label: "Home",
                groups: editorTabs[0].groups.map((g, i) =>
                  i === 1 ? { ...g, disabled: true } : g,
                ),
              },
              { ...editorTabs[1], disabled: true },
              editorTabs[2],
            ]}
          />
        </div>
        <p className="text-xs text-secondary-500 dark:text-secondary-400">
          The &ldquo;Undo&rdquo; group and the entire &ldquo;Insert&rdquo; tab are disabled — their
          buttons are dimmed and non-interactive.
        </p>
        <CodeExample
          code={`// Disable an entire group\n{ key: "undo", label: "Undo", disabled: true, items: [...] }\n\n// Disable an entire tab (grays out tab button + all items inside)\n{ key: "insert", label: "Insert", disabled: true, groups: [...] }`}
        />
      </Section>

      <Section title="Sticky ribbon (scroll test)">
        <div className="relative h-64 overflow-y-auto rounded-xl border border-primary-200 dark:border-primary-700">
          <RibbonBar tabs={editorTabs} sticky />
          <div className="space-y-4 p-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <p key={i} className="text-sm text-secondary-500 dark:text-secondary-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scroll down — the ribbon
                stays fixed at the top of this container.
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section title="RibbonBar Props">
        <PropTable rows={propRows} />
      </Section>

      <Section title="RibbonTab Shape">
        <PropTable rows={tabRows} />
      </Section>
    </div>
  );
}
