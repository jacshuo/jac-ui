import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const sliderBaseProps: PropRow[] = [
  { prop: "min", type: "number", default: "0", description: "Minimum value" },
  { prop: "max", type: "number", default: "100", description: "Maximum value" },
  { prop: "step", type: "number", default: "1", description: "Snap increment" },
  {
    prop: "intent",
    type: `"primary" | "secondary" | "success" | "danger" | "warning"`,
    default: `"primary"`,
    description: "Track and thumb color",
  },
  {
    prop: "size",
    type: `"sm" | "md" | "lg"`,
    default: `"md"`,
    description: "Track height",
  },
  { prop: "disabled", type: "boolean", default: "false", description: "Disable interaction" },
  {
    prop: "showValue",
    type: "boolean",
    default: "false",
    description: "Display current value above the thumb",
  },
  {
    prop: "formatValue",
    type: "(value: number) => string",
    description: "Custom value display formatter",
  },
  { prop: "label", type: "string", description: "Accessible label for the slider" },
];

const sliderSingleProps: PropRow[] = [
  { prop: "mode", type: `"single"`, description: "Single-thumb mode (default when omitted)" },
  { prop: "value", type: "number", description: "Controlled current value" },
  { prop: "defaultValue", type: "number", description: "Uncontrolled initial value" },
  { prop: "onChange", type: "(value: number) => void", description: "Change callback" },
];

const sliderRangeProps: PropRow[] = [
  { prop: "mode", type: `"range"`, required: true, description: "Enable dual-thumb range mode" },
  { prop: "value", type: "[number, number]", description: "Controlled range value" },
  { prop: "defaultValue", type: "[number, number]", description: "Uncontrolled initial range" },
  { prop: "onChange", type: "(value: [number, number]) => void", description: "Change callback" },
];

const usageCode = `import { Slider, SliderRange } from "@jacshuo/onyx";
import { useState } from "react";

export function Example() {
  const [vol, setVol] = useState(40);
  const [range, setRange] = useState<[number, number]>([20, 70]);

  return (
    <div className="flex flex-col gap-6 max-w-sm">
      {/* Single slider */}
      <Slider
        value={vol}
        onChange={setVol}
        min={0}
        max={100}
        showValue
        label="Volume"
      />

      {/* Range slider */}
      <SliderRange
        value={range}
        onChange={setRange}
        min={0}
        max={100}
        showValue
        label="Price range"
        intent="success"
      />

      {/* Intents */}
      <Slider defaultValue={60} intent="danger" />
      <Slider defaultValue={30} intent="warning" size="sm" />
    </div>
  );
}`;

const typesCode = `export type SliderProps =
  Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
    mode?: "single";
    min?: number;
    max?: number;
    step?: number;
    intent?: "primary" | "secondary" | "success" | "danger" | "warning";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    showValue?: boolean;
    formatValue?: (value: number) => string;
    label?: string;
    value?: number;
    defaultValue?: number;
    onChange?: (value: number) => void;
  };

export type SliderRangeProps =
  Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
    mode: "range";
    min?: number;
    max?: number;
    step?: number;
    intent?: "primary" | "secondary" | "success" | "danger" | "warning";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    showValue?: boolean;
    formatValue?: (value: number) => string;
    label?: string;
    value?: [number, number];
    defaultValue?: [number, number];
    onChange?: (value: [number, number]) => void;
  };`;

export default function SliderDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Slider &amp; SliderRange</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { Slider, SliderRange, type SliderProps, type SliderRangeProps } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="Shared Base Props">
        <PropTable rows={sliderBaseProps} />
      </Section>

      <Section title="Slider (single) Props">
        <PropTable rows={sliderSingleProps} title="Slider" />
      </Section>

      <Section title="SliderRange Props">
        <PropTable rows={sliderRangeProps} title="SliderRange" />
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
