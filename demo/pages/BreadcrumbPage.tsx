import { Breadcrumb } from "../../src";
import { Section, PageTitle, CodeExample, PropTable, type PropRow } from "./helpers";
import { Home } from "lucide-react";

const basicCode = `<Breadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Laptops", href: "/products/laptops" },
    { label: "MacBook Pro 16'" },
  ]}
/>`;

const customSeparatorCode = `<Breadcrumb
  separator={<span className="text-primary-400">/</span>}
  items={[
    { label: "Docs", href: "/docs" },
    { label: "Components", href: "/docs/components" },
    { label: "Breadcrumb" },
  ]}
/>`;

const homeIconCode = `<Breadcrumb
  homeIcon={<Home className="h-4 w-4" />}
  items={[
    { label: "Home", href: "/" },
    { label: "Settings", href: "/settings" },
    { label: "Account" },
  ]}
/>`;

const propRows: PropRow[] = [
  {
    prop: "items",
    type: "BreadcrumbItem[]",
    required: true,
    description: "Array of breadcrumb items.",
  },
  {
    prop: "separator",
    type: "ReactNode",
    default: "<ChevronRight />",
    description: "Custom separator between items.",
  },
  {
    prop: "homeIcon",
    type: "ReactNode",
    description: "Icon replacing the label of the first breadcrumb item.",
  },
  {
    prop: "LinkComponent",
    type: "ElementType",
    default: '"a"',
    description: "Custom link component (e.g. React Router Link).",
  },
  { prop: "className", type: "string", description: "Extra classes on the <nav> wrapper." },
];

const itemRows: PropRow[] = [
  { prop: "label", type: "string", required: true, description: "Display text." },
  { prop: "href", type: "string", description: "Link target. Omit for the current/active item." },
  { prop: "icon", type: "ReactNode", description: "Optional icon before the label." },
];

export default function BreadcrumbPage() {
  return (
    <div className="space-y-10 p-6">
      <PageTitle>Breadcrumb</PageTitle>

      <Section title="Basic">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: "Laptops", href: "/products/laptops" },
            { label: 'MacBook Pro 16"' },
          ]}
        />
        <CodeExample code={basicCode} />
      </Section>

      <Section title="Custom separator">
        <Breadcrumb
          separator={<span className="text-primary-400">/</span>}
          items={[
            { label: "Docs", href: "/docs" },
            { label: "Components", href: "/docs/components" },
            { label: "Breadcrumb" },
          ]}
        />
        <CodeExample code={customSeparatorCode} />
      </Section>

      <Section title="Home icon">
        <Breadcrumb
          homeIcon={<Home className="h-4 w-4" />}
          items={[
            { label: "Home", href: "/" },
            { label: "Settings", href: "/settings" },
            { label: "Account" },
          ]}
        />
        <CodeExample code={homeIconCode} />
      </Section>

      <Section title="Props — Breadcrumb">
        <PropTable rows={propRows} />
      </Section>
      <Section title="Props — BreadcrumbItem">
        <PropTable rows={itemRows} />
      </Section>
    </div>
  );
}
