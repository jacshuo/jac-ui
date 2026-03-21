import React, { useState } from "react";
import { Tag } from "../../src";
import { Section, PageTitle, CodeExample, PropTable } from "./helpers";
import { Star, Zap, Shield, Globe, Coffee, Flame } from "lucide-react";

const intentCode = `<Tag intent="primary">Primary</Tag>
<Tag intent="secondary">Secondary</Tag>
<Tag intent="success">Success</Tag>
<Tag intent="danger">Danger</Tag>
<Tag intent="warning">Warning</Tag>
<Tag intent="info">Info</Tag>`;

const variantCode = `<Tag intent="success" variant="solid">Solid</Tag>
<Tag intent="success" variant="soft">Soft</Tag>
<Tag intent="success" variant="outline">Outline</Tag>`;

const sizeCode = `<Tag size="sm">Small</Tag>
<Tag size="md">Medium</Tag>
<Tag size="lg">Large</Tag>`;

const iconCode = `<Tag intent="warning" icon={<Zap />}>Powered</Tag>
<Tag intent="success" icon={<Shield />}>Verified</Tag>`;

const dotCode = `<Tag intent="success" dot>Active</Tag>
<Tag intent="danger" dot>Offline</Tag>
<Tag intent="warning" dot>Pending</Tag>`;

const removableCode = `function TagList() {
  const [tags, setTags] = useState(["React", "TypeScript", "Tailwind"]);
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Tag
          key={tag}
          intent="primary"
          removable
          onRemove={() => setTags((t) => t.filter((x) => x !== tag))}
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
}`;

const propRows = [
  {
    prop: "intent",
    type: `"primary" | "secondary" | "success" | "danger" | "warning" | "info"`,
    default: `"primary"`,
    description: "Color theme of the tag",
  },
  {
    prop: "size",
    type: `"sm" | "md" | "lg"`,
    default: `"md"`,
    description: "Height and font size",
  },
  {
    prop: "variant",
    type: `"solid" | "outline" | "soft"`,
    default: `"solid"`,
    description: "Visual style — filled, outlined, or soft tint",
  },
  { prop: "icon", type: "ReactNode", description: "Icon element displayed before the label" },
  { prop: "dot", type: "boolean", description: "Shows a small colored dot indicator to the left" },
  { prop: "removable", type: "boolean", description: "Shows an × button to remove the tag" },
  { prop: "onRemove", type: "() => void", description: "Called when the remove button is clicked" },
  { prop: "disabled", type: "boolean", description: "Disables interaction and dims the tag" },
];

export default function TagPage() {
  const [chips, setChips] = useState(["React", "TypeScript", "Tailwind CSS", "CVA", "Vitest"]);

  return (
    <div className="space-y-8">
      <PageTitle>Tag / Chip</PageTitle>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">
        Compact label element for category, status, or filtering. Distinct from{" "}
        <code className="rounded bg-primary-100 px-1 py-0.5 text-xs dark:bg-primary-800">
          Badge
        </code>{" "}
        — Tags have softer, pill shapes, support icons and dot indicators, and can be removable.
      </p>

      <Section title="Intents">
        <div className="flex flex-wrap gap-2">
          <Tag intent="primary">Primary</Tag>
          <Tag intent="secondary">Secondary</Tag>
          <Tag intent="success">Success</Tag>
          <Tag intent="danger">Danger</Tag>
          <Tag intent="warning">Warning</Tag>
          <Tag intent="info">Info</Tag>
        </div>
        <CodeExample code={intentCode} />
      </Section>

      <Section title="Variants">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-secondary-500">Solid</span>
            <div className="flex flex-wrap gap-2">
              {(["primary", "success", "danger", "warning"] as const).map((i) => (
                <Tag key={i} intent={i} variant="solid">
                  {i}
                </Tag>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-secondary-500">Outline</span>
            <div className="flex flex-wrap gap-2">
              {(["primary", "success", "danger", "warning"] as const).map((i) => (
                <Tag key={i} intent={i} variant="outline">
                  {i}
                </Tag>
              ))}
            </div>
          </div>
        </div>
        <CodeExample code={variantCode} />
      </Section>

      <Section title="Sizes">
        <div className="flex flex-wrap items-center gap-3">
          <Tag size="sm">Small</Tag>
          <Tag size="md">Medium</Tag>
          <Tag size="lg">Large</Tag>
        </div>
        <CodeExample code={sizeCode} />
      </Section>

      <Section title="With Icons">
        <div className="flex flex-wrap gap-2">
          <Tag intent="warning" icon={<Zap />}>
            Powered
          </Tag>
          <Tag intent="success" icon={<Shield />}>
            Verified
          </Tag>
          <Tag intent="info" icon={<Globe />}>
            Global
          </Tag>
          <Tag intent="primary" icon={<Star />}>
            Featured
          </Tag>
          <Tag intent="secondary" icon={<Coffee />}>
            Casual
          </Tag>
          <Tag intent="danger" icon={<Flame />}>
            Hot
          </Tag>
        </div>
        <CodeExample code={iconCode} />
      </Section>

      <Section title="Dot Indicator">
        <div className="flex flex-wrap gap-2">
          <Tag intent="success" dot>
            Active
          </Tag>
          <Tag intent="danger" dot>
            Offline
          </Tag>
          <Tag intent="warning" dot>
            Pending
          </Tag>
          <Tag intent="secondary" dot>
            Unknown
          </Tag>
        </div>
        <CodeExample code={dotCode} />
      </Section>

      <Section title="Removable Tags (interactive)">
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Tag
              key={chip}
              intent="primary"
              removable
              onRemove={() => setChips((c) => c.filter((x) => x !== chip))}
            >
              {chip}
            </Tag>
          ))}
          {chips.length === 0 && (
            <button
              type="button"
              className="rounded-full border border-dashed border-primary-300 px-3 py-1 text-xs text-secondary-400 hover:border-primary-500 dark:border-primary-600"
              onClick={() => setChips(["React", "TypeScript", "Tailwind CSS", "CVA", "Vitest"])}
            >
              + Restore tags
            </button>
          )}
        </div>
        <CodeExample code={removableCode} />
      </Section>

      <Section title="Disabled">
        <div className="flex flex-wrap gap-2">
          <Tag intent="success" disabled icon={<Shield />}>
            Verified
          </Tag>
          <Tag intent="primary" disabled removable>
            Cannot remove
          </Tag>
        </div>
      </Section>

      <Section title="Props">
        <PropTable rows={propRows} />
      </Section>
    </div>
  );
}
