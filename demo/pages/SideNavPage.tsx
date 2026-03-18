import { useState } from "react";
import { SideNav, Button, type SideNavItem, type SideNavCollapseMode } from "../../src";
import { Section, PageTitle } from "./helpers";
import { Home, Settings, User, FileText, Mail, FolderOpen, Database } from "lucide-react";

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

  return (
    <div className="space-y-8">
      <PageTitle>SideNav</PageTitle>

      <Section title="With icons and nested groups">
        <div className="w-56 rounded-lg border border-primary-200 p-3 dark:border-primary-700">
          <SideNav items={items} title="App Navigation" />
        </div>
      </Section>

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
          />
        </div>
      </Section>

      <Section title="Without indent lines">
        <div className="w-56 rounded-lg border border-primary-200 p-3 dark:border-primary-700">
          <SideNav items={items} title="App Navigation" showLines={false} />
        </div>
      </Section>

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
          />
        </div>
      </Section>
    </div>
  );
}
