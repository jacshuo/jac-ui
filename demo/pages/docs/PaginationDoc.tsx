import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const paginationProps: PropRow[] = [
  { prop: "totalPages", type: "number", required: true, description: "Total number of pages" },
  { prop: "currentPage", type: "number", required: true, description: "Active page (1-indexed)" },
  {
    prop: "onPageChange",
    type: "(page: number) => void",
    required: true,
    description: "Callback fired when the user selects a page",
  },
  {
    prop: "siblingCount",
    type: "number",
    default: "1",
    description: "Number of page buttons shown on each side of the current page",
  },
  {
    prop: "showFirstLast",
    type: "boolean",
    default: "true",
    description: "Show First / Last jump buttons",
  },
  {
    prop: "showPageCount",
    type: "boolean",
    default: "false",
    description: 'Show "Page X of Y" label',
  },
  {
    prop: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: "Button size",
  },
  { prop: "className", type: "string", description: "Extra CSS classes" },
];

const usageCode = `import { useState } from "react";
import { Pagination } from "@jacshuo/onyx";

export function Example() {
  const [page, setPage] = useState(1);

  return (
    <Pagination
      totalPages={10}
      currentPage={page}
      onPageChange={setPage}
      showFirstLast
      showPageCount
    />
  );
}`;

const sizesCode = `import { Pagination } from "@jacshuo/onyx";

export function Sizes() {
  return (
    <div className="flex flex-col gap-4">
      <Pagination totalPages={5} currentPage={3} onPageChange={() => {}} size="sm" />
      <Pagination totalPages={5} currentPage={3} onPageChange={() => {}} size="md" />
      <Pagination totalPages={5} currentPage={3} onPageChange={() => {}} size="lg" />
    </div>
  );
}`;

const typesCode = `export type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  showPageCount?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};`;

export default function PaginationDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>Pagination</PageTitle>

      <Section title="Import">
        <CodeExample code={`import { Pagination, type PaginationProps } from "@jacshuo/onyx";`} />
      </Section>

      <Section title="Props">
        <PropTable rows={paginationProps} title="Pagination" />
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Sizes">
        <CodeExample code={sizesCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>
    </div>
  );
}
