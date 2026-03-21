import { useState } from "react";
import { SideNav, Button, Input, type SideNavItem, type SideNavCollapseMode } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";
import { Home, Settings, User, FileText, Mail, FolderOpen, Database, Search } from "lucide-react";

const withIconsCode = `<SideNav
  items={[
    { key: "dashboard", label: "Dashboard", path: "#", icon: <Home /> },
    { key: "profile",   label: "Profile",   path: "#", icon: <User /> },
    {
      label: "Documents", icon: <FileText />,
      children: [
        { key: "invoices", label: "Invoices", path: "#" },
        { key: "reports",  label: "Reports",  path: "#" },
      ],
    },
  ]}
  title="App Navigation"
/>`;

const collapsibleCode = `{/* collapseMode: "expanded" | "icons" | "mini" */}
<SideNav
  items={items}
  title="App Navigation"
  collapsible
  collapseMode={mode}
  onCollapseModeChange={setMode}
/>`;

const noLinesCode = `<SideNav items={items} title="App Navigation" showLines={false} />`;

const programmaticCode = `const [expanded, setExpanded] = useState(new Set(["Documents"]));

<SideNav
  items={items}
  expandedKeys={expanded}
  onExpandedKeysChange={setExpanded}
/>`;

const responsiveCode = `{/* Pull-tab is rendered automatically on narrow viewports.
   Drag it up/down to reposition, across to change side.
   Position is persisted in localStorage. */}
<SideNav
  items={items}
  mobileTopOffset={56} // set to your app-bar height
/>`;

const mobileDrawerSlotCode = `import { Input } from "@jacshuo/onyx";
import { Search } from "lucide-react";

<SideNav
  items={items}
  mobileDrawerSlot={
    <Input
      placeholder="Search…"
      prefix={<Search className="h-3.5 w-3.5" />}
      size="sm"
    />
  }
/>`;

const items: SideNavItem[] = [
  { key: "dashboard", label: "Dashboard", path: "#", icon: <Home className="h-4 w-4" /> },
  { key: "profile", label: "Profile", path: "#", icon: <User className="h-4 w-4" /> },
  {
    label: "Documents",
    icon: <FileText className="h-4 w-4" />,
    children: [
      { key: "invoices", label: "Invoices", path: "#" },
      { key: "reports", label: "Reports", path: "#" },
      {
        label: "Archives",
        icon: <FolderOpen className="h-4 w-4" />,
        children: [
          { key: "2024", label: "2024", path: "#" },
          { key: "2025", label: "2025", path: "#" },
        ],
      },
    ],
  },
  {
    label: "Data",
    icon: <Database className="h-4 w-4" />,
    children: [
      { key: "import", label: "Import", path: "#" },
      { key: "export", label: "Export", path: "#" },
    ],
  },
  { key: "messages", label: "Messages", path: "#", icon: <Mail className="h-4 w-4" /> },
  { key: "settings", label: "Settings", path: "#", icon: <Settings className="h-4 w-4" /> },
];

const allGroupKeys = new Set(["Documents", "Archives", "Data"]);

export default function SideNavPage() {
  const [mode, setMode] = useState<SideNavCollapseMode>("expanded");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(allGroupKeys));
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-8">
      <PageTitle>SideNav</PageTitle>

      {/* ── With icons and nested groups ─────────────────── */}
      <Section title="With icons and nested groups">
        <div className="w-56 rounded-lg border border-primary-200 p-3 dark:border-primary-700">
          <SideNav items={items} title="App Navigation" responsive={false} />
        </div>
        <CodeExample code={withIconsCode} />
      </Section>

      {/* ── Collapsible ───────────────────────────────────── */}
      <Section title="Collapsible — click ‹‹ to cycle: expanded → icons → mini">
        <div
          className={`rounded-lg border border-primary-200 dark:border-primary-700 transition-all duration-200 ${
            mode === "expanded" ? "w-56 p-3" : mode === "icons" ? "w-16 p-2" : "w-12 p-1"
          }`}
        >
          <SideNav
            items={items}
            title="App Navigation"
            collapsible
            collapseMode={mode}
            onCollapseModeChange={setMode}
            responsive={false}
          />
        </div>
        <CodeExample code={collapsibleCode} />
      </Section>

      {/* ── Without indent lines ──────────────────────────── */}
      <Section title="Without indent lines">
        <div className="w-56 rounded-lg border border-primary-200 p-3 dark:border-primary-700">
          <SideNav items={items} title="App Navigation" showLines={false} responsive={false} />
        </div>
        <CodeExample code={noLinesCode} />
      </Section>

      {/* ── Programmatic expand / collapse ────────────────── */}
      <Section title="Programmatic expand / collapse">
        <div className="mb-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setExpanded(new Set(allGroupKeys))}>
            Expand All
          </Button>
          <Button size="sm" onClick={() => setExpanded(new Set())}>
            Collapse All
          </Button>
          {[...allGroupKeys].map((key) => (
            <Button
              key={key}
              size="sm"
              intent={expanded.has(key) ? "primary" : "outline"}
              onClick={() => {
                const next = new Set(expanded);
                if (next.has(key)) next.delete(key);
                else next.add(key);
                setExpanded(next);
              }}
            >
              {expanded.has(key) ? `Collapse "${key}"` : `Expand "${key}"`}
            </Button>
          ))}
        </div>
        <div className="w-56 rounded-lg border border-primary-200 p-3 dark:border-primary-700">
          <SideNav
            items={items}
            title="App Navigation"
            expandedKeys={expanded}
            onExpandedKeysChange={setExpanded}
            responsive={false}
          />
        </div>
        <CodeExample code={programmaticCode} />
      </Section>

      {/* ── Responsive behavior ───────────────────────────── */}
      <Section title="Responsive — draggable pull-tab (narrow your browser window)">
        <p className="mb-4 max-w-prose text-sm text-primary-500 dark:text-primary-400">
          On viewports narrower than the{" "}
          <code className="text-primary-700 dark:text-primary-300">mobileBreakpoint</code> (default{" "}
          <code className="text-primary-700 dark:text-primary-300">768 px</code>), SideNav renders a
          draggable pull-tab pinned to the viewport edge. Drag it vertically to reposition it, or
          across the screen to snap it to the opposite edge. The position and side are stored in{" "}
          <code className="text-primary-700 dark:text-primary-300">localStorage</code>. Tap the tab
          to open the slide-in drawer.
        </p>
        <CodeExample code={responsiveCode} />
      </Section>

      {/* ── mobileDrawerSlot ──────────────────────────────── */}
      <Section title="Mobile drawer slot (e.g. search input)">
        <p className="mb-4 max-w-prose text-sm text-primary-500 dark:text-primary-400">
          Pass any node to{" "}
          <code className="text-primary-700 dark:text-primary-300">mobileDrawerSlot</code> to inject
          content between the drawer header and the nav list. Narrow your browser below 768 px and
          open the pull-tab to see the search field appear inside the drawer.
        </p>
        <SideNav
          items={items}
          title="With search slot"
          mobileDrawerSlot={
            <Input
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<Search className="h-3.5 w-3.5" />}
              inputSize="sm"
            />
          }
        />
        <CodeExample code={mobileDrawerSlotCode} />
      </Section>
    </div>
  );
}
