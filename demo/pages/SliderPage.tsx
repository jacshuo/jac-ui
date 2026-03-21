import { useState } from "react";
import { Slider, SliderRange } from "../../src";
import { Section, PageTitle, CodeExample, PropTable, type PropRow } from "./helpers";

const basicCode = `const [vol, setVol] = useState(40);

<Slider
  value={vol}
  onChange={setVol}
  label="Volume"
  showValue
  formatValue={(v) => \`\${v}%\`}
/>`;

const rangeCode = `const [range, setRange] = useState<[number, number]>([20, 70]);

<SliderRange
  value={range}
  onChange={setRange}
  label="Price range"
  showValue
  formatValue={(v) => \`$\${v}\`}
/>`;

const intentCode = `<Slider value={50} label="Primary"   intent="primary"   showValue />
<Slider value={50} label="Success"   intent="success"   showValue />
<Slider value={50} label="Warning"   intent="warning"   showValue />
<Slider value={50} label="Danger"    intent="danger"    showValue />
<Slider value={50} label="Secondary" intent="secondary" showValue />`;

const sliderProps: PropRow[] = [
  { prop: "value", type: "number", description: "Controlled value." },
  {
    prop: "defaultValue",
    type: "number",
    default: "0",
    description: "Uncontrolled starting value.",
  },
  { prop: "onChange", type: "(value: number) => void", description: "Change callback." },
  { prop: "min", type: "number", default: "0", description: "Minimum value." },
  { prop: "max", type: "number", default: "100", description: "Maximum value." },
  { prop: "step", type: "number", default: "1", description: "Step increment." },
  { prop: "label", type: "string", description: "Label rendered above the track." },
  {
    prop: "showValue",
    type: "boolean",
    default: "false",
    description: "Show current value next to the label.",
  },
  { prop: "formatValue", type: "(v: number) => string", description: "Custom value formatter." },
  {
    prop: "intent",
    type: '"primary" | "secondary" | "success" | "danger" | "warning"',
    default: '"primary"',
    description: "Color intent.",
  },
  { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Track height." },
  { prop: "disabled", type: "boolean", default: "false", description: "Disable interaction." },
];

const rangeProps: PropRow[] = [
  { prop: "value", type: "[number, number]", description: "Controlled [min, max] range." },
  {
    prop: "defaultValue",
    type: "[number, number]",
    default: "[0, 100]",
    description: "Uncontrolled default range.",
  },
  { prop: "onChange", type: "(value: [number, number]) => void", description: "Change callback." },
  { prop: "min", type: "number", default: "0", description: "Minimum." },
  { prop: "max", type: "number", default: "100", description: "Maximum." },
  { prop: "step", type: "number", default: "1", description: "Step." },
  { prop: "label", type: "string", description: "Label." },
  { prop: "showValue", type: "boolean", default: "false", description: "Show range values." },
  { prop: "intent", type: '"primary" | ...', default: '"primary"', description: "Color intent." },
  { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Track height." },
  { prop: "disabled", type: "boolean", default: "false", description: "Disable." },
];

export default function SliderPage() {
  const [vol, setVol] = useState(40);
  const [range, setRange] = useState<[number, number]>([20, 70]);

  return (
    <div className="space-y-10 p-6">
      <PageTitle>Slider</PageTitle>

      <Section title="Single value">
        <div className="max-w-md space-y-4">
          <Slider
            value={vol}
            onChange={setVol}
            label="Volume"
            showValue
            formatValue={(v) => `${v}%`}
          />
        </div>
        <CodeExample code={basicCode} />
      </Section>

      <Section title="Range (two thumbs)">
        <div className="max-w-md space-y-4">
          <SliderRange
            mode="range"
            value={range}
            onChange={setRange}
            label="Price range"
            showValue
            formatValue={(v) => `$${v}`}
          />
        </div>
        <CodeExample code={rangeCode} />
      </Section>

      <Section title="Intents">
        <div className="max-w-md space-y-4">
          {(["primary", "success", "warning", "danger", "secondary"] as const).map((intent) => (
            <Slider
              key={intent}
              value={50}
              label={intent[0].toUpperCase() + intent.slice(1)}
              intent={intent}
              showValue
            />
          ))}
        </div>
        <CodeExample code={intentCode} />
      </Section>

      <Section title="Sizes">
        <div className="max-w-md space-y-4">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Slider key={size} value={60} label={`Size: ${size}`} size={size} />
          ))}
        </div>
      </Section>

      <Section title="Disabled">
        <div className="max-w-md">
          <Slider value={35} label="Disabled slider" showValue disabled />
        </div>
      </Section>

      <Section title="Props — Slider">
        <PropTable rows={sliderProps} />
      </Section>
      <Section title="Props — SliderRange">
        <PropTable rows={rangeProps} />
      </Section>
    </div>
  );
}
