import { useState } from "react";
import { Pagination } from "../../src";
import { Section, PageTitle, CodeExample, PropTable, type PropRow } from "./helpers";

const basicCode = `const [page, setPage] = useState(1);

<Pagination
  totalPages={10}
  currentPage={page}
  onPageChange={setPage}
/>`;

const sizesCode = `<Pagination totalPages={10} currentPage={3} onPageChange={() => {}} size="sm" />
<Pagination totalPages={10} currentPage={3} onPageChange={() => {}} size="md" />
<Pagination totalPages={10} currentPage={3} onPageChange={() => {}} size="lg" />`;

const countCode = `<Pagination
  totalPages={100}
  currentPage={50}
  onPageChange={() => {}}
  showPageCount
/>`;

const propRows: PropRow[] = [
  { prop: "totalPages", type: "number", required: true, description: "Total number of pages." },
  { prop: "currentPage", type: "number", required: true, description: "Active page (1-based)." },
  {
    prop: "onPageChange",
    type: "(page: number) => void",
    required: true,
    description: "Fired when a page button is clicked.",
  },
  {
    prop: "siblingCount",
    type: "number",
    default: "2",
    description: "Pages shown on each side of the current page.",
  },
  {
    prop: "showFirstLast",
    type: "boolean",
    default: "true",
    description: "Show << / >> first/last buttons.",
  },
  {
    prop: "showPageCount",
    type: "boolean",
    default: "false",
    description: 'Show "Page X of Y" label.',
  },
  { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Button size." },
  { prop: "className", type: "string", description: "Extra wrapper classes." },
];

export default function PaginationPage() {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(5);
  const [page3, setPage3] = useState(50);

  return (
    <div className="space-y-10 p-6">
      <PageTitle>Pagination</PageTitle>

      <Section title="Basic">
        <Pagination totalPages={10} currentPage={page1} onPageChange={setPage1} />
        <p className="text-xs text-primary-500">Current page: {page1}</p>
        <CodeExample code={basicCode} />
      </Section>

      <Section title="Sizes">
        <div className="space-y-3">
          {(["sm", "md", "lg"] as const).map((s) => (
            <div key={s} className="flex items-center gap-3">
              <span className="w-8 text-xs text-primary-500">{s}</span>
              <Pagination totalPages={10} currentPage={3} onPageChange={() => {}} size={s} />
            </div>
          ))}
        </div>
        <CodeExample code={sizesCode} />
      </Section>

      <Section title="Many pages with ellipsis">
        <Pagination totalPages={100} currentPage={page2} onPageChange={setPage2} />
        <p className="text-xs text-primary-500">Current page: {page2}</p>
      </Section>

      <Section title="With page count label">
        <Pagination totalPages={100} currentPage={page3} onPageChange={setPage3} showPageCount />
        <CodeExample code={countCode} />
      </Section>

      <Section title="Props">
        <PropTable rows={propRows} />
      </Section>
    </div>
  );
}
