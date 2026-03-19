import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  SortableTable,
  DataTable,
  type ColumnDef,
} from "../components/DataDisplay/Table";

/* ── Primitive elements ─────────────────────── */

describe("Table (primitives)", () => {
  it("renders a table element", () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alice</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(container.querySelector("table")).toBeTruthy();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("merges className on Table", () => {
    const { container } = render(
      <Table className="custom">
        <tbody />
      </Table>,
    );
    expect(container.querySelector("table")).toHaveClass("custom");
  });
});

describe("TableEmpty", () => {
  it("renders default empty text", () => {
    render(<TableEmpty />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("renders custom text", () => {
    render(<TableEmpty text="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders custom icon", () => {
    render(<TableEmpty icon={<span data-testid="empty-icon">📭</span>} />);
    expect(screen.getByTestId("empty-icon")).toBeInTheDocument();
  });
});

/* ── SortableTable ──────────────────────────── */

type Row = { name: string; age: number };

const columns: ColumnDef<Row>[] = [
  { key: "name", header: "Name", cell: (r) => r.name },
  { key: "age", header: "Age", cell: (r) => r.age },
];

const data: Row[] = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
  { name: "Charlie", age: 35 },
];

describe("SortableTable", () => {
  it("renders column headers and data rows", () => {
    render(<SortableTable columns={columns} data={data} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("sorts on column header click", async () => {
    const user = userEvent.setup();
    const { container } = render(<SortableTable columns={columns} data={data} />);
    // Click "Name" to sort ascending
    await user.click(screen.getByText("Name"));
    const cells = container.querySelectorAll("tbody td:first-child");
    expect(cells[0]).toHaveTextContent("Alice");
    expect(cells[1]).toHaveTextContent("Bob");
    expect(cells[2]).toHaveTextContent("Charlie");
  });

  it("shows empty state when data is empty", () => {
    render(<SortableTable columns={columns} data={[]} />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("renders rowActions column", () => {
    render(
      <SortableTable
        columns={columns}
        data={data}
        rowActions={(row) => <button>Edit {row.name}</button>}
      />,
    );
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("Edit Alice")).toBeInTheDocument();
  });

  it("calls onSortChange in controlled mode", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<SortableTable columns={columns} data={data} sort={null} onSortChange={onSortChange} />);
    await user.click(screen.getByText("Name"));
    expect(onSortChange).toHaveBeenCalledWith({ column: "name", direction: "asc" });
  });
});

/* ── DataTable ──────────────────────────────── */

describe("DataTable", () => {
  it("renders data rows", () => {
    render(<DataTable columns={columns} data={data} rowKey={(r) => r.name} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("supports single row selection", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        rowKey={(r) => r.name}
        selectionMode="single"
        onSelectionChange={onSelectionChange}
      />,
    );
    // Click on a row
    await user.click(screen.getByText("Alice"));
    expect(onSelectionChange).toHaveBeenCalledWith(["Alice"]);
  });

  it("shows toolbar with add/delete buttons", () => {
    const onAdd = vi.fn();
    const onDelete = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        rowKey={(r) => r.name}
        toolbar
        onAdd={onAdd}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByText("Add")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("shows empty state when data is empty", () => {
    render(<DataTable columns={columns} data={[]} rowKey={(_, i) => i} />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("renders rowActions", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        rowKey={(r) => r.name}
        rowActions={(row) => <button>Delete {row.name}</button>}
      />,
    );
    expect(screen.getByText("Delete Alice")).toBeInTheDocument();
  });
});
