import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const sideNavItemProps: PropRow[] = [
  { prop: "key", type: "string", description: "Unique key" },
  { prop: "label", type: "string", required: true, description: "Item label" },
  { prop: "path", type: "string", description: "Navigation path for leaf items" },
  { prop: "icon", type: "React.ReactNode", description: "Category / item icon" },
  { prop: "children", type: "SideNavItem[]", description: "Nested child items" },
  { prop: "defaultOpen", type: "boolean", description: "Initially expanded" },
];

const sideNavProps: PropRow[] = [
  { prop: "items", type: "SideNavItem[]", required: true, description: "Navigation items tree" },
  { prop: "title", type: "string", description: "Sidebar heading" },
  {
    prop: "basePath",
    type: "string",
    default: `"/"`,
    description: "Base path prefix prepended to item paths",
  },
  {
    prop: "onItemClick",
    type: "(item: SideNavItem, fullPath: string) => void",
    description: "Item click callback",
  },
  {
    prop: "LinkComponent",
    type: "ComponentType<SideNavLinkComponentProps>",
    description: "Custom link renderer",
  },
  {
    prop: "collapsible",
    type: "boolean",
    default: "false",
    description: "Enable collapse control button",
  },
  {
    prop: "collapseMode",
    type: `"expanded" | "icons" | "mini"`,
    default: `"expanded"`,
    description: "Controlled collapse state",
  },
  {
    prop: "defaultCollapseMode",
    type: `"expanded" | "icons" | "mini"`,
    default: `"expanded"`,
    description: "Uncontrolled initial collapse state",
  },
  {
    prop: "onCollapseModeChange",
    type: "(mode: SideNavCollapseMode) => void",
    description: "Collapse change callback",
  },
  { prop: "showLines", type: "boolean", default: "true", description: "Show tree guide lines" },
  { prop: "expandedKeys", type: "Set<string>", description: "Controlled expanded group keys" },
  {
    prop: "defaultExpandedKeys",
    type: `Set<string> | "all"`,
    description: "Initial expanded groups (uncontrolled)",
  },
  {
    prop: "onExpandedKeysChange",
    type: "(keys: Set<string>) => void",
    description: "Expansion change callback",
  },
  {
    prop: "responsive",
    type: "boolean",
    default: "true",
    description: "Responsive mobile overlay",
  },
  {
    prop: "mobileBreakpoint",
    type: "number",
    default: "768",
    description: "Breakpoint (px) for mobile mode",
  },
  {
    prop: "mobileTopOffset",
    type: "number",
    default: "48",
    description:
      "Distance (px) from the top of the viewport where the mobile drawer starts. Set to your app-bar height.",
  },
  {
    prop: "mobileDrawerSlot",
    type: "React.ReactNode",
    description:
      "Optional node rendered inside the mobile drawer between the header row and the nav body — ideal for a search input.",
  },
];

const mobilePullTabCode = `// The pull-tab is rendered automatically when responsive={true} (the default).
// It sticks to the left or right viewport edge and the user can:
//   • Drag it up/down along the edge to reposition it
//   • Drag it across the screen to snap it to the opposite edge
//   • Tap it to open the slide-in drawer
//
// Position and side are persisted in localStorage:
//   "onyx-sidenav-side"  → "left" | "right"
//   "onyx-sidenav-top"   → vertical position as % of viewport height

<SideNav
  items={items}
  responsive           // default — enables pull-tab + mobile drawer
  mobileTopOffset={56} // match your app-bar height
/>`;

const mobileDrawerSlotCode = `import { Input } from "@jacshuo/onyx";
import { Search } from "lucide-react";

// Inject any node between the drawer header and the nav list:
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

const usageCode = `import { SideNav, type SideNavItem, type SideNavLinkComponentProps } from "@jacshuo/onyx";
import { NavLink } from "react-router-dom";

function RouterLink({ to, className, style, children }: SideNavLinkComponentProps) {
  return (
    <NavLink to={to} className={({ isActive }) =>
      typeof className === "function" ? className({ isActive }) : className
    } style={style}>
      {children}
    </NavLink>
  );
}

const items: SideNavItem[] = [
  {
    label: "Components",
    children: [
      { label: "Button", path: "button" },
      { label: "Badge",  path: "badge" },
    ],
  },
];

export function Example() {
  return (
    <SideNav
      items={items}
      basePath="/"
      LinkComponent={RouterLink}
      collapsible
    />
  );
}`;

const typesCode = `export type SideNavCollapseMode = "expanded" | "icons" | "mini";

export interface SideNavItem {
  key?:         string;
  label:        string;             // required
  path?:        string;             // renders a link when provided
  children?:    SideNavItem[];      // nested items (collapsible group)
  icon?:        React.ReactNode;
  defaultOpen?: boolean;
}

export type SideNavLinkComponentProps = {
  to:       string;
  className: string | ((props: { isActive: boolean }) => string);
  style?:   React.CSSProperties;
  children: React.ReactNode;
};

export interface SideNavProps extends React.HTMLAttributes<HTMLElement> {
  items:                  SideNavItem[];          // required
  title?:                 string;
  basePath?:              string;                 // default: "/"
  onItemClick?:           (item: SideNavItem, fullPath: string) => void;
  LinkComponent?:         React.ComponentType<SideNavLinkComponentProps>;
  collapsible?:           boolean;
  collapseMode?:          SideNavCollapseMode;    // controlled
  defaultCollapseMode?:   SideNavCollapseMode;    // default: "expanded"
  onCollapseModeChange?:  (mode: SideNavCollapseMode) => void;
  showLines?:             boolean;                // default: true
  expandedKeys?:          Set<string>;
  defaultExpandedKeys?:   Set<string> | "all";
  onExpandedKeysChange?:  (keys: Set<string>) => void;
  responsive?:            boolean;                // default: true — floating mobile drawer
  mobileBreakpoint?:      number;                 // default: 768 px
  mobileTopOffset?:       number;                 // default: 48 — set to header height
  mobileDrawerSlot?:      React.ReactNode;        // injected between drawer header and nav body
}`;

export default function SideNavDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>SideNav</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { SideNav, type SideNavProps, type SideNavItem } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="SideNavItem">
        <PropTable rows={sideNavItemProps} title="SideNavItem" />
      </Section>

      <Section title="SideNav Props">
        <PropTable rows={sideNavProps} title="SideNav" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Draggable Mobile Pull-tab">
        <p className="mb-3 max-w-prose text-sm text-primary-500 dark:text-primary-400">
          When <code className="text-primary-700 dark:text-primary-300">responsive</code> is{" "}
          <code className="text-primary-700 dark:text-primary-300">true</code> (the default), a
          pull-tab is pinned to the viewport edge on narrow screens. Users can drag it vertically
          along either edge or across to the opposite edge. Position and chosen side are
          automatically stored in{" "}
          <code className="text-primary-700 dark:text-primary-300">localStorage</code> and restored
          on the next visit.
        </p>
        <CodeExample code={mobilePullTabCode} />
      </Section>

      <Section title="Mobile Drawer Slot">
        <p className="mb-3 max-w-prose text-sm text-primary-500 dark:text-primary-400">
          Use <code className="text-primary-700 dark:text-primary-300">mobileDrawerSlot</code> to
          inject content (e.g. a search input) between the drawer header and the navigation list.
          The slot is only visible inside the mobile slide-in drawer.
        </p>
        <CodeExample code={mobileDrawerSlotCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>
    </div>
  );
}
