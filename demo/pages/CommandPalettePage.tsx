import { useState, useCallback } from "react";
import {
  Settings,
  Search,
  FileText,
  Terminal,
  GitBranch,
  Palette,
  Bell,
  Moon,
  Sun,
  User,
  LogOut,
  Keyboard,
  HelpCircle,
  Zap,
  Database,
  Cloud,
  Shield,
} from "lucide-react";
import { CommandPalette, type CommandItem } from "../../src";
import { Button } from "../../src";
import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "./helpers";

/* ── Shared command datasets ───────────────────────────── */

const BASIC_COMMANDS: CommandItem[] = [
  {
    id: "new-file",
    label: "New File",
    description: "Create a new file in the workspace",
    icon: <FileText className="h-3.5 w-3.5" />,
    shortcut: ["⌘", "N"],
    onSelect: () => alert("New File"),
  },
  {
    id: "open-terminal",
    label: "Open Terminal",
    description: "Launch an integrated terminal session",
    icon: <Terminal className="h-3.5 w-3.5" />,
    shortcut: ["⌘", "`"],
    onSelect: () => alert("Open Terminal"),
  },
  {
    id: "search",
    label: "Search Files",
    description: "Find files across the workspace",
    icon: <Search className="h-3.5 w-3.5" />,
    shortcut: ["⌘", "P"],
    onSelect: () => alert("Search Files"),
  },
  {
    id: "settings",
    label: "Open Settings",
    description: "Edit user and workspace preferences",
    icon: <Settings className="h-3.5 w-3.5" />,
    shortcut: ["⌘", ","],
    onSelect: () => alert("Open Settings"),
  },
];

const GROUPED_COMMANDS: CommandItem[] = [
  {
    id: "g-branch",
    label: "Checkout Branch",
    description: "Switch to an existing git branch",
    icon: <GitBranch className="h-3.5 w-3.5" />,
    group: "Git",
    keywords: ["git", "switch", "checkout"],
    onSelect: () => alert("Checkout Branch"),
  },
  {
    id: "g-commit",
    label: "Commit Changes",
    description: "Stage and commit your current changes",
    icon: <GitBranch className="h-3.5 w-3.5" />,
    group: "Git",
    shortcut: ["⌘", "⇧", "G"],
    onSelect: () => alert("Commit Changes"),
  },
  {
    id: "t-light",
    label: "Light Theme",
    description: "Switch to the light colour scheme",
    icon: <Sun className="h-3.5 w-3.5" />,
    group: "Theme",
    onSelect: () => alert("Light Theme"),
  },
  {
    id: "t-dark",
    label: "Dark Theme",
    description: "Switch to the dark colour scheme",
    icon: <Moon className="h-3.5 w-3.5" />,
    group: "Theme",
    onSelect: () => alert("Dark Theme"),
  },
  {
    id: "t-accent",
    label: "Accent Colour",
    description: "Customise the primary accent colour",
    icon: <Palette className="h-3.5 w-3.5" />,
    group: "Theme",
    onSelect: () => alert("Accent Colour"),
  },
  {
    id: "n-enable",
    label: "Enable Notifications",
    description: "Turn on desktop notifications",
    icon: <Bell className="h-3.5 w-3.5" />,
    group: "Notifications",
    onSelect: () => alert("Enable Notifications"),
  },
];

const RICH_COMMANDS: CommandItem[] = [
  {
    id: "r-profile",
    label: "View Profile",
    description: "Open your user profile page",
    icon: <User className="h-3.5 w-3.5" />,
    group: "Account",
    onSelect: () => alert("View Profile"),
  },
  {
    id: "r-signout",
    label: "Sign Out",
    description: "End your current session",
    icon: <LogOut className="h-3.5 w-3.5" />,
    group: "Account",
    onSelect: () => alert("Sign Out"),
  },
  {
    id: "r-shortcuts",
    label: "Keyboard Shortcuts",
    description: "View all keyboard shortcuts",
    icon: <Keyboard className="h-3.5 w-3.5" />,
    shortcut: ["⌘", "?"],
    group: "Help",
    onSelect: () => alert("Keyboard Shortcuts"),
  },
  {
    id: "r-help",
    label: "Open Documentation",
    description: "Browse the full docs site",
    icon: <HelpCircle className="h-3.5 w-3.5" />,
    group: "Help",
    onSelect: () => alert("Open Documentation"),
  },
  {
    id: "r-perf",
    label: "Performance Monitor",
    description: "Real-time resource usage dashboard",
    icon: <Zap className="h-3.5 w-3.5" />,
    group: "Developer",
    keywords: ["cpu", "memory", "profiler"],
    onSelect: () => alert("Performance Monitor"),
  },
  {
    id: "r-db",
    label: "Database Explorer",
    description: "Browse and query connected databases",
    icon: <Database className="h-3.5 w-3.5" />,
    group: "Developer",
    onSelect: () => alert("Database Explorer"),
  },
  {
    id: "r-deploy",
    label: "Deploy to Cloud",
    description: "Push current build to production",
    icon: <Cloud className="h-3.5 w-3.5" />,
    group: "Developer",
    shortcut: ["⌘", "⇧", "D"],
    disabled: true,
    onSelect: () => {},
  },
  {
    id: "r-security",
    label: "Security Audit",
    description: "Scan project for known vulnerabilities",
    icon: <Shield className="h-3.5 w-3.5" />,
    group: "Developer",
    onSelect: () => alert("Security Audit"),
  },
];

/* ── Prop rows ─────────────────────────────────────────── */

const PROP_ROWS: PropRow[] = [
  {
    prop: "open",
    type: "boolean",
    required: true,
    description: "Controlled open/close state.",
  },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    required: true,
    description: "Called whenever the palette should open or close.",
  },
  {
    prop: "commands",
    type: "CommandItem[]",
    required: true,
    description: "Full list of available commands.",
  },
  {
    prop: "placeholder",
    type: "string",
    default: '"Type a command…"',
    description: "Placeholder text inside the search input.",
  },
  {
    prop: "hotkey",
    type: "boolean",
    default: "true",
    description: "Register a global Ctrl/Cmd+K hotkey to toggle the palette.",
  },
  {
    prop: "maxItems",
    type: "number",
    default: "8",
    description: "Max visible rows before the results list scrolls.",
  },
  {
    prop: "className",
    type: "string",
    description: "Extra class applied to the dialog panel.",
  },
];

const ITEM_PROP_ROWS: PropRow[] = [
  { prop: "id", type: "string", required: true, description: "Unique identifier." },
  { prop: "label", type: "string", required: true, description: "Primary display text." },
  {
    prop: "description",
    type: "string",
    description: "Secondary line shown below the label.",
  },
  { prop: "icon", type: "ReactNode", description: "Small icon rendered in a bubble on the left." },
  {
    prop: "shortcut",
    type: "string[]",
    description: 'Keyboard shortcut keys shown on the right, e.g. ["⌘", "K"].',
  },
  { prop: "group", type: "string", description: "Group heading this item belongs to." },
  {
    prop: "keywords",
    type: "string[]",
    description: "Extra search terms that don't appear in the UI.",
  },
  { prop: "disabled", type: "boolean", description: "Excludes this item from search results." },
  { prop: "onSelect", type: "() => void", required: true, description: "Called when selected." },
];

/* ── Page ──────────────────────────────────────────────── */

export default function CommandPalettePage() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [groupedOpen, setGroupedOpen] = useState(false);
  const [richOpen, setRichOpen] = useState(false);
  const [hotkeyOpen, setHotkeyOpen] = useState(false);

  const openHotkey = useCallback(() => setHotkeyOpen(true), []);

  return (
    <div className="space-y-10 p-6">
      <PageTitle>CommandPalette</PageTitle>

      {/* ── 1. Basic ──────────────────────────────────── */}
      <Section title="Basic Usage">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Click the button or press{" "}
          <kbd className="rounded border border-primary-200 px-1.5 py-0.5 text-xs dark:border-primary-700">
            Ctrl
          </kbd>{" "}
          +{" "}
          <kbd className="rounded border border-primary-200 px-1.5 py-0.5 text-xs dark:border-primary-700">
            K
          </kbd>{" "}
          to open. Arrow keys navigate; Enter selects; Escape closes.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => setBasicOpen(true)}>Open Command Palette</Button>
        </div>
        <CommandPalette
          open={basicOpen}
          onOpenChange={setBasicOpen}
          commands={BASIC_COMMANDS}
          hotkey={false}
        />
        <CodeExample
          code={`import { CommandPalette, type CommandItem } from "@jacshuo/onyx";

const commands: CommandItem[] = [
  {
    id: "new-file",
    label: "New File",
    description: "Create a new file in the workspace",
    icon: <FileText className="h-3.5 w-3.5" />,
    shortcut: ["⌘", "N"],
    onSelect: () => console.log("New File"),
  },
  // …
];

function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        commands={commands}
        hotkey={false}
      />
    </>
  );
}`}
        />
      </Section>

      {/* ── 2. Global hotkey ──────────────────────────── */}
      <Section title="Global Hotkey (Ctrl / ⌘ + K)">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Set <code className="text-xs">hotkey</code> to <code className="text-xs">true</code> (the
          default) to register a global{" "}
          <kbd className="rounded border border-primary-200 px-1.5 py-0.5 text-xs dark:border-primary-700">
            Ctrl+K
          </kbd>{" "}
          /{" "}
          <kbd className="rounded border border-primary-200 px-1.5 py-0.5 text-xs dark:border-primary-700">
            ⌘K
          </kbd>{" "}
          handler automatically. Only one palette per page should use{" "}
          <code className="text-xs">hotkey=true</code>.
        </p>
        <div className="flex gap-3">
          <Button onClick={openHotkey}>Open (or press Ctrl+K)</Button>
        </div>
        <CommandPalette
          open={hotkeyOpen}
          onOpenChange={setHotkeyOpen}
          commands={BASIC_COMMANDS}
          hotkey={true}
          placeholder="Search or run a command…"
        />
        <CodeExample
          code={`// hotkey={true} is the default — no extra wiring needed
<CommandPalette
  open={open}
  onOpenChange={setOpen}
  commands={commands}
/>`}
        />
      </Section>

      {/* ── 3. Grouped commands ───────────────────────── */}
      <Section title="Grouped Commands">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Set a <code className="text-xs">group</code> string on each command to render labelled
          sections. Items without a group are listed first.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => setGroupedOpen(true)}>Open Grouped Palette</Button>
        </div>
        <CommandPalette
          open={groupedOpen}
          onOpenChange={setGroupedOpen}
          commands={GROUPED_COMMANDS}
          hotkey={false}
        />
        <CodeExample
          code={`const commands: CommandItem[] = [
  { id: "branch", label: "Checkout Branch", group: "Git", onSelect: () => {} },
  { id: "commit", label: "Commit Changes",  group: "Git", onSelect: () => {} },
  { id: "light",  label: "Light Theme",     group: "Theme", onSelect: () => {} },
  { id: "dark",   label: "Dark Theme",      group: "Theme", onSelect: () => {} },
];`}
        />
      </Section>

      {/* ── 4. Rich commands with all features ────────── */}
      <Section title="Rich Commands — Icons, Shortcuts, Disabled, Keywords">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Commands support icons, keyboard shortcut badges, hidden search keywords, and a{" "}
          <code className="text-xs">disabled</code> flag that hides the item from results entirely.
          Try searching <em>&ldquo;cpu&rdquo;</em>, <em>&ldquo;profiler&rdquo;</em>, or{" "}
          <em>&ldquo;deploy&rdquo;</em>.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => setRichOpen(true)}>Open Rich Palette</Button>
        </div>
        <CommandPalette
          open={richOpen}
          onOpenChange={setRichOpen}
          commands={RICH_COMMANDS}
          hotkey={false}
          maxItems={6}
        />
        <CodeExample
          code={`{
  id: "perf",
  label: "Performance Monitor",
  description: "Real-time resource usage dashboard",
  icon: <Zap className="h-3.5 w-3.5" />,
  group: "Developer",
  keywords: ["cpu", "memory", "profiler"],   // hidden search aliases
  onSelect: () => navigate("/perf"),
},
{
  id: "deploy",
  label: "Deploy to Cloud",
  shortcut: ["⌘", "⇧", "D"],
  disabled: true,   // excluded from results
  onSelect: () => {},
},`}
        />
      </Section>

      {/* ── 5. maxItems ───────────────────────────────── */}
      <Section title="maxItems — Scroll Control">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          <code className="text-xs">maxItems</code> controls how many rows are visible before the
          results area scrolls. Default is <code className="text-xs">8</code>.
        </p>
        <CodeExample
          code={`// Show only 4 rows before scrolling
<CommandPalette
  open={open}
  onOpenChange={setOpen}
  commands={commands}
  maxItems={4}
/>`}
        />
      </Section>

      {/* ── Prop tables ───────────────────────────────── */}
      <Section title="CommandPalette Props">
        <PropTable rows={PROP_ROWS} />
      </Section>

      <Section title="CommandItem Props">
        <PropTable rows={ITEM_PROP_ROWS} />
      </Section>
    </div>
  );
}
