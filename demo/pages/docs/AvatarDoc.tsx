import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const avatarProps: PropRow[] = [
  {
    prop: "src",
    type: "string",
    description: "Image URL. Falls back to initials if omitted or fails to load",
  },
  { prop: "alt", type: "string", description: "Alt text; also used to auto-derive initials" },
  { prop: "initials", type: "string", description: "Override auto-derived initials (max 2 chars)" },
  {
    prop: "size",
    type: `"xs" | "sm" | "md" | "lg" | "xl"`,
    default: `"md"`,
    description: "Avatar dimensions",
  },
  {
    prop: "shape",
    type: `"circular" | "rounded" | "square"`,
    default: `"circular"`,
    description: "Border-radius style",
  },
  {
    prop: "status",
    type: `"online" | "offline" | "busy" | "away"`,
    description: "Coloured status ring around the avatar",
  },
];

const avatarGroupProps: PropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    required: true,
    description: "Avatar elements to group",
  },
  {
    prop: "max",
    type: "number",
    default: "4",
    description: "Max avatars shown before collapsing to +N",
  },
  {
    prop: "overlap",
    type: `"left" | "right"`,
    default: `"left"`,
    description: "Direction avatars overlap each other",
  },
  { prop: "className", type: "string", description: "Extra CSS classes" },
];

const usageCode = `import { Avatar, AvatarGroup } from "@jacshuo/onyx";

export function Example() {
  return (
    <div className="flex flex-col gap-6">
      {/* Sizes */}
      <div className="flex items-end gap-3">
        <Avatar size="xs" alt="Alice" />
        <Avatar size="sm" alt="Bob" />
        <Avatar size="md" alt="Carol" src="https://i.pravatar.cc/150?u=carol" />
        <Avatar size="lg" alt="Dan" />
        <Avatar size="xl" alt="Eve" />
      </div>

      {/* Shapes */}
      <div className="flex items-center gap-3">
        <Avatar shape="circular" alt="Ciara" />
        <Avatar shape="rounded" alt="Rory" />
        <Avatar shape="square" alt="Sam" />
      </div>

      {/* Status rings */}
      <div className="flex items-center gap-3">
        <Avatar alt="Online" status="online" />
        <Avatar alt="Busy" status="busy" />
        <Avatar alt="Away" status="away" />
        <Avatar alt="Offline" status="offline" />
      </div>

      {/* Group */}
      <AvatarGroup max={3}>
        <Avatar alt="Alice" />
        <Avatar alt="Bob" />
        <Avatar alt="Carol" />
        <Avatar alt="Dan" />
        <Avatar alt="Eve" />
      </AvatarGroup>
    </div>
  );
}`;

const typesCode = `export type AvatarProps = React.HTMLAttributes<HTMLSpanElement> & {
  src?: string;
  alt?: string;
  initials?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "circular" | "rounded" | "square";
  status?: "online" | "offline" | "busy" | "away";
};

export type AvatarGroupProps = {
  children: React.ReactNode;
  max?: number;
  overlap?: "left" | "right";
  className?: string;
};`;

export default function AvatarDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Avatar &amp; AvatarGroup</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { Avatar, AvatarGroup, type AvatarProps, type AvatarGroupProps } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="Avatar Props">
        <PropTable rows={avatarProps} title="Avatar" />
      </Section>

      <Section title="AvatarGroup Props">
        <PropTable rows={avatarGroupProps} title="AvatarGroup" />
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
