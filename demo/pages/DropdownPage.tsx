import { useState } from "react";
import { Inbox, Send, Archive, Star, Trash2, AlertCircle } from "lucide-react";
import { Dropdown, Form, FormItem, type DropdownOption } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";

const basicCode = `<Dropdown
  options={fruits}
  value={selected}
  onChange={setSelected}
  placeholder="Pick a fruit…"
/>`;

const iconsCode = `const withIcons: DropdownOption[] = [
  { value: "inbox", label: "Inbox", icon: <Inbox /> },
  { value: "sent", label: "Sent", icon: <Send /> },
];
<Dropdown options={withIcons} value={icon} onChange={setIcon} />`;

const editableCode = `<Dropdown
  options={fruits}
  value={selected}
  onChange={setSelected}
  placeholder="Type or select…"
  editable
/>`;

const alignCode = `<Dropdown
  options={fruits}
  value={selected}
  onChange={setSelected}
  align="right"
/>`;

const defaultValueCode = `{/* Uncontrolled with default */}
<Dropdown options={fruits} defaultValue="cherry" placeholder="Pick a fruit…" />`;

const defaultSelectedCode = `{/* Uncontrolled multi-select with defaults */}
<Dropdown
  options={fruits}
  multiple
  defaultSelected={["banana", "elderberry"]}
  placeholder="Pick fruits…"
/>`;

const multiCode = `<Dropdown
  options={fruits}
  multiple
  selected={selectedFruits}
  onSelectionChange={setSelectedFruits}
  placeholder="Pick fruits…"
/>`;

const multiEditableCode = `<Dropdown
  options={colors}
  multiple
  editable
  selected={selectedColors}
  onSelectionChange={setSelectedColors}
  onAddItem={(value) => {
    const key = value.toLowerCase().replace(/\\s+/g, "-");
    setColors((prev) => [...prev, { value: key, label: value }]);
    setSelectedColors((prev) => [...prev, key]);
  }}
/>`;

const editableSingleCode = `<Dropdown
  options={items}
  value={selected}
  onChange={setSelected}
  editable
  onAddItem={(value) => {
    const key = value.toLowerCase().replace(/\\s+/g, "-");
    setItems((prev) => [...prev, { value: key, label: value }]);
    setSelected(key);
  }}
/>`;

const cascadedCode = `{/* Each dropdown is controlled by the previous */}
<Dropdown options={keysToOptions(geoData)} value={country} onChange={setCountry} placeholder="Select country…" />
<Dropdown options={stateOptions} value={state} onChange={setState} disabled={!country} />
<Dropdown options={countyOptions} value={county} onChange={setCounty} disabled={!state} />
<Dropdown options={cityOptions} value={city} onChange={setCity} disabled={!county} />`;

const sizesCode = `<Dropdown options={fruits} size="sm" />
<Dropdown options={fruits} size="md" />
<Dropdown options={fruits} size="lg" />
// Available sizes: "sm" | "md" | "lg"`;

const selfValidationCode = `// ── How onValidate fires ──────────────────────────────────
// FormItem wraps Dropdown's onChange. Every time the user
// picks or clears a value, FormItem calls onValidate(value)
// and renders the matching status + message automatically.

// 1. Required single-select
<FormItem
  label="Assignee"
  required
  onValidate={(val) =>
    val && val !== ""
      ? { result: true,  reason: "Assignee confirmed" }
      : { result: false, reason: "Assignee is required" }
  }
>
  <Dropdown options={teamMembers} value={assignee}
            onChange={setAssignee} clearable className="w-full" />
</FormItem>

// 2. Multi-select with min / max constraints
// onValidate receives string[] because Dropdown fires
// onChange(string[]) in multiple mode.
<FormItem
  label="Labels (1–3)"
  required
  onValidate={(val) => {
    const n = (val as string[]).length;
    if (n === 0) return { result: false, reason: "Pick at least one label" };
    if (n > 3)  return { result: false, reason: \`Max 3 labels — you picked \${n}\` };
    return { result: true, reason: \`\${n} label\${n > 1 ? "s" : ""} selected\` };
  }}
>
  <Dropdown options={issueLabels} multiple
            selected={labels} onSelectionChange={setLabels}
            clearable className="w-full" />
</FormItem>`;

const bulkValidationCode = `// ── How onValues bulk validation fires ──────────────────
// On submit, Form collects FormData (from Dropdown name= hidden inputs),
// calls onValues(data), and routes each BulkValidationResult entry
// to the FormItem whose name= matches.

const handleValues = (data) => {
  const errors = {};
  if (!data.type)
    errors.type = { result: false, reason: "Issue type is required" };
  if (!data.severity)
    errors.severity = { result: false, reason: "Severity is required" };
  // multi hidden inputs use name[] key
  if (!data["labels[]"])
    errors.labels = { result: false, reason: "At least one label required" };
  // soft info: assignees is optional but we still return a message
  errors.assignees = data["assignees[]"]
    ? { result: true, reason: "Assignees set" }
    : { result: true, reason: "No assignees — issue will be unowned" };
  return errors;
};

<Form onValues={handleValues} footer={<button type="submit">Create issue</button>}>
  {/* name on FormItem routes bulk error; name on Dropdown = hidden input */}
  <FormItem name="type" label="Issue type" required>
    <Dropdown options={issueTypes} name="type"
              value={type} onChange={setType} clearable className="w-full" />
  </FormItem>
  <FormItem name="severity" label="Severity" required>
    <Dropdown options={severities} name="severity"
              value={severity} onChange={setSeverity} clearable className="w-full" />
  </FormItem>
  <FormItem name="assignees" label="Assignees">
    <Dropdown options={teamMembers} multiple name="assignees"
              selected={assignees} onSelectionChange={setAssignees}
              clearable className="w-full" />
  </FormItem>
  <FormItem name="labels" label="Labels" required>
    <Dropdown options={issueLabels} multiple name="labels"
              selected={labels} onSelectionChange={setLabels}
              clearable className="w-full" />
  </FormItem>
</Form>`;

const formSubmitCode = `// Use onSubmit (not onValues) to access raw FormData so that
// repeated name[] entries from multi-select are captured with getAll().
<Form
  onSubmit={(e) => {
    const fd = new FormData(e.currentTarget);
    const result = {};
    const seen = new Set();
    fd.forEach((_, key) => {
      if (seen.has(key)) return;
      seen.add(key);
      result[key.endsWith('[]') ? key.slice(0, -2) : key] =
        key.endsWith('[]') ? fd.getAll(key) : fd.get(key);
    });
    setOutput(JSON.stringify(result, null, 2));
  }}
  footer={<button type="submit">Submit form</button>}
>
  <FormItem label="Fruit" name="fruit" required>
    {/* name prop renders a hidden <input> for native FormData */}
    <Dropdown
      options={fruits}
      name="fruit"
      value={fruit}
      onChange={setFruit}
      clearable
      className="w-full"
    />
  </FormItem>
  <FormItem label="Favorite icons" name="icons">
    {/* multi: one hidden input per value under name="icons[]" */}
    <Dropdown
      options={icons}
      multiple
      name="icons"
      selected={icons}
      onSelectionChange={setIcons}
      clearable
      className="w-full"
    />
  </FormItem>
</Form>`;

const fruits: DropdownOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "dragonfruit", label: "Dragon Fruit" },
  { value: "elderberry", label: "Elderberry" },
];

const issueTypes: DropdownOption[] = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "improvement", label: "Improvement" },
  { value: "task", label: "Task" },
];

const severities: DropdownOption[] = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const teamMembers: DropdownOption[] = [
  { value: "alice", label: "Alice" },
  { value: "bob", label: "Bob" },
  { value: "carol", label: "Carol" },
  { value: "dave", label: "Dave" },
];

const issueLabels: DropdownOption[] = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "design", label: "Design" },
  { value: "urgent", label: "Urgent" },
  { value: "good-first-issue", label: "Good first issue" },
];

const withIcons: DropdownOption[] = [
  { value: "inbox", label: "Inbox", icon: <Inbox /> },
  { value: "sent", label: "Sent", icon: <Send /> },
  { value: "archive", label: "Archive", icon: <Archive /> },
  { value: "starred", label: "Starred", icon: <Star /> },
  { value: "trash", label: "Trash", icon: <Trash2 /> },
];

const defaultColors: DropdownOption[] = [
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
  { value: "yellow", label: "Yellow" },
  { value: "purple", label: "Purple" },
];

/* ── Cascaded geo data ─────────────────────────────────── */

interface GeoNode {
  [name: string]: GeoNode | null;
}

const geoData: GeoNode = {
  "United States": {
    California: {
      "Los Angeles County": {
        "Los Angeles": null,
        "Long Beach": null,
        Pasadena: null,
      },
      "San Francisco County": {
        "San Francisco": null,
        "Daly City": null,
      },
      "San Diego County": {
        "San Diego": null,
        "Chula Vista": null,
        Oceanside: null,
      },
    },
    Texas: {
      "Harris County": {
        Houston: null,
        Pasadena: null,
        Baytown: null,
      },
      "Dallas County": {
        Dallas: null,
        Irving: null,
        Garland: null,
      },
    },
    "New York": {
      "New York County": {
        Manhattan: null,
      },
      "Kings County": {
        Brooklyn: null,
      },
      "Erie County": {
        Buffalo: null,
        Cheektowaga: null,
      },
    },
  },
  Canada: {
    Ontario: {
      "York Region": {
        Toronto: null,
        Markham: null,
        "Richmond Hill": null,
      },
      "Ottawa Region": {
        Ottawa: null,
        Gatineau: null,
      },
    },
    "British Columbia": {
      "Metro Vancouver": {
        Vancouver: null,
        Burnaby: null,
        Surrey: null,
      },
    },
  },
  Australia: {
    "New South Wales": {
      "Sydney Region": {
        Sydney: null,
        Parramatta: null,
      },
    },
    Victoria: {
      "Melbourne Region": {
        Melbourne: null,
        Geelong: null,
      },
    },
  },
};

function keysToOptions(obj: GeoNode | null): DropdownOption[] {
  if (!obj) return [];
  return Object.keys(obj).map((k) => ({ value: k, label: k }));
}

export default function DropdownPage() {
  const [basic, setBasic] = useState<string>();
  const [icon, setIcon] = useState("inbox");
  const [editable, setEditable] = useState<string>();
  const [right, setRight] = useState<string>();

  // Multi-select state
  const [selectedFruits, setSelectedFruits] = useState<string[]>(["apple", "cherry"]);

  // Editable multi-select with add
  const [colors, setColors] = useState<DropdownOption[]>(defaultColors);
  const [selectedColors, setSelectedColors] = useState<string[]>(["blue"]);

  // Editable single-select with add
  const [editableItems, setEditableItems] = useState<DropdownOption[]>(fruits);
  const [editableSingle, setEditableSingle] = useState<string>();

  // Cascaded selection state
  const [country, setCountry] = useState<string>();
  const [state, setState] = useState<string>();
  const [county, setCounty] = useState<string>();
  const [city, setCity] = useState<string>();

  // Form feature demos — clearable & intent
  const [clearable, setClearable] = useState<string>();
  const [clearableMulti, setClearableMulti] = useState<string[]>([]);
  // Self-validation — onValidate demos
  const [svAssignee, setSvAssignee] = useState<string>();
  const [svLabels, setSvLabels] = useState<string[]>([]);
  // Bulk validation — onValues "Create issue" demo
  const [bvType, setBvType] = useState<string>();
  const [bvSeverity, setBvSeverity] = useState<string>();
  const [bvAssignees, setBvAssignees] = useState<string[]>([]);
  const [bvLabels, setBvLabels] = useState<string[]>([]);
  const [bvOutput, setBvOutput] = useState<string>();
  // Form submission demo — native hidden inputs
  const [formFruit, setFormFruit] = useState<string>();
  const [formIcons, setFormIcons] = useState<string[]>([]);
  const [formOutput, setFormOutput] = useState<string>("");

  const stateOptions = country ? keysToOptions(geoData[country] as GeoNode) : [];
  const countyOptions =
    country && state ? keysToOptions((geoData[country] as GeoNode)?.[state] as GeoNode) : [];
  const cityOptions =
    country && state && county
      ? keysToOptions(((geoData[country] as GeoNode)?.[state] as GeoNode)?.[county] as GeoNode)
      : [];

  return (
    <div className="space-y-8">
      <PageTitle>Dropdown</PageTitle>

      <div className="grid gap-8 lg:grid-cols-2">
        <Section title="Basic">
          <Dropdown
            options={fruits}
            value={basic}
            onChange={setBasic}
            placeholder="Pick a fruit…"
          />{" "}
          <CodeExample code={basicCode} />{" "}
        </Section>

        <Section title="With icons & pre-selected">
          <Dropdown options={withIcons} value={icon} onChange={setIcon} />
          <CodeExample code={iconsCode} />
        </Section>

        <Section title="Editable (type to filter)">
          <Dropdown
            options={fruits}
            value={editable}
            onChange={setEditable}
            placeholder="Type or select…"
            editable
          />
          <CodeExample code={editableCode} />
        </Section>

        <Section title="Right-aligned menu">
          <Dropdown
            options={fruits}
            value={right}
            onChange={setRight}
            placeholder="Right align…"
            align="right"
          />
          <CodeExample code={alignCode} />
        </Section>

        <Section title="Default value (uncontrolled)">
          <Dropdown options={fruits} defaultValue="cherry" placeholder="Pick a fruit…" />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Pre-selects &ldquo;Cherry&rdquo; without controlled state.
          </p>
          <CodeExample code={defaultValueCode} />
        </Section>

        <Section title="Default selected (uncontrolled multi)">
          <Dropdown
            options={fruits}
            multiple
            defaultSelected={["banana", "elderberry"]}
            placeholder="Pick fruits…"
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Pre-selects &ldquo;Banana&rdquo; and &ldquo;Elderberry&rdquo; without controlled state.
          </p>
          <CodeExample code={defaultSelectedCode} />
        </Section>

        <Section title="Multi-select with checkboxes">
          <Dropdown
            options={fruits}
            multiple
            selected={selectedFruits}
            onSelectionChange={setSelectedFruits}
            placeholder="Pick fruits…"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Selected: {selectedFruits.length ? selectedFruits.join(", ") : <em>none</em>}
          </p>
          <CodeExample code={multiCode} />
        </Section>

        <Section title="Multi-select + editable + add items">
          <Dropdown
            options={colors}
            multiple
            editable
            selected={selectedColors}
            onSelectionChange={setSelectedColors}
            placeholder="Type to filter or add…"
            onAddItem={(value) => {
              const key = value.toLowerCase().replace(/\s+/g, "-");
              setColors((prev) => [...prev, { value: key, label: value }]);
              setSelectedColors((prev) => [...prev, key]);
            }}
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Selected: {selectedColors.length ? selectedColors.join(", ") : <em>none</em>}
          </p>
          <CodeExample code={multiEditableCode} />
        </Section>

        <Section title="Editable + add items (single)">
          <Dropdown
            options={editableItems}
            value={editableSingle}
            onChange={setEditableSingle}
            editable
            placeholder="Type to filter or add…"
            onAddItem={(value) => {
              const key = value.toLowerCase().replace(/\s+/g, "-");
              setEditableItems((prev) => [...prev, { value: key, label: value }]);
              setEditableSingle(key);
            }}
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Type a name not in the list and press Enter to add it.
          </p>
          <CodeExample code={editableSingleCode} />
        </Section>
      </div>

      {/* ── Cascaded selection ─────────────────────── */}
      <Section title="Cascaded selection (Country → State → County → City)">
        <div className="max-w-lg">
          <Form layout="inline">
            <FormItem label="Country" required>
              <Dropdown
                options={keysToOptions(geoData)}
                value={country}
                onChange={(v) => {
                  setCountry(v);
                  const states = keysToOptions(geoData[v] as GeoNode);
                  const firstState = states[0]?.value;
                  setState(firstState);
                  const counties = firstState
                    ? keysToOptions((geoData[v] as GeoNode)?.[firstState] as GeoNode)
                    : [];
                  const firstCounty = counties[0]?.value;
                  setCounty(firstCounty);
                  const cities = firstCounty
                    ? keysToOptions(
                        ((geoData[v] as GeoNode)?.[firstState!] as GeoNode)?.[
                          firstCounty
                        ] as GeoNode,
                      )
                    : [];
                  setCity(cities[0]?.value);
                }}
                placeholder="Select country…"
              />
            </FormItem>
            <FormItem label="State / Province">
              <Dropdown
                options={stateOptions}
                value={state}
                onChange={(v) => {
                  setState(v);
                  const counties = keysToOptions((geoData[country!] as GeoNode)?.[v] as GeoNode);
                  const firstCounty = counties[0]?.value;
                  setCounty(firstCounty);
                  const cities = firstCounty
                    ? keysToOptions(
                        ((geoData[country!] as GeoNode)?.[v] as GeoNode)?.[firstCounty] as GeoNode,
                      )
                    : [];
                  setCity(cities[0]?.value);
                }}
                placeholder="Select state…"
                disabled={!country}
              />
            </FormItem>
            <FormItem label="County / Region">
              <Dropdown
                options={countyOptions}
                value={county}
                onChange={(v) => {
                  setCounty(v);
                  const cities = keysToOptions(
                    ((geoData[country!] as GeoNode)?.[state!] as GeoNode)?.[v] as GeoNode,
                  );
                  setCity(cities[0]?.value);
                }}
                placeholder="Select county…"
                disabled={!state}
              />
            </FormItem>
            <FormItem label="City">
              <Dropdown
                options={cityOptions}
                value={city}
                onChange={setCity}
                placeholder="Select city…"
                disabled={!county}
              />
            </FormItem>
          </Form>
        </div>
        {city && (
          <p className="mt-3 text-sm text-primary-600 dark:text-primary-400">
            Selected: <strong>{city}</strong>, {county}, {state}, {country}
          </p>
        )}
        <CodeExample code={cascadedCode} />
      </Section>

      <Section title="Sizes">
        <div className="grid gap-6 sm:grid-cols-3">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-400">
                {size}
              </p>
              <Dropdown options={fruits} placeholder={`${size} dropdown…`} size={size} />
            </div>
          ))}
        </div>
        <CodeExample code={sizesCode} />
      </Section>

      {/* ── Form features ───────────────────────────── */}
      <Section title="Form field — intent / clearable / name">
        <p className="mb-4 text-sm text-secondary-600 dark:text-secondary-400">
          <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">Dropdown</code> is the
          single select primitive for forms. It supports validation intent, a clear button, and
          emits hidden inputs via{" "}
          <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">name</code> for native
          form submission — covering everything a classic{" "}
          <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">&lt;select&gt;</code>{" "}
          does, plus icons, animations, and multi-select.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Clearable */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary-400">
              clearable
            </p>
            <Dropdown
              options={fruits}
              value={clearable}
              onChange={setClearable}
              placeholder="Pick a fruit…"
              clearable
              className="w-full"
            />
            <p className="mt-2 text-xs text-secondary-500">
              Selected: <strong>{clearable || "—"}</strong>
            </p>
            <CodeExample
              code={`<Dropdown
  options={fruits}
  value={selected}
  onChange={setSelected}
  clearable
/>`}
            />
          </div>

          {/* Clearable multi */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary-400">
              clearable multi-select
            </p>
            <Dropdown
              options={fruits}
              multiple
              selected={clearableMulti}
              onSelectionChange={setClearableMulti}
              placeholder="Pick fruits…"
              clearable
              className="w-full"
            />
            <p className="mt-2 text-xs text-secondary-500">
              Selected: <strong>{clearableMulti.length ? clearableMulti.join(", ") : "—"}</strong>
            </p>
          </div>

          {/* Intent — default */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary-400">
              intent: &ldquo;default&rdquo;
            </p>
            <Dropdown
              options={fruits}
              placeholder="Normal field…"
              intent="default"
              className="w-full"
            />
          </div>

          {/* Intent — danger */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary-400">
              intent: &ldquo;danger&rdquo;
            </p>
            <Dropdown
              options={fruits}
              placeholder="Please select a value"
              intent="danger"
              className="w-full"
            />
            <p className="mt-2 flex items-center gap-1 text-xs text-danger-600 dark:text-danger-400">
              <AlertCircle className="h-3.5 w-3.5" />
              This field is required
            </p>
            <CodeExample
              code={`<Dropdown
  options={fruits}
  intent="danger"
  placeholder="Please select a value"
/>`}
            />
          </div>
        </div>
      </Section>

      <Section title="Self-validation — FormItem &amp; onValidate">
        {/* ── How it works ──────────────────────────────────────── */}
        <div className="mb-6 rounded-xl border border-primary-200 bg-primary-50 p-4 dark:border-primary-700 dark:bg-primary-900/30">
          <p className="mb-3 text-sm font-semibold text-primary-800 dark:text-primary-200">
            How it works
          </p>
          <ol className="space-y-2 text-sm text-primary-700 dark:text-primary-300">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                1
              </span>
              <span>
                User picks or clears a value → Dropdown fires{" "}
                <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">
                  onChange(value)
                </code>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                2
              </span>
              <span>
                <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">FormItem</code>{" "}
                intercepts the event and immediately calls your{" "}
                <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">
                  onValidate(value)
                </code>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                3
              </span>
              <span>
                Return{" "}
                <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">
                  {"{ result: boolean, reason: string }"}
                </code>{" "}
                — <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">false</code> =
                error, <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">true</code>{" "}
                = success. Empty reason hides the message.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                4
              </span>
              <span>
                <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">FormItem</code>{" "}
                injects{" "}
                <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">
                  aria-invalid
                </code>{" "}
                into the Dropdown trigger, which automatically applies the red error border and
                icon.
              </span>
            </li>
          </ol>
          <p className="mt-3 text-xs text-primary-500 dark:text-primary-400">
            In <strong>multi-select mode</strong>,{" "}
            <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">onValidate</code>{" "}
            receives the full{" "}
            <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">string[]</code> of
            selected values on every toggle and on clear — so you can enforce min/max count
            constraints.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Example 1: Required single-select */}
          <div>
            <p className="mb-1 text-sm font-semibold text-primary-800 dark:text-primary-200">
              Example 1 — Required field
            </p>
            <p className="mb-3 text-xs text-secondary-500 dark:text-secondary-400">
              Pick an assignee, then hit the ✕ clear button. The error appears immediately on clear
              and disappears the moment you pick again. No submit required.
            </p>
            <Form layout="stacked">
              <FormItem
                label="Assignee"
                required
                hint="Who is responsible for this issue?"
                onValidate={(val) =>
                  val && val !== ""
                    ? { result: true, reason: "Assignee confirmed" }
                    : { result: false, reason: "Assignee is required" }
                }
              >
                <Dropdown
                  options={teamMembers}
                  value={svAssignee}
                  onChange={setSvAssignee}
                  placeholder="Select assignee…"
                  clearable
                  className="w-full"
                />
              </FormItem>
            </Form>
          </div>

          {/* Example 2: Constrained multi-select */}
          <div>
            <p className="mb-1 text-sm font-semibold text-primary-800 dark:text-primary-200">
              Example 2 — Multi-select with min / max constraints
            </p>
            <p className="mb-3 text-xs text-secondary-500 dark:text-secondary-400">
              <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">onValidate</code>{" "}
              receives{" "}
              <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">string[]</code> on
              every toggle. 0 items = error. More than 3 = error. 1–3 = success with live count.
            </p>
            <Form layout="stacked">
              <FormItem
                label="Labels"
                required
                hint="Pick 1 to 3 labels for this issue"
                onValidate={(val) => {
                  const n = (val as string[]).length;
                  if (n === 0) return { result: false, reason: "Pick at least one label" };
                  if (n > 3) return { result: false, reason: `Max 3 labels — you picked ${n}` };
                  return {
                    result: true,
                    reason: `${n} label${n > 1 ? "s" : ""} selected — good to go!`,
                  };
                }}
              >
                <Dropdown
                  options={issueLabels}
                  multiple
                  selected={svLabels}
                  onSelectionChange={setSvLabels}
                  placeholder="Select labels…"
                  clearable
                  className="w-full"
                />
              </FormItem>
            </Form>
          </div>
        </div>
        <CodeExample code={selfValidationCode} />
      </Section>

      <Section title="Submit-time bulk validation — Form onValues">
        {/* ── How it works ──────────────────────────────────────── */}
        <div className="mb-6 rounded-xl border border-primary-200 bg-primary-50 p-4 dark:border-primary-700 dark:bg-primary-900/30">
          <p className="mb-3 text-sm font-semibold text-primary-800 dark:text-primary-200">
            How it works
          </p>
          <ol className="space-y-2 text-sm text-primary-700 dark:text-primary-300">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                1
              </span>
              <span>
                User submits →{" "}
                <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">Form</code>{" "}
                collects all{" "}
                <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">FormData</code>{" "}
                (from the hidden{" "}
                <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">
                  &lt;input&gt;
                </code>
                s rendered by Dropdown&apos;s{" "}
                <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">name=</code> prop)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                2
              </span>
              <span>
                <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">
                  onValues(data)
                </code>{" "}
                is called with a plain object snapshot. Validate the values and return a{" "}
                <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">
                  BulkValidationResult
                </code>
                .
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                3
              </span>
              <span>
                <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">Form</code> routes
                each{" "}
                <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">
                  {"{ result, reason }"}
                </code>{" "}
                entry to the{" "}
                <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">FormItem</code>{" "}
                whose <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">name=</code>{" "}
                matches.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                4
              </span>
              <span>
                <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">FormItem</code>{" "}
                injects{" "}
                <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">
                  aria-invalid
                </code>{" "}
                into the Dropdown trigger — the error border and message appear automatically.
              </span>
            </li>
          </ol>
          <p className="mt-3 text-xs text-primary-500 dark:text-primary-400">
            <strong>Key rule:</strong>{" "}
            <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">name=</code> must
            appear on <em>both</em>{" "}
            <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">FormItem</code>{" "}
            (routes bulk errors) and{" "}
            <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">Dropdown</code>{" "}
            (renders hidden inputs for FormData collection).
          </p>
        </div>

        <p className="mb-4 text-sm text-secondary-600 dark:text-secondary-400">
          Fill in any combination of fields then click <strong>Create issue</strong>. The panel on
          the right shows the exact{" "}
          <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">
            BulkValidationResult
          </code>{" "}
          object that{" "}
          <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">onValues</code>{" "}
          returned. Try submitting empty (all errors), then fill everything (all success).
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Interactive form */}
          <Form
            layout="stacked"
            title="Create issue"
            description="Required fields are marked with *"
            onValues={(data) => {
              const errors: Record<string, { result: boolean; reason: string }> = {};
              if (!data.type) errors.type = { result: false, reason: "Issue type is required" };
              if (!data.severity)
                errors.severity = { result: false, reason: "Severity is required" };
              // multi-select hidden inputs use name[] key
              if (!data["labels[]"])
                errors.labels = { result: false, reason: "At least one label is required" };
              // soft info: assignees is optional but we show a contextual message either way
              errors.assignees = data["assignees[]"]
                ? { result: true, reason: "Assignees set" }
                : { result: true, reason: "No assignees — issue will be unowned" };
              setBvOutput(JSON.stringify(errors, null, 2));
              return errors;
            }}
            footer={
              <button
                type="submit"
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Create issue
              </button>
            }
          >
            <FormItem name="type" label="Issue type" required>
              <Dropdown
                options={issueTypes}
                name="type"
                value={bvType}
                onChange={setBvType}
                placeholder="Select type…"
                clearable
                className="w-full"
              />
            </FormItem>
            <FormItem name="severity" label="Severity" required>
              <Dropdown
                options={severities}
                name="severity"
                value={bvSeverity}
                onChange={setBvSeverity}
                placeholder="Select severity…"
                clearable
                className="w-full"
              />
            </FormItem>
            <FormItem
              name="assignees"
              label="Assignees"
              hint="Optional — leave empty to create an unowned issue"
            >
              <Dropdown
                options={teamMembers}
                multiple
                name="assignees"
                selected={bvAssignees}
                onSelectionChange={setBvAssignees}
                placeholder="Select assignees…"
                clearable
                className="w-full"
              />
            </FormItem>
            <FormItem name="labels" label="Labels" required hint="Select at least one label">
              <Dropdown
                options={issueLabels}
                multiple
                name="labels"
                selected={bvLabels}
                onSelectionChange={setBvLabels}
                placeholder="Select labels…"
                clearable
                className="w-full"
              />
            </FormItem>
          </Form>

          {/* Live result panel */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-primary-800 dark:text-primary-200">
              BulkValidationResult returned by{" "}
              <code className="font-normal rounded bg-primary-100 px-1 dark:bg-primary-800">
                onValues
              </code>
            </p>
            <p className="text-xs text-secondary-500 dark:text-secondary-400">
              This is the exact object passed back to{" "}
              <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">Form</code>. Each
              key maps to a{" "}
              <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">
                FormItem name=
              </code>
              .
              <br />
              <strong className="text-danger-600 dark:text-danger-400">result: false</strong> → red
              error border + message
              <br />
              <strong className="text-success-600 dark:text-success-400">result: true</strong> →
              green success message
            </p>
            <pre className="min-h-48 flex-1 overflow-x-auto rounded-lg border border-primary-200 bg-primary-950 p-4 text-xs text-primary-200 dark:border-primary-700">
              {bvOutput ?? "— submit the form to see —"}
            </pre>
          </div>
        </div>
        <CodeExample code={bulkValidationCode} />
      </Section>

      <Section title="Form submission — hidden inputs">
        <p className="mb-4 text-sm text-secondary-600 dark:text-secondary-400">
          Setting <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">name</code>{" "}
          renders hidden{" "}
          <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">
            &lt;input type=&quot;hidden&quot;&gt;
          </code>{" "}
          elements so the selection is included in native form submission. Multi-select emits one
          hidden input per selection under{" "}
          <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">name[]</code>. Use{" "}
          together with{" "}
          <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">Form</code>&apos;s{" "}
          <code className="rounded bg-primary-100 px-1 dark:bg-primary-800">onValues</code> to
          capture submitted data — click &ldquo;Submit&rdquo; to see the output below.
        </p>
        <div className="max-w-sm">
          <Form
            layout="stacked"
            onSubmit={(e) => {
              const fd = new FormData(e.currentTarget);
              const result: Record<string, string | string[]> = {};
              const seen = new Set<string>();
              fd.forEach((_, key) => {
                if (seen.has(key)) return;
                seen.add(key);
                if (key.endsWith("[]")) {
                  result[key.slice(0, -2)] = fd.getAll(key) as string[];
                } else {
                  result[key] = fd.get(key) as string;
                }
              });
              setFormOutput(JSON.stringify(result, null, 2));
            }}
            footer={
              <button
                type="submit"
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Submit form
              </button>
            }
          >
            <FormItem label="Fruit" name="fruit" required>
              <Dropdown
                options={fruits}
                name="fruit"
                value={formFruit}
                onChange={setFormFruit}
                placeholder="Pick a fruit…"
                clearable
                className="w-full"
              />
            </FormItem>
            <FormItem label="Favorite icons (multi)" name="icons">
              <Dropdown
                options={withIcons}
                multiple
                name="icons"
                selected={formIcons}
                onSelectionChange={setFormIcons}
                placeholder="Pick some…"
                clearable
                className="w-full"
              />
            </FormItem>
          </Form>
          {formOutput && (
            <pre className="mt-3 overflow-x-auto rounded bg-primary-950 p-3 text-xs text-primary-200">
              {formOutput}
            </pre>
          )}
        </div>
        <CodeExample code={formSubmitCode} />
      </Section>
    </div>
  );
}
