import { useState } from "react";
import { Inbox, Send, Archive, Star, Trash2 } from "lucide-react";
import { Dropdown, type DropdownOption } from "../../src";
import { Section, PageTitle } from "./helpers";

const fruits: DropdownOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "dragonfruit", label: "Dragon Fruit" },
  { value: "elderberry", label: "Elderberry" },
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
          />
        </Section>

        <Section title="With icons & pre-selected">
          <Dropdown options={withIcons} value={icon} onChange={setIcon} />
        </Section>

        <Section title="Editable (type to filter)">
          <Dropdown
            options={fruits}
            value={editable}
            onChange={setEditable}
            placeholder="Type or select…"
            editable
          />
        </Section>

        <Section title="Right-aligned menu">
          <Dropdown
            options={fruits}
            value={right}
            onChange={setRight}
            placeholder="Right align…"
            align="right"
          />
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
        </Section>
      </div>
    </div>
  );
}
