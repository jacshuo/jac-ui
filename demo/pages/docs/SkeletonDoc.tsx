import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const skeletonProps: PropRow[] = [
  {
    prop: "variant",
    type: '"text" | "circular" | "rectangular" | "rounded"',
    default: '"text"',
    description: "Shape of the skeleton placeholder",
  },
  {
    prop: "animation",
    type: '"pulse" | "wave" | "none"',
    default: '"pulse"',
    description: "Loading animation style",
  },
  { prop: "width", type: "string | number", description: "CSS width value or pixel number" },
  { prop: "height", type: "string | number", description: "CSS height value or pixel number" },
  {
    prop: "lines",
    type: "number",
    description: "Render multiple text lines; the last line is rendered at 60% width",
  },
  { prop: "className", type: "string", description: "Extra CSS classes" },
];

const usageCode = `import { Skeleton } from "@jacshuo/onyx";

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      {/* Multi-line text placeholder */}
      <Skeleton variant="text" lines={3} />

      {/* Avatar placeholder */}
      <Skeleton variant="circular" width={48} height={48} />

      {/* Card image placeholder */}
      <Skeleton variant="rectangular" width="100%" height={180} />

      {/* Rounded card */}
      <Skeleton variant="rounded" width="100%" height={80} />
    </div>
  );
}`;

const animationCode = `import { Skeleton } from "@jacshuo/onyx";

// Pulse (default)
<Skeleton variant="text" animation="pulse" lines={2} />

// Wave
<Skeleton variant="text" animation="wave" lines={2} />

// Static (no animation)
<Skeleton variant="text" animation="none" lines={2} />`;

const typesCode = `export type SkeletonProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  variant?: "text" | "circular" | "rectangular" | "rounded";
  animation?: "pulse" | "wave" | "none";
  width?: string | number;
  height?: string | number;
  lines?: number;
};`;

export default function SkeletonDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Skeleton</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Skeleton, type SkeletonProps } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={skeletonProps} title="Skeleton" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Animations">
        <CodeExample code={animationCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>
    </div>
  );
}
