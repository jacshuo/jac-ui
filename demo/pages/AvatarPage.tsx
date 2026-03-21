import { useState } from "react";
import { Avatar, AvatarGroup } from "../../src";
import { Section, PageTitle, CodeExample, PropTable, type PropRow } from "./helpers";

const basicCode = `<Avatar alt="Alice Johnson" />
<Avatar alt="Bob Smith" size="lg" />
<Avatar
  src="https://i.pravatar.cc/80?u=carol"
  alt="Carol"
  size="xl"
  shape="rounded"
/>`;

const statusCode = `<Avatar alt="Online User" status="online" />
<Avatar alt="Busy User" status="busy" />
<Avatar alt="Away User" status="away" />
<Avatar alt="Offline User" status="offline" />`;

const groupCode = `<AvatarGroup max={4}>
  <Avatar alt="Alice Johnson" />
  <Avatar alt="Bob Smith" />
  <Avatar alt="Carol White" />
  <Avatar alt="David Lee" />
  <Avatar alt="Eve Turner" />
  <Avatar alt="Frank Mills" />
</AvatarGroup>`;

const shapesCode = `<Avatar alt="Circular" shape="circular" size="lg" />
<Avatar alt="Rounded" shape="rounded" size="lg" />
<Avatar alt="Square"  shape="square"  size="lg" />`;

const avatarProps: PropRow[] = [
  {
    prop: "src",
    type: "string",
    description: "Image URL — shows initials fallback on error or absence.",
  },
  {
    prop: "alt",
    type: "string",
    description: "Accessible label; first letters used as initials fallback.",
  },
  {
    prop: "size",
    type: '"xs" | "sm" | "md" | "lg" | "xl"',
    default: '"md"',
    description: "Avatar dimension.",
  },
  {
    prop: "shape",
    type: '"circular" | "rounded" | "square"',
    default: '"circular"',
    description: "Border-radius style.",
  },
  {
    prop: "status",
    type: '"online" | "offline" | "busy" | "away"',
    description: "Colored presence indicator ring.",
  },
  { prop: "className", type: "string", description: "Extra class names." },
];

const groupProps: PropRow[] = [
  {
    prop: "max",
    type: "number",
    default: "4",
    description: "Maximum visible avatars before overflow count.",
  },
  {
    prop: "direction",
    type: '"left" | "right"',
    default: '"right"',
    description: "Stack overlap direction.",
  },
  {
    prop: "size",
    type: '"xs" | "sm" | "md" | "lg" | "xl"',
    default: '"md"',
    description: "Uniform size applied to all children.",
  },
  { prop: "children", type: "ReactNode", required: true, description: "Avatar elements." },
];

export default function AvatarPage() {
  const [src, setSrc] = useState(true);

  return (
    <div className="space-y-10 p-6">
      <PageTitle>Avatar</PageTitle>

      <Section title="Sizes &amp; initials fallback">
        <div className="flex flex-wrap items-center gap-4">
          {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <Avatar alt="James Kirk" size={s} />
              <span className="text-xs text-primary-500">{s}</span>
            </div>
          ))}
        </div>
        <CodeExample code={basicCode} />
      </Section>

      <Section title="Shapes">
        <div className="flex flex-wrap items-center gap-4">
          {(["circular", "rounded", "square"] as const).map((sh) => (
            <div key={sh} className="flex flex-col items-center gap-1">
              <Avatar alt="James Kirk" size="lg" shape={sh} />
              <span className="text-xs text-primary-500">{sh}</span>
            </div>
          ))}
        </div>
        <CodeExample code={shapesCode} />
      </Section>

      <Section title="Status indicators">
        <div className="flex flex-wrap items-center gap-4">
          {(["online", "busy", "away", "offline"] as const).map((st) => (
            <div key={st} className="flex flex-col items-center gap-1">
              <Avatar alt="James Kirk" status={st} />
              <span className="text-xs text-primary-500">{st}</span>
            </div>
          ))}
        </div>
        <CodeExample code={statusCode} />
      </Section>

      <Section title="Image with fallback">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <Avatar src={src ? "https://i.pravatar.cc/80?u=demo" : ""} alt="Image User" size="lg" />
            <span className="text-xs text-primary-500">{src ? "image" : "initials"}</span>
          </div>
          <button className="rounded border px-3 py-1 text-sm" onClick={() => setSrc((v) => !v)}>
            Toggle src
          </button>
        </div>
      </Section>

      <Section title="AvatarGroup">
        <AvatarGroup max={4}>
          {[
            "Alice Johnson",
            "Bob Smith",
            "Carol White",
            "David Lee",
            "Eve Turner",
            "Frank Mills",
          ].map((name) => (
            <Avatar key={name} alt={name} />
          ))}
        </AvatarGroup>
        <CodeExample code={groupCode} />
      </Section>

      <Section title="Props — Avatar">
        <PropTable rows={avatarProps} />
      </Section>
      <Section title="Props — AvatarGroup">
        <PropTable rows={groupProps} />
      </Section>
    </div>
  );
}
