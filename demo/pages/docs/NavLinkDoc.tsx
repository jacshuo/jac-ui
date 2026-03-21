import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const navLinkProps: PropRow[] = [
  {
    prop: "intent",
    type: `"default" | "secondary" | "muted"`,
    default: `"default"`,
    description: "Color style. default=primary color, secondary=gray, muted=dimmed",
  },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Text and icon size" },
  {
    prop: "underline",
    type: `"always" | "hover" | "none"`,
    default: `"none"`,
    description: "Underline decoration behavior",
  },
  {
    prop: "external",
    type: "boolean",
    default: "false",
    description:
      'Show external-link icon. Auto-detected when target="_blank" or href starts with http',
  },
  {
    prop: "...rest",
    type: "AnchorHTMLAttributes<HTMLAnchorElement>",
    description: "All native anchor attributes: href, target, rel, onClick, children, etc.",
  },
];

const typesCode = `import type { AnchorHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

type NavLinkProps =
  React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof navLinkVariants> & {
    /** Show external-link icon.
     *  Auto-detected from target="_blank" or http(s):// href. */
    external?: boolean;
  };

// Resolved variant shape:
interface NavLinkVariants {
  intent?:    "default" | "secondary" | "muted";
  size?:      "sm" | "md" | "lg";
  underline?: "always" | "hover" | "none";
}`;

const usageCode = `import { NavLink } from "@jacshuo/onyx";

export function Example() {
  return (
    <nav className="flex gap-4 flex-wrap items-center">
      <NavLink href="/">Default</NavLink>
      <NavLink href="/docs" intent="secondary">Secondary</NavLink>
      <NavLink href="/help" intent="muted">Muted</NavLink>
      <NavLink href="/docs" underline="always">Always underlined</NavLink>
      <NavLink href="/docs" underline="hover">Hover underline</NavLink>
      <NavLink href="https://github.com" external>GitHub (external)</NavLink>
    </nav>
  );
}`;

export default function NavLinkDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>NavLink</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { NavLink } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={navLinkProps} />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>
    </div>
  );
}
