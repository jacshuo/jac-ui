import { useState, useCallback } from "react";
import {
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  SortableTable,
  DataTable,
  type ColumnDef,
} from "../../src";
import { Section, PageTitle } from "./helpers";

interface Person {
  id: number;
  name: string;
  role: string;
  age: number;
  status: "active" | "away" | "offline";
}

let nextId = 6;

const initialPeople: Person[] = [
  { id: 1, name: "Alice", role: "Engineer", age: 29, status: "active" },
  { id: 2, name: "Bob", role: "Designer", age: 34, status: "away" },
  { id: 3, name: "Carol", role: "PM", age: 27, status: "offline" },
  { id: 4, name: "Dave", role: "Engineer", age: 41, status: "active" },
  { id: 5, name: "Eve", role: "Designer", age: 23, status: "away" },
];

const statusColor: Record<string, "success" | "warning" | "error"> = {
  active: "success",
  away: "warning",
  offline: "error",
};

const sortableColumns: ColumnDef<Person>[] = [
  { key: "name", header: "Name", cell: (r) => r.name },
  { key: "role", header: "Role", cell: (r) => r.role },
  { key: "age", header: "Age", cell: (r) => r.age, compareFn: (a, b) => a.age - b.age },
  {
    key: "status",
    header: "Status",
    sortable: false,
    cell: (r) => <Badge intent={statusColor[r.status]}>{r.status}</Badge>,
  },
];

const dataColumns: ColumnDef<Person>[] = [
  { key: "name", header: "Name", cell: (r) => r.name, editValue: (r) => r.name },
  { key: "role", header: "Role", cell: (r) => r.role, editValue: (r) => r.role },
  {
    key: "age",
    header: "Age",
    cell: (r) => r.age,
    editValue: (r) => String(r.age),
    compareFn: (a, b) => a.age - b.age,
  },
  {
    key: "status",
    header: "Status",
    sortable: false,
    editable: false,
    cell: (r) => <Badge intent={statusColor[r.status]}>{r.status}</Badge>,
  },
];

export default function TablePage() {
  /* ── Single-select state ─────────────────────────────── */
  const [singleSel, setSingleSel] = useState<React.Key[]>([]);

  /* ── Multi-select state ──────────────────────────────── */
  const [multiSel, setMultiSel] = useState<React.Key[]>([]);

  /* ── Editable DataTable state ────────────────────────── */
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [editSel, setEditSel] = useState<React.Key[]>([]);

  const handleCellEdit = useCallback((rowKey: React.Key, colKey: string, value: string) => {
    setPeople((prev) =>
      prev.map((p) => {
        if (p.id !== rowKey) return p;
        if (colKey === "name") return { ...p, name: value };
        if (colKey === "role") return { ...p, role: value };
        if (colKey === "age") return { ...p, age: parseInt(value, 10) || 0 };
        return p;
      }),
    );
  }, []);

  const handleAdd = useCallback(() => {
    const id = nextId++;
    setPeople((prev) => [
      ...prev,
      { id, name: `New Person ${id}`, role: "TBD", age: 0, status: "offline" },
    ]);
  }, []);

  const handleDelete = useCallback((keys: React.Key[]) => {
    setPeople((prev) => prev.filter((p) => !keys.includes(p.id)));
    setEditSel([]);
  }, []);

  return (
    <div className="space-y-8">
      <PageTitle>Table</PageTitle>

      <Section title="SortableTable — click column headers to sort">
        <SortableTable
          columns={sortableColumns}
          data={initialPeople}
          defaultSort={{ column: "name", direction: "asc" }}
          rowKey={(r) => r.id}
        />
      </Section>

      <Section title="Single selection (radio)">
        <DataTable
          columns={sortableColumns}
          data={initialPeople}
          rowKey={(r) => r.id}
          selectionMode="single"
          selected={singleSel}
          onSelectionChange={setSingleSel}
          defaultSort={{ column: "name", direction: "asc" }}
        />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Selected: {singleSel.length ? String(singleSel[0]) : <em>none</em>}
        </p>
      </Section>

      <Section title="Multi selection (checkboxes)">
        <DataTable
          columns={sortableColumns}
          data={initialPeople}
          rowKey={(r) => r.id}
          selectionMode="multiple"
          selected={multiSel}
          onSelectionChange={setMultiSel}
          toolbar
          onDelete={(keys) => {
            setMultiSel([]);
            alert(`Delete: ${keys.join(", ")}`);
          }}
          defaultSort={{ column: "name", direction: "asc" }}
        />
      </Section>

      <Section title="Editable DataTable — double-click a cell to edit">
        <DataTable
          columns={dataColumns}
          data={people}
          rowKey={(r) => r.id}
          selectionMode="multiple"
          selected={editSel}
          onSelectionChange={setEditSel}
          editable
          onCellEdit={handleCellEdit}
          toolbar
          onAdd={handleAdd}
          onDelete={handleDelete}
          defaultSort={{ column: "name", direction: "asc" }}
        />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Double-click a cell to edit inline. Status column is not editable. Use toolbar to
          add/delete rows.
        </p>
      </Section>

      <Section title="Bordered variant (manual primitives)">
        <Table intent="bordered">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Widget</TableCell>
              <TableCell>$9.99</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>Gadget</TableCell>
              <TableCell>$19.99</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Section>
    </div>
  );
}
