import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const breadcrumbItemProps: PropRow[] = [
  { prop: "label", type: "string", required: true, description: "Display text" },
  { prop: "href", type: "string", description: "Navigation URL. Omit for non-link items" },
  { prop: "icon", type: "React.ReactNode", description: "Icon rendered before the label" },
];

const breadcrumbProps: PropRow[] = [
  {
    prop: "items",
    type: "BreadcrumbItem[]",
    required: true,
    description: "Ordered list of breadcrumb items",
  },
  {
    prop: "separator",
    type: "React.ReactNode",
    default: "<ChevronRight />",
    description: "Custom separator element between items",
  },
  {
    prop: "homeIcon",
    type: "React.ReactNode | boolean",
    default: "false",
    description: "Icon for the first item. Pass true for the default Home icon",
  },
  {
    prop: "LinkComponent",
    type: "React.ComponentType<AnchorHTMLAttributes>",
    default: "<a>",
    description: "Custom link renderer (e.g. React Router's Link)",
  },
  { prop: "className", type: "string", description: "Extra CSS classes on the nav element" },
];

const usageCode = `import { Breadcrumb } from "@jacshuo/onyx";

export function Example() {
  return (
    <Breadcrumb
      homeIcon
      items={[
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
        { label: "Widgets", href: "/products/widgets" },
        { label: "Super Widget" },
      ]}
    />
  );
}`;

const customSepCode = `import { Breadcrumb } from "@jacshuo/onyx";

export function SlashBreadcrumb() {
  return (
    <Breadcrumb
      separator={<span className="text-secondary-400">/</span>}
      items={[
        { label: "Dashboard", href: "/" },
        { label: "Settings", href: "/settings" },
        { label: "Security" },
      ]}
    />
  );
}`;

const typesCode = `export type BreadcrumbItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  homeIcon?: React.ReactNode | boolean;
  LinkComponent?: React.ComponentType<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
  className?: string;
};`;

export default function BreadcrumbDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Breadcrumb</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { Breadcrumb, type BreadcrumbProps, type BreadcrumbItem } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="BreadcrumbItem">
        <PropTable rows={breadcrumbItemProps} title="BreadcrumbItem" />
      </Section>

      <Section title="Breadcrumb Props">
        <PropTable rows={breadcrumbProps} title="Breadcrumb" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Custom Separator">
        <CodeExample code={customSepCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>
    </div>
  );
}
