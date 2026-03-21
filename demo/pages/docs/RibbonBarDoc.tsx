import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const ribbonBarProps: PropRow[] = [
  {
    prop: "tabs",
    type: "RibbonTab[]",
    required: true,
    description: "Tab definitions (each contains groups of items)",
  },
  {
    prop: "defaultTab",
    type: "string",
    description: "Key of the initially selected tab (uncontrolled)",
  },
  { prop: "activeTab", type: "string", description: "Controlled active tab key" },
  {
    prop: "onTabChange",
    type: "(key: string) => void",
    description: "Called when the user switches tabs",
  },
  {
    prop: "mode",
    type: `"full" | "compact" | "icons"`,
    default: `"full"`,
    description: "Display density — full stacks icon+label, compact is inline, icons hides labels",
  },
  {
    prop: "onModeChange",
    type: "(mode: RibbonMode) => void",
    description: "Called when mode changes via the chevron toggle",
  },
  {
    prop: "sticky",
    type: "boolean",
    description: "Positions the ribbon with position: sticky and top: 0",
  },
  { prop: "className", type: "string", description: "Extra class on the root element" },
];

const ribbonTabProps: PropRow[] = [
  { prop: "key", type: "string", required: true, description: "Unique identifier for the tab" },
  { prop: "label", type: "string", required: true, description: "Tab button label" },
  {
    prop: "groups",
    type: "RibbonGroup[]",
    required: true,
    description: "Command groups within the tab panel",
  },
  { prop: "icon", type: "ReactNode", description: "Optional tab icon" },
  { prop: "hidden", type: "boolean", description: "Hides the tab from the strip" },
  {
    prop: "disabled",
    type: "boolean",
    description: "Disables the tab button and every item inside (grayed out, non-interactive)",
  },
];

const ribbonGroupProps: PropRow[] = [
  { prop: "key", type: "string", required: true, description: "Unique identifier for the group" },
  { prop: "label", type: "string", required: true, description: "Group footer label" },
  {
    prop: "items",
    type: "RibbonItem[]",
    required: true,
    description: "Command buttons in the group",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Disables all items in this group (dimmed + non-interactive)",
  },
];

const ribbonItemProps: PropRow[] = [
  { prop: "key", type: "string", required: true, description: "Unique item identifier" },
  { prop: "label", type: "string", required: true, description: "Button caption" },
  { prop: "icon", type: "ReactNode", description: "Lucide icon or any JSX" },
  { prop: "disabled", type: "boolean", description: "Grays out the button and prevents clicks" },
  { prop: "active", type: "boolean", description: "Shows a pressed/active highlight" },
  {
    prop: "separator",
    type: "boolean",
    description: "Renders a vertical divider instead of a button",
  },
  { prop: "title", type: "string", description: "Tooltip shown on hover (falls back to label)" },
  { prop: "onClick", type: "() => void", description: "Click handler" },
];

const importCode = `import { RibbonBar } from "@jacshuo/onyx";
import type { RibbonBarProps, RibbonTab, RibbonGroup, RibbonItem, RibbonMode } from "@jacshuo/onyx";`;

const usageCode = `import { RibbonBar } from "@jacshuo/onyx";
import type { RibbonTab } from "@jacshuo/onyx";
import { Bold, Italic, Underline, AlignLeft, Copy, Clipboard } from "lucide-react";

const tabs: RibbonTab[] = [
  {
    key: "home",
    label: "Home",
    groups: [
      {
        key: "clipboard",
        label: "Clipboard",
        items: [
          { key: "copy",  label: "Copy",  icon: <Copy size={18} />,      onClick: copy },
          { key: "paste", label: "Paste", icon: <Clipboard size={18} />, onClick: paste },
        ],
      },
      {
        key: "font",
        label: "Font",
        items: [
          { key: "bold",      label: "Bold",      icon: <Bold size={18} />,      active: isBold },
          { key: "italic",    label: "Italic",    icon: <Italic size={18} /> },
          { key: "underline", label: "Underline", icon: <Underline size={18} /> },
        ],
      },
    ],
  },
  // Disable an entire tab—grays out the tab button and all its items
  { key: "insert", label: "Insert", disabled: true, groups: [] },
];

// Sticky ribbon with full mode (icon + label stacked)
<RibbonBar tabs={tabs} defaultTab="home" sticky />

// Controlled mode
<RibbonBar tabs={tabs} mode={mode} onModeChange={setMode} />

// Controlled active tab
<RibbonBar tabs={tabs} activeTab={tab} onTabChange={setTab} />

// Disable a single group inside a tab
const tabsWithDisabledGroup = [{
  key: "home",
  label: "Home",
  groups: [
    { key: "clipboard", label: "Clipboard", disabled: true, items: [...] },
    { key: "font",      label: "Font",                      items: [...] },
  ],
}];`;

const typeCode = `import type { RibbonMode, RibbonItem, RibbonGroup, RibbonTab, RibbonBarProps } from "@jacshuo/onyx";

type RibbonMode = "full" | "compact" | "icons";

interface RibbonItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  separator?: boolean;   // renders a vertical divider
  title?: string;        // hover tooltip
  onClick?: () => void;
}

interface RibbonGroup {
  key: string;
  label: string;
  items: RibbonItem[];
  disabled?: boolean;    // disables every item in the group
}

interface RibbonTab {
  key: string;
  label: string;
  icon?: React.ReactNode;
  groups: RibbonGroup[];
  hidden?: boolean;      // hides the tab from the strip
  disabled?: boolean;    // disables the tab button + all its groups/items
}

interface RibbonBarProps {
  tabs: RibbonTab[];
  defaultTab?: string;                       // uncontrolled initial tab
  activeTab?: string;                        // controlled active tab
  onTabChange?: (key: string) => void;
  mode?: RibbonMode;                         // display density
  onModeChange?: (mode: RibbonMode) => void;
  sticky?: boolean;
  className?: string;
}`;

export default function RibbonBarDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>RibbonBar</PageTitle>

      <Section title="Import">
        <CodeExample code={importCode} />
      </Section>

      <Section title="Description">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          A Microsoft Office-style command ribbon. The bar is entirely <strong>data-driven</strong>{" "}
          via a&nbsp;<code>tabs → groups → items</code> tree. Three display modes are supported:{" "}
          <code>full</code> (icon + label vertically stacked), <code>compact</code> (icon + label
          inline), and <code>icons</code> (icon only). Clicking the active tab or the chevron button
          collapses the command panel so only the tab strip remains visible. Sticky positioning
          keeps the ribbon at the top of the scroll container.
        </p>
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Types">
        <CodeExample code={typeCode} />
      </Section>

      <Section title="RibbonItem Props">
        <PropTable rows={ribbonItemProps} />
      </Section>

      <Section title="RibbonGroup Props">
        <PropTable rows={ribbonGroupProps} />
      </Section>

      <Section title="RibbonTab Props">
        <PropTable rows={ribbonTabProps} />
      </Section>

      <Section title="RibbonBar Props">
        <PropTable rows={ribbonBarProps} />
      </Section>
    </div>
  );
}
