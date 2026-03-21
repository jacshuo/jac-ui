import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const timelineProps: PropRow[] = [
  {
    prop: "items",
    type: "TimelineItem[]",
    required: true,
    description: "Ordered list of timeline events",
  },
  {
    prop: "orientation",
    type: `"vertical" | "horizontal"`,
    default: `"vertical"`,
    description: "Layout direction",
  },
  {
    prop: "activeIndex",
    type: "number",
    description: "Index of the active item — triggers holo animation and scroll-to-center",
  },
  {
    prop: "animated",
    type: "boolean",
    default: "true",
    description: "Enable IntersectionObserver entrance animations (slide + fade)",
  },
  {
    prop: "lineStyle",
    type: `"solid" | "dashed"`,
    default: `"solid"`,
    description: "Connector line style",
  },
  { prop: "className", type: "string", description: "Extra class names on the root element" },
];

const timelineItemProps: PropRow[] = [
  {
    prop: "id",
    type: "string | number",
    description: "Optional stable key; falls back to array index",
  },
  { prop: "title", type: "string", required: true, description: "Card heading" },
  { prop: "description", type: "ReactNode", description: "Card body text or JSX" },
  { prop: "date", type: "string", description: "Date/time label shown as a status-coloured chip" },
  {
    prop: "status",
    type: `"complete" | "active" | "pending" | "error"`,
    default: `"pending"`,
    description: "Controls dot colour, background tint, and glow",
  },
  { prop: "icon", type: "ReactNode", description: "Custom icon inside the status dot" },
  {
    prop: "image",
    type: "string",
    description:
      'Single image URL — displayed as full-width banner (imagePosition="top") or fixed sidebar (imagePosition="left")',
  },
  {
    prop: "imagePosition",
    type: `"top" | "left"`,
    default: `"top"`,
    description: "Where the single image is placed within the card",
  },
  {
    prop: "images",
    type: "string[]",
    description:
      "Array of image URLs rendered as a mosaic gallery below the description (max 4 visible + overflow count)",
  },
  {
    prop: "svg",
    type: "ReactNode",
    description: "SVG element rendered as a centred visual block (only when image is absent)",
  },
  {
    prop: "actions",
    type: "TimelineAction[]",
    description: "Action buttons in the card footer (see TimelineAction below)",
  },
  {
    prop: "className",
    type: "string",
    description: "Extra class names on this card's outer wrapper",
  },
];

const timelineActionProps: PropRow[] = [
  { prop: "label", type: "string", required: true, description: "Button or link text" },
  { prop: "icon", type: "ReactNode", description: "Leading icon for the action" },
  { prop: "onClick", type: "() => void", description: "Click handler — renders a <button>" },
  {
    prop: "href",
    type: "string",
    description: "Destination URL — renders an <a> opening in a new tab",
  },
  {
    prop: "variant",
    type: `"default" | "primary"`,
    default: `"default"`,
    description: '"default" = ghost, left-aligned; "primary" = solid CTA, right-aligned',
  },
];

const importCode = `import { Timeline } from "@jacshuo/onyx";
import type { TimelineProps, TimelineItem, TimelineAction } from "@jacshuo/onyx";`;

const usageCode = `import { Timeline } from "@jacshuo/onyx";
import type { TimelineItem } from "@jacshuo/onyx";
import { Rocket, Heart, ExternalLink } from "lucide-react";

const items: TimelineItem[] = [
  {
    title: "Project Kickoff",
    date: "Jan 14, 2026",
    status: "complete",
    description: "Initial planning, stakeholder alignment, roadmap definition.",
    icon: <Rocket className="h-4 w-4" />,
  },
  {
    title: "Mountain Trail",
    date: "Mar 10, 2026",
    status: "complete",
    image: "https://example.com/trail.jpg",
    imagePosition: "left",          // image sidebar layout
    description: "Difficulty: Moderate · 12 km",
    actions: [
      { label: "Like",  icon: <Heart />, onClick: handleLike },
      { label: "Read",  icon: <ExternalLink />, variant: "primary", href: "/article" },
    ],
  },
  {
    title: "Photography Session",
    date: "Mar 15, 2026",
    status: "active",
    description: "Urban architecture shoot — golden hour.",
    images: [                       // mosaic gallery
      "https://example.com/1.jpg",
      "https://example.com/2.jpg",
      "https://example.com/3.jpg",
      "https://example.com/4.jpg",
      "https://example.com/5.jpg", // shows as +1 overflow
    ],
  },
  {
    title: "v1.0 Launch",
    date: "Apr 1, 2026",
    status: "pending",
    actions: [{ label: "Approve", variant: "primary", onClick: handleApprove }],
  },
];

// Vertical (default)
<Timeline items={items} activeIndex={2} />

// Horizontal with dashed connector
<Timeline items={items} orientation="horizontal" lineStyle="dashed" activeIndex={2} />`;

const typeCode = `import type {
  TimelineItem,
  TimelineAction,
  TimelineOrientation,
  TimelineStatus,
} from "@jacshuo/onyx";

type TimelineStatus      = "complete" | "active" | "pending" | "error";
type TimelineOrientation = "vertical" | "horizontal";

interface TimelineAction {
  label:    string;
  icon?:    React.ReactNode;
  onClick?: () => void;
  href?:    string;
  variant?: "default" | "primary";
}

interface TimelineItem {
  id?:            string | number;
  title:          string;
  description?:   React.ReactNode;
  date?:          string;
  icon?:          React.ReactNode;
  image?:         string;
  imagePosition?: "top" | "left";
  images?:        string[];
  svg?:           React.ReactNode;
  status?:        TimelineStatus;
  actions?:       TimelineAction[];
  className?:     string;
}

interface TimelineProps {
  items:        TimelineItem[];
  orientation?: TimelineOrientation;
  activeIndex?: number;
  animated?:    boolean;
  lineStyle?:   "solid" | "dashed";
  className?:   string;
}`;

const tokenCode = `/* Override Timeline holo colours in your global CSS */
:root {
  /* Active card aurora + spinning border */
  --tl-holo-base:   var(--color-primary-600);
  --tl-holo-mid:    var(--color-primary-400);
  --tl-holo-indigo: var(--color-indigo-400);
  --tl-holo-violet: var(--color-violet-300);
  --tl-holo-cyan:   var(--color-cyan-400);

  /* Ambient glow — complete status */
  --tl-glow-complete-1: var(--color-success-600);
  --tl-glow-complete-2: var(--color-success-400);

  /* Ambient glow — error status */
  --tl-glow-error-1: var(--color-danger-600);
  --tl-glow-error-2: var(--color-danger-400);
  --tl-glow-error-3: var(--color-danger-300);
}

/* Example: change holo to a purple/pink theme */
:root {
  --tl-holo-indigo: #a855f7;
  --tl-holo-violet: #ec4899;
  --tl-holo-cyan:   #f43f5e;
}`;

export default function TimelineDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Timeline</PageTitle>

      <Section title="Import">
        <CodeExample code={importCode} />
      </Section>

      <Section title="Description">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Data-driven timeline supporting vertical and horizontal layouts. The active item receives
          a animated holo spinning border with breathing aurora glow. Non-active items echo the
          effect with a dim status-coloured ambient pulse. Items animate in via{" "}
          <strong>IntersectionObserver</strong> (slide + fade). Setting <code>activeIndex</code>{" "}
          scrolls the item into center view. Cards support a single banner/sidebar image, a mosaic
          photo gallery, action buttons, SVG visuals, and status-matched date chips.
        </p>
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Types">
        <CodeExample code={typeCode} />
      </Section>

      <Section title="CSS Token Overrides">
        <p className="mb-3 text-sm text-secondary-600 dark:text-secondary-400">
          All holo and ambient glow colours are exposed as CSS custom properties. Override them
          anywhere in your CSS to retheme the component without touching source code.
        </p>
        <CodeExample code={tokenCode} />
      </Section>

      <Section title="Timeline Props">
        <PropTable rows={timelineProps} />
      </Section>

      <Section title="TimelineItem Props">
        <PropTable rows={timelineItemProps} />
      </Section>

      <Section title="TimelineAction Props">
        <PropTable rows={timelineActionProps} />
      </Section>
    </div>
  );
}
