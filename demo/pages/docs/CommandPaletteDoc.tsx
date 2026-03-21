import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const commandItemProps: PropRow[] = [
  { prop: "id", type: "string", required: true, description: "Unique identifier" },
  { prop: "label", type: "string", required: true, description: "Primary display label" },
  {
    prop: "onSelect",
    type: "() => void",
    required: true,
    description: "Called when user selects this command",
  },
  { prop: "description", type: "string", description: "Sub-label shown below the label" },
  { prop: "icon", type: "React.ReactNode", description: "Leading icon element" },
  { prop: "shortcut", type: "string[]", description: `Keyboard shortcut badge, e.g. ["⌘", "K"]` },
  { prop: "group", type: "string", description: "Group heading to categorise this item" },
  { prop: "keywords", type: "string[]", description: "Extra search terms not shown in UI" },
  { prop: "disabled", type: "boolean", default: "false", description: "Dim and prevent selection" },
];

const commandPaletteProps: PropRow[] = [
  { prop: "open", type: "boolean", required: true, description: "Controlled open state" },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    required: true,
    description: "Open state change handler",
  },
  {
    prop: "commands",
    type: "CommandItem[]",
    required: true,
    description: "Full list of available commands",
  },
  {
    prop: "placeholder",
    type: "string",
    default: `"Type a command or search…"`,
    description: "Search input placeholder",
  },
  {
    prop: "hotkey",
    type: "boolean",
    default: "true",
    description: "Register global Ctrl/Cmd+K hotkey to toggle the palette",
  },
  {
    prop: "maxItems",
    type: "number",
    default: "8",
    description: "Max result rows before the list scrolls",
  },
  { prop: "className", type: "string", description: "Extra class applied to the dialog panel" },
];

const usageCode = `import { useState } from "react";
import { CommandPalette, type CommandItem, Button } from "@jacshuo/onyx";

const commands: CommandItem[] = [
  {
    id: "new-file",
    label: "New File",
    description: "Create a new document",
    shortcut: ["⌘", "N"],
    group: "File",
    onSelect: () => console.log("New file"),
  },
  {
    id: "open",
    label: "Open…",
    shortcut: ["⌘", "O"],
    group: "File",
    onSelect: () => console.log("Open"),
  },
  {
    id: "theme-dark",
    label: "Toggle Dark Mode",
    group: "Appearance",
    keywords: ["theme", "dark", "light"],
    onSelect: () => document.documentElement.classList.toggle("dark"),
  },
];

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Palette (⌘K)</Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        commands={commands}
        placeholder="Search commands…"
      />
    </>
  );
}`;

const typesCode = `export type CommandItem = {
  id: string;
  label: string;
  onSelect: () => void;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  group?: string;
  keywords?: string[];
  disabled?: boolean;
};

export type CommandGroup = {
  label: string;
  items: CommandItem[];
};

export type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: CommandItem[];
  placeholder?: string;
  hotkey?: boolean;
  maxItems?: number;
  className?: string;
};`;

export default function CommandPaletteDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>CommandPalette</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { CommandPalette, type CommandPaletteProps, type CommandItem, type CommandGroup } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="CommandItem Props">
        <PropTable rows={commandItemProps} title="CommandItem" />
      </Section>

      <Section title="CommandPalette Props">
        <PropTable rows={commandPaletteProps} title="CommandPalette" />
      </Section>

      <Section title="Usage">
        <p className="mb-3 text-sm text-secondary-600 dark:text-secondary-400">
          Wrap your app with <code>ToastProvider</code> at the root. Open/close the palette with the{" "}
          <code>open</code> prop or press <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd> globally.
        </p>
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>
    </div>
  );
}
