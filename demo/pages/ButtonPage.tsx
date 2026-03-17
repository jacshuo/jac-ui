import { useState } from 'react';
import { Button, DropdownButton, type DropdownItem } from '../../src';
import { Section, PageTitle } from './helpers';
import { Plus, Save, Trash2, Download, Tags, ListChecks } from 'lucide-react';

const menuItems: DropdownItem[] = [
  { label: 'Edit', onClick: () => console.log('Edit') },
  { label: 'Duplicate', onClick: () => console.log('Duplicate') },
  { label: 'Delete', divider: true, onClick: () => console.log('Delete') },
];

const defaultTags: DropdownItem[] = [
  { key: 'bug', label: 'Bug' },
  { key: 'feature', label: 'Feature' },
  { key: 'docs', label: 'Documentation' },
  { key: 'enhancement', label: 'Enhancement' },
  { key: 'question', label: 'Question' },
];

export default function ButtonPage() {
  const [tags, setTags] = useState<DropdownItem[]>(defaultTags);
  const [selectedTags, setSelectedTags] = useState<string[]>(['bug', 'feature']);

  const [assignees, setAssignees] = useState<DropdownItem[]>([
    { key: 'alice', label: 'Alice' },
    { key: 'bob', label: 'Bob' },
    { key: 'charlie', label: 'Charlie' },
  ]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  return (
    <div className="space-y-8">
      <PageTitle>Button</PageTitle>

      <Section title="Intent variants">
        <div className="flex flex-wrap gap-3">
          <Button intent="primary"><Plus /> Primary</Button>
          <Button intent="secondary"><Save /> Secondary</Button>
          <Button intent="danger"><Trash2 /> Danger</Button>
          <Button intent="warning">Warning</Button>
          <Button intent="ghost">Ghost</Button>
          <Button intent="outline"><Download /> Outline</Button>
        </div>
      </Section>

      <Section title="Sizes">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm"><Plus /> Small</Button>
          <Button size="md"><Plus /> Medium</Button>
          <Button size="lg"><Plus /> Large</Button>
        </div>
      </Section>

      <Section title="Disabled">
        <div className="flex flex-wrap gap-3">
          <Button disabled><Save /> Disabled</Button>
          <Button intent="outline" disabled><Download /> Disabled Outline</Button>
        </div>
      </Section>

      <Section title="Dropdown Button">
        <div className="flex flex-wrap gap-3">
          <DropdownButton label="Actions" items={menuItems} intent="primary" />
          <DropdownButton label="Options" items={menuItems} intent="outline" />
          <DropdownButton label="Danger" items={menuItems} intent="danger" />
          <DropdownButton label="Disabled" items={menuItems} intent="secondary" disabled />
        </div>
      </Section>

      <Section title="Multi-select with checkboxes">
        <div className="flex flex-wrap items-start gap-3">
          <DropdownButton
            label={<><Tags /> Labels</>}
            items={tags}
            intent="outline"
            multiple
            selected={selectedTags}
            onSelectionChange={setSelectedTags}
          />
          <DropdownButton
            label={<><ListChecks /> Assignees</>}
            items={assignees}
            intent="secondary"
            multiple
            selected={selectedAssignees}
            onSelectionChange={setSelectedAssignees}
          />
        </div>
        <div className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
          <p>Labels: {selectedTags.length ? selectedTags.join(', ') : <em>none</em>}</p>
          <p>Assignees: {selectedAssignees.length ? selectedAssignees.join(', ') : <em>none</em>}</p>
        </div>
      </Section>

      <Section title="Editable — filter & add items">
        <div className="flex flex-wrap items-start gap-3">
          <DropdownButton
            label={<><Tags /> Labels</>}
            items={tags}
            intent="outline"
            editable
            multiple
            selected={selectedTags}
            onSelectionChange={setSelectedTags}
            onAddItem={(value) => {
              const key = value.toLowerCase().replace(/\s+/g, '-');
              setTags((prev) => [...prev, { key, label: value }]);
              setSelectedTags((prev) => [...prev, key]);
            }}
          />
          <DropdownButton
            label={<><ListChecks /> Assignees</>}
            items={assignees}
            intent="secondary"
            editable
            multiple
            selected={selectedAssignees}
            onSelectionChange={setSelectedAssignees}
            onAddItem={(value) => {
              const key = value.toLowerCase().replace(/\s+/g, '-');
              setAssignees((prev) => [...prev, { key, label: value }]);
              setSelectedAssignees((prev) => [...prev, key]);
            }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Type a name not in the list and press Enter to add it.</p>
      </Section>
    </div>
  );
}
