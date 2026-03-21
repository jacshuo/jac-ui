import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const headerNavItemProps: PropRow[] = [
  { prop: "label", type: "React.ReactNode", required: true, description: "Link text / content" },
  { prop: "href", type: "string", description: "Navigation URL" },
  { prop: "active", type: "boolean", description: "Force active visual state" },
  { prop: "onClick", type: "(e: MouseEvent) => void", description: "Click handler" },
];

const headerActionProps: PropRow[] = [
  { prop: "key", type: "string", description: "Unique key for React reconciliation" },
  { prop: "icon", type: "React.ReactNode", required: true, description: "Action icon element" },
  { prop: "ariaLabel", type: "string", description: "Accessible label for the button" },
  { prop: "onClick", type: "(e: MouseEvent) => void", description: "Click handler" },
  { prop: "href", type: "string", description: "Link URL (renders as an anchor)" },
  { prop: "external", type: "boolean", description: "Open in a new tab (target=_blank)" },
];

const headerProps: PropRow[] = [
  { prop: "brand", type: "React.ReactNode", description: "Brand / logo content" },
  { prop: "onBrandClick", type: "(e: MouseEvent) => void", description: "Brand click handler" },
  { prop: "navItems", type: "HeaderNavItem[]", default: "[]", description: "Navigation links" },
  {
    prop: "actions",
    type: "HeaderAction[]",
    default: "[]",
    description: "Icon action buttons on the right",
  },
  {
    prop: "linkComponent",
    type: "ComponentType<{ href, className, onClick, children }>",
    description: "Custom link renderer (e.g. React Router NavLink)",
  },
  { prop: "height", type: "string", description: "Custom header height (CSS value)" },
  {
    prop: "mobileMenu",
    type: "boolean",
    default: "false",
    description: "Enable mobile hamburger menu",
  },
  { prop: "navMenuIcon", type: "React.ReactNode", description: "Custom nav menu icon" },
  { prop: "actionsMenuIcon", type: "React.ReactNode", description: "Custom actions menu icon" },
];

const usageCode = `import { Header, type HeaderNavItem } from "@jacshuo/onyx";
import { NavLink } from "react-router-dom";

function RouterLink({ href, className, onClick, children }) {
  return <NavLink to={href} className={className} onClick={onClick}>{children}</NavLink>;
}

const navItems: HeaderNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs" },
];

export function Example() {
  return (
    <Header
      brand={<span>MyApp</span>}
      navItems={navItems}
      linkComponent={RouterLink}
      mobileMenu
    />
  );
}`;

const typesCode = `export interface HeaderNavItem {
  label:    React.ReactNode;
  href?:    string;
  active?:  boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export interface HeaderAction {
  key?:       string;
  icon:       React.ReactNode;              // required
  ariaLabel?: string;
  onClick?:   (e: React.MouseEvent) => void;
  href?:      string;
  external?:  boolean;
}

export interface HeaderProps {
  brand?:           React.ReactNode;
  onBrandClick?:    (e: React.MouseEvent) => void;
  navItems?:        HeaderNavItem[];        // default: []
  actions?:         HeaderAction[];         // default: []
  linkComponent?:   React.ComponentType<{ href: string; className?: string; children: React.ReactNode }>;
  height?:          string;                 // default: "h-12" (Tailwind class)
  children?:        React.ReactNode;        // rendered between nav and actions
  mobileMenu?:      boolean;               // default: false
  navMenuIcon?:     React.ReactNode;       // custom hamburger icon
  actionsMenuIcon?: React.ReactNode;       // custom actions menu icon
  className?:       string;
}`;

const tokenCode = `/* Override Header mobile menu colors in your CSS */
:root {
  --header-mobile-bg:     white;                     /* mobile panel background  */
  --header-mobile-border: var(--color-primary-200);  /* mobile panel border      */
}

.dark {
  --header-mobile-bg:     var(--color-primary-900);
  --header-mobile-border: var(--color-primary-700);
}`;

export default function HeaderDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Header</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { Header, type HeaderProps, type HeaderNavItem, type HeaderAction } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="HeaderNavItem">
        <PropTable rows={headerNavItemProps} title="HeaderNavItem" />
      </Section>

      <Section title="HeaderAction">
        <PropTable rows={headerActionProps} title="HeaderAction" />
      </Section>

      <Section title="Header Props">
        <PropTable rows={headerProps} title="Header" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>

      <Section title="CSS Token Overrides">
        <p className="mb-3 text-sm text-secondary-600 dark:text-secondary-400">
          The mobile menu panel background and border color have automatic dark mode variants.
          Override both <code>:root</code> and <code>.dark</code> blocks to apply a custom mobile
          menu palette.
        </p>
        <CodeExample code={tokenCode} />
      </Section>
    </div>
  );
}
