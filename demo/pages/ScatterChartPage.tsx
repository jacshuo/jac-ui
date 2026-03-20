import React, { useMemo } from "react";
import { ScatterChart } from "../../src";
import { Section, PageTitle, CodeExample, PropTable } from "./helpers";

/* Deterministic pseudo-random data using a simple LCG */
function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function makeCluster(
  id: string,
  name: string,
  cx: number,
  cy: number,
  spread: number,
  count: number,
  seed: number,
) {
  const rand = lcg(seed);
  return {
    id,
    name,
    data: Array.from({ length: count }, (_, i) => ({
      x: cx + (rand() - 0.5) * spread,
      y: cy + (rand() - 0.5) * spread,
      label: `${name}[${i}]`,
    })),
  };
}

export default function ScatterChartPage() {
  const basicSeries = useMemo(
    () => [
      makeCluster("groupA", "Group A", 30, 40, 30, 30, 42),
      makeCluster("groupB", "Group B", 70, 60, 25, 30, 77),
    ],
    [],
  );

  const clusterSeries = useMemo(
    () => [
      makeCluster("c1", "Cluster 1", 20, 30, 18, 25, 11),
      makeCluster("c2", "Cluster 2", 60, 25, 15, 25, 22),
      makeCluster("c3", "Cluster 3", 40, 70, 20, 25, 33),
    ],
    [],
  );

  const jitterSeries = useMemo(
    () => [
      {
        id: "dense",
        name: "Dense Points",
        data: Array.from({ length: 60 }, (_, i) => ({
          x: Math.round(lcg(i * 7)() * 10) * 10,
          y: Math.round(lcg(i * 13)() * 10) * 10,
        })),
      },
    ],
    [],
  );

  const linkedSeries = useMemo(() => {
    const rand = lcg(99);
    return [
      {
        id: "trajectory-a",
        name: "Trajectory A",
        data: Array.from({ length: 12 }, (_, i) => ({
          x: i * 8,
          y: 20 + rand() * 40,
        })),
      },
      {
        id: "trajectory-b",
        name: "Trajectory B",
        data: Array.from({ length: 12 }, (_, i) => ({
          x: i * 8,
          y: 50 + rand() * 40,
        })),
      },
    ];
  }, []);

  const largeSeries = useMemo(
    () => [
      makeCluster("bigA", "Dataset A", 25, 25, 50, 100, 55),
      makeCluster("bigB", "Dataset B", 75, 75, 50, 100, 88),
      makeCluster("bigC", "Dataset C", 50, 50, 30, 50, 33),
    ],
    [],
  );

  return (
    <div className="max-w-4xl space-y-10">
      <PageTitle>ScatterChart</PageTitle>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">
        Pure SVG scatter chart with multi-series points, optional cluster ellipses, deterministic
        jitter, linked polylines, and hover tooltip. Ideal for correlation and distribution data.
      </p>

      {/* 1. Basic scatter */}
      <Section title="Basic Scatter — 2 Series">
        <ScatterChart
          title="Two Groups"
          series={basicSeries}
          height={300}
          xAxis={{ label: "X Value" }}
          yAxis={{ label: "Y Value" }}
        />
        <CodeExample
          code={`<ScatterChart
  series={[
    { id: "groupA", name: "Group A", data: [...] },
    { id: "groupB", name: "Group B", data: [...] },
  ]}
  height={300}
  xAxis={{ label: "X Value" }}
  yAxis={{ label: "Y Value" }}
/>`}
        />
      </Section>

      {/* 2. Clusters */}
      <Section title="Cluster Ellipses">
        <div className="mb-3 rounded-lg border border-primary-200 bg-primary-50 p-3 text-xs text-primary-700 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-300">
          💡 When <code>clusters=true</code>, a faint bounding ellipse is drawn around each
          series&apos; points to visually highlight groupings.
        </div>
        <ScatterChart
          title="Three Clusters with Visual Ellipses"
          series={clusterSeries}
          clusters
          height={320}
          dotRadius={5}
        />
        <CodeExample
          code={`<ScatterChart
  series={clusterSeries}
  clusters
  height={320}
/>`}
        />
      </Section>

      {/* 3. Jitter */}
      <Section title="Jitter — Reduce Overlap">
        <div className="mb-3 rounded-lg border border-primary-200 bg-primary-50 p-3 text-xs text-primary-700 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-300">
          💡 <code>jitter=true</code> applies a deterministic small offset to each point to prevent
          them stacking on the same pixel.
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium text-secondary-500">Without jitter</p>
            <ScatterChart
              series={jitterSeries}
              height={220}
              legend={false}
              dotRadius={4}
              animateOnMount={false}
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-secondary-500">With jitter</p>
            <ScatterChart
              series={jitterSeries}
              height={220}
              legend={false}
              jitter
              jitterAmount={10}
              dotRadius={4}
              animateOnMount={false}
            />
          </div>
        </div>
        <CodeExample code={`<ScatterChart series={denseSeries} jitter jitterAmount={10} />`} />
      </Section>

      {/* 4. Linked lines */}
      <Section title="Linked Lines — Connect Points">
        <ScatterChart
          title="Two Trajectories"
          series={linkedSeries}
          linkedLines
          height={280}
          dotRadius={5}
        />
        <CodeExample
          code={`<ScatterChart
  series={trajectories}
  linkedLines
/>`}
        />
      </Section>

      {/* 5. Large dataset */}
      <Section title="Large Dataset — 250 Points">
        <ScatterChart
          title="Performance Test — 250 points across 3 series"
          series={largeSeries}
          clusters
          height={320}
          dotRadius={4}
          dotOpacity={0.65}
        />
        <CodeExample
          code={`<ScatterChart
  series={largeSeries}  // 250 total points
  clusters
  dotRadius={4}
  dotOpacity={0.65}
/>`}
        />
      </Section>

      {/* 6. Legend interaction */}
      <Section title="Legend Interaction">
        <div className="mb-3 rounded-lg border border-primary-200 bg-primary-50 p-3 text-xs text-primary-700 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-300">
          💡 Click legend items to show/hide series. Hover/touch a dot to see its exact coordinates.
        </div>
        <ScatterChart
          title="Toggle series via legend"
          series={clusterSeries}
          clusters
          legendPosition="right"
          height={300}
        />
      </Section>

      {/* 7. Empty state */}
      <Section title="Empty State">
        <ScatterChart series={[]} height={200} emptyText="No data points to display" />
        <CodeExample code={`<ScatterChart series={[]} emptyText="No data points to display" />`} />
      </Section>

      {/* Props */}
      <Section title="Props">
        <PropTable
          rows={[
            {
              prop: "series",
              type: "ChartSeries[]",
              required: true,
              description: "Array of data series with numeric x/y values.",
            },
            { prop: "xAxis", type: "AxisConfig", description: "X axis configuration." },
            { prop: "yAxis", type: "AxisConfig", description: "Y axis configuration." },
            {
              prop: "dotRadius",
              type: "number",
              default: "5",
              description: "Radius of each dot in px.",
            },
            {
              prop: "dotOpacity",
              type: "number",
              default: "0.75",
              description: "Fill opacity of dots (0–1).",
            },
            {
              prop: "clusters",
              type: "boolean",
              default: "false",
              description: "Draw bounding ellipse around each series' points.",
            },
            {
              prop: "jitter",
              type: "boolean",
              default: "false",
              description: "Apply deterministic small offset to dots to reduce overlap.",
            },
            {
              prop: "jitterAmount",
              type: "number",
              default: "12",
              description: "Max jitter offset in px.",
            },
            {
              prop: "linkedLines",
              type: "boolean",
              default: "false",
              description: "Draw polylines connecting same-series points in x-order.",
            },
            { prop: "height", type: "number", default: "300", description: "Chart height in px." },
            { prop: "legend", type: "boolean", default: "true", description: "Show legend." },
            {
              prop: "legendPosition",
              type: '"top" | "bottom" | "left" | "right"',
              default: '"bottom"',
              description: "Legend placement.",
            },
            {
              prop: "animateOnMount",
              type: "boolean",
              default: "true",
              description: "Animate dots on first render.",
            },
          ]}
        />
      </Section>
    </div>
  );
}
