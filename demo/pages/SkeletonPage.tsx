import { Skeleton } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";

const shapeCode = `{/* text */}
<Skeleton variant="text" width="80%" />

{/* circular */}
<Skeleton variant="circular" width={48} height={48} />

{/* rectangular */}
<Skeleton variant="rectangular" width="100%" height={80} />

{/* rounded */}
<Skeleton variant="rounded" width="100%" height={80} />`;

const animationCode = `{/* pulse (default) */}
<Skeleton variant="rounded" width="100%" height={40} animation="pulse" />

{/* wave shimmer */}
<Skeleton variant="rounded" width="100%" height={40} animation="wave" />

{/* no animation */}
<Skeleton variant="rounded" width="100%" height={40} animation="none" />`;

const linesCode = `{/* 3 text lines — last line auto-shortened */}
<Skeleton variant="text" lines={3} />

{/* 5 lines */}
<Skeleton variant="text" lines={5} />`;

const cardCode = `{/* Card skeleton mockup */}
<div className="flex gap-4 p-4">
  {/* avatar */}
  <Skeleton variant="circular" width={48} height={48} animation="wave" />
  {/* content lines */}
  <div className="flex-1 space-y-3">
    <Skeleton variant="text" width="60%" animation="wave" />
    <Skeleton variant="text" lines={3} animation="wave" />
  </div>
</div>`;

const imagecardCode = `{/* Image + content skeleton */}
<div className="rounded-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden">
  <Skeleton variant="rectangular" width="100%" height={180} animation="wave" />
  <div className="p-4 space-y-3">
    <Skeleton variant="text" width="70%" animation="wave" />
    <Skeleton variant="text" lines={2} animation="wave" />
    <div className="flex gap-2 pt-1">
      <Skeleton variant="rounded" width={72} height={32} animation="wave" />
      <Skeleton variant="rounded" width={72} height={32} animation="wave" />
    </div>
  </div>
</div>`;

export default function SkeletonPage() {
  return (
    <div className="space-y-10">
      <PageTitle>Skeleton</PageTitle>

      {/* ── Variant shapes ──────────────────────────── */}
      <Section title="Variant shapes">
        <div className="space-y-4 max-w-sm">
          <div className="space-y-1">
            <p className="text-xs text-secondary-500 dark:text-secondary-400">text</p>
            <Skeleton variant="text" width="80%" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-secondary-500 dark:text-secondary-400">circular</p>
            <Skeleton variant="circular" width={48} height={48} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-secondary-500 dark:text-secondary-400">rectangular</p>
            <Skeleton variant="rectangular" width="100%" height={80} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-secondary-500 dark:text-secondary-400">rounded</p>
            <Skeleton variant="rounded" width="100%" height={80} />
          </div>
        </div>
        <CodeExample code={shapeCode} />
      </Section>

      {/* ── Animation modes ─────────────────────────── */}
      <Section title="Animation modes">
        <div className="space-y-4 max-w-sm">
          <div className="space-y-1">
            <p className="text-xs text-secondary-500 dark:text-secondary-400">pulse (default)</p>
            <Skeleton variant="rounded" width="100%" height={40} animation="pulse" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-secondary-500 dark:text-secondary-400">wave (shimmer)</p>
            <Skeleton variant="rounded" width="100%" height={40} animation="wave" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-secondary-500 dark:text-secondary-400">none</p>
            <Skeleton variant="rounded" width="100%" height={40} animation="none" />
          </div>
        </div>
        <CodeExample code={animationCode} />
      </Section>

      {/* ── lines prop ──────────────────────────────── */}
      <Section title="Text lines (lines prop)">
        <div className="space-y-6 max-w-sm">
          <div className="space-y-1">
            <p className="text-xs text-secondary-500 dark:text-secondary-400">lines={3}</p>
            <Skeleton variant="text" lines={3} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-secondary-500 dark:text-secondary-400">lines={5}</p>
            <Skeleton variant="text" lines={5} />
          </div>
        </div>
        <CodeExample code={linesCode} />
      </Section>

      {/* ── Real-world: card skeleton ────────────────── */}
      <Section title="Real-world: profile card skeleton">
        <div className="max-w-sm rounded-xl border border-secondary-200 p-4 dark:border-secondary-700">
          <div className="flex gap-4">
            <Skeleton variant="circular" width={48} height={48} animation="wave" />
            <div className="flex-1 space-y-3">
              <Skeleton variant="text" width="60%" animation="wave" />
              <Skeleton variant="text" lines={3} animation="wave" />
            </div>
          </div>
        </div>
        <CodeExample code={cardCode} />
      </Section>

      {/* ── Real-world: image card skeleton ─────────── */}
      <Section title="Real-world: image card skeleton">
        <div className="max-w-xs">
          <div className="overflow-hidden rounded-xl border border-secondary-200 dark:border-secondary-700">
            <Skeleton variant="rectangular" width="100%" height={180} animation="wave" />
            <div className="space-y-3 p-4">
              <Skeleton variant="text" width="70%" animation="wave" />
              <Skeleton variant="text" lines={2} animation="wave" />
              <div className="flex gap-2 pt-1">
                <Skeleton variant="rounded" width={72} height={32} animation="wave" />
                <Skeleton variant="rounded" width={72} height={32} animation="wave" />
              </div>
            </div>
          </div>
        </div>
        <CodeExample code={imagecardCode} />
      </Section>
    </div>
  );
}
