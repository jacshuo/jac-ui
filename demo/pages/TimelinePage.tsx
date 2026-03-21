import React, { useState } from "react";
import { Timeline } from "../../src";
import type { TimelineItem } from "../../src";
import { Section, PageTitle, CodeExample, PropTable } from "./helpers";
import {
  Rocket,
  Code2,
  TestTube,
  Package,
  CheckCircle2,
  Sparkles,
  Heart,
  Share2,
  ExternalLink,
  Camera,
} from "lucide-react";

const vItems: TimelineItem[] = [
  {
    id: 1,
    title: "Project Kickoff",
    description:
      "Initial planning session, stakeholder alignment, and roadmap definition completed.",
    date: "Jan 14, 2026",
    icon: <Rocket className="h-4 w-4" />,
    status: "complete",
  },
  {
    id: 2,
    title: "Design System Setup",
    description: "Chose Tailwind CSS v4, CVA, and defined the semantic color token palette.",
    date: "Jan 21, 2026",
    icon: <Sparkles className="h-4 w-4" />,
    status: "complete",
  },
  {
    id: 3,
    title: "Core Components",
    description:
      "Implemented Button, Badge, Input, Dropdown, Card, Table, and 20+ base primitives.",
    date: "Feb 10, 2026",
    icon: <Code2 className="h-4 w-4" />,
    status: "complete",
    images: [
      "https://picsum.photos/seed/comp1/300/200",
      "https://picsum.photos/seed/comp2/300/200",
      "https://picsum.photos/seed/comp3/300/200",
    ],
  },
  {
    id: 4,
    title: "Testing Suite",
    description: "Added Vitest + @testing-library/react. 27+ test files covering all public APIs.",
    date: "Feb 28, 2026",
    icon: <TestTube className="h-4 w-4" />,
    status: "active",
  },
  {
    id: 5,
    title: "npm Publish",
    description: "Build library with tsup, run full CI, and publish @jacshuo/onyx to npm registry.",
    date: "Mar 15, 2026",
    icon: <Package className="h-4 w-4" />,
    status: "pending",
  },
  {
    id: 6,
    title: "Production Release",
    description: "Announce v1.0.0 stable release with docs, changelog, and demo site live.",
    date: "Apr 1, 2026",
    icon: <CheckCircle2 className="h-4 w-4" />,
    status: "pending",
  },
];

const hItems: TimelineItem[] = [
  {
    id: "h1",
    title: "Concept",
    description: "Idea born",
    date: "Q1 2025",
    status: "complete",
    svg: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke="currentColor"
          strokeWidth="2"
          className="text-success-400"
        />
        <path
          d="M16 24l6 6 10-12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-success-500"
        />
      </svg>
    ),
  },
  {
    id: "h2",
    title: "Alpha",
    description: "Early components",
    date: "Q3 2025",
    status: "complete",
  },
  {
    id: "h3",
    title: "Beta",
    description: "Public testing",
    date: "Q1 2026",
    status: "active",
  },
  {
    id: "h4",
    title: "v1.0",
    description: "Stable release",
    date: "Q2 2026",
    status: "pending",
  },
];

const richItems: TimelineItem[] = [
  {
    id: "rich1",
    title: "Mountain Trail",
    description: "A scenic hike through alpine meadows. Difficulty: Moderate · 12 km",
    date: "Mar 10, 2026",
    status: "complete",
    image: "https://picsum.photos/seed/mountain/400/300",
    imagePosition: "left",
    actions: [
      { label: "Like", icon: <Heart className="h-3.5 w-3.5" />, onClick: () => {} },
      { label: "Share", icon: <Share2 className="h-3.5 w-3.5" />, onClick: () => {} },
      {
        label: "Read",
        icon: <ExternalLink className="h-3.5 w-3.5" />,
        variant: "primary",
        href: "#",
      },
    ],
  },
  {
    id: "rich2",
    title: "Photography Session",
    description: "Urban architecture shoot — downtown core golden hour.",
    date: "Mar 15, 2026",
    status: "active",
    images: [
      "https://picsum.photos/seed/arch1/400/300",
      "https://picsum.photos/seed/arch2/400/300",
      "https://picsum.photos/seed/arch3/400/300",
      "https://picsum.photos/seed/arch4/400/300",
      "https://picsum.photos/seed/arch5/400/300",
    ],
    actions: [
      { label: "Like", icon: <Heart className="h-3.5 w-3.5" />, onClick: () => {} },
      { label: "Share", icon: <Share2 className="h-3.5 w-3.5" />, onClick: () => {} },
      { label: "Gallery", icon: <Camera className="h-3.5 w-3.5" />, variant: "primary", href: "#" },
    ],
  },
  {
    id: "rich3",
    title: "Draft — Pending Review",
    description: "Content scheduled for publication after manager sign-off.",
    date: "Mar 20, 2026",
    status: "pending",
    actions: [
      {
        label: "Approve",
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        variant: "primary",
        onClick: () => {},
      },
    ],
  },
];

const richCode = `<Timeline
  items={[
    {
      title: "Mountain Trail",
      image: "https://example.com/photo.jpg",
      imagePosition: "left",
      actions: [
        { label: "Like", icon: <Heart />, onClick: handleLike },
        { label: "Read", icon: <ExternalLink />, variant: "primary", href: "/article" },
      ],
    },
    {
      title: "Photo Session",
      images: ["url1", "url2", "url3", "url4", "url5"],
      actions: [{ label: "Gallery", variant: "primary", href: "/gallery" }],
    },
  ]}
  activeIndex={1}
/>`;

const basicCode = `import { Timeline } from "@jacshuo/onyx";

const items = [
  { id: 1, title: "Kickoff", date: "Jan 14", status: "complete", icon: <Rocket /> },
  { id: 2, title: "Design", date: "Jan 21", status: "active", icon: <Sparkles /> },
  { id: 3, title: "Release", date: "Apr 1", status: "pending", icon: <Package /> },
];

<Timeline items={items} activeIndex={1} />`;

const horizontalCode = `<Timeline
  items={items}
  orientation="horizontal"
  activeIndex={2}
  lineStyle="dashed"
/>`;

const propRows = [
  {
    prop: "items",
    type: "TimelineItem[]",
    required: true,
    description: "Ordered list of timeline entries",
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
    description: "Index of the active item — scrolled into center view on change",
  },
  {
    prop: "animated",
    type: "boolean",
    default: "true",
    description: "Entrance animation as items enter the viewport",
  },
  {
    prop: "lineStyle",
    type: `"solid" | "dashed"`,
    default: `"solid"`,
    description: "Visual style of the connector line",
  },
];

const itemPropRows = [
  { prop: "id", type: "string | number", description: "Unique identifier (uses index if omitted)" },
  { prop: "title", type: "string", required: true, description: "Card heading" },
  { prop: "description", type: "ReactNode", description: "Body text or JSX content" },
  { prop: "date", type: "string", description: "Date/time label shown as a chip" },
  { prop: "icon", type: "ReactNode", description: "Icon inside the timeline dot" },
  {
    prop: "image",
    type: "string",
    description:
      'Single image URL — "top" = full-width banner header | "left" = sidebar column (see imagePosition)',
  },
  {
    prop: "imagePosition",
    type: `"top" | "left"`,
    default: `"top"`,
    description: "Controls where the single image is displayed",
  },
  {
    prop: "images",
    type: "string[]",
    description:
      "Array of image URLs — mosaic gallery rendered below the description (max 4 visible + overflow count)",
  },
  {
    prop: "actions",
    type: "TimelineAction[]",
    description:
      'Action buttons in the card footer; variant="primary" renders right-aligned solid CTA',
  },
  { prop: "svg", type: "ReactNode", description: "SVG element shown as a card visual" },
  {
    prop: "status",
    type: `"pending" | "active" | "complete" | "error"`,
    default: `"pending"`,
    description: "Controls dot color and glow",
  },
];

export default function TimelinePage() {
  const [activeIdx, setActiveIdx] = useState(3);

  return (
    <div className="space-y-8">
      <PageTitle>Timeline</PageTitle>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">
        Animated vertical or horizontal timeline. Supports SVG visuals, images, custom icons, status
        dots, and auto-scroll of the active item into center view.
      </p>

      <Section title="Rich cards — image left, gallery mosaic, actions">
        <Timeline items={richItems} activeIndex={1} animated />
        <CodeExample code={richCode} />
      </Section>

      <Section title="Vertical (default)">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {vItems.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeIdx === i
                    ? "bg-primary-500 text-white"
                    : "bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-800 dark:text-primary-300"
                }`}
              >
                Step {i + 1}
              </button>
            ))}
          </div>
          <Timeline items={vItems} activeIndex={activeIdx} animated />
        </div>
        <CodeExample code={basicCode} />
      </Section>

      <Section title="Horizontal — with SVG visual">
        <Timeline
          items={hItems}
          orientation="horizontal"
          activeIndex={2}
          lineStyle="dashed"
          animated
        />
        <CodeExample code={horizontalCode} />
      </Section>

      <Section title="No animation, dashed line">
        <Timeline items={vItems.slice(0, 3)} animated={false} lineStyle="dashed" />
      </Section>

      <Section title="Timeline Props">
        <PropTable rows={propRows} />
      </Section>

      <Section title="TimelineItem Shape">
        <PropTable rows={itemPropRows} />
      </Section>
    </div>
  );
}
