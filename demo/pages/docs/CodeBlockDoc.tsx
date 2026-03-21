import { PageTitle, Section, CodeExample, PropTable, type PropRow } from "../helpers";

const codeBlockProps: PropRow[] = [
  { prop: "code", type: "string", required: true, description: "Source code string to display" },
  {
    prop: "language",
    type: "CodeBlockLanguage",
    default: `"tsx"`,
    description: "Syntax highlighting language",
  },
  { prop: "lineNumbers", type: "boolean", default: "false", description: "Show line numbers" },
  { prop: "editable", type: "boolean", default: "false", description: "Enable inline editing" },
  {
    prop: "onCodeChange",
    type: "(code: string) => void",
    description: "Called when code is edited",
  },
  {
    prop: "size",
    type: `"sm" | "md" | "lg"`,
    default: `"md"`,
    description: "Font and padding size",
  },
  {
    prop: "theme",
    type: `"dark" | "light" | "system"`,
    default: `"system"`,
    description: "Syntax highlighting theme",
  },
  { prop: "filename", type: "string", description: "Filename shown in the header bar" },
  {
    prop: "collapsible",
    type: "boolean",
    default: "false",
    description: "Allow collapsing the code block",
  },
];

const languageValues = `"typescript" | "javascript" | "tsx" | "jsx" | "html" | "css" | "json" | "markdown" | "python" | "rust" | "go" | "java" | "c" | "cpp" | "csharp" | "vue" | "xml" | "yaml" | "sql" | "bash" | "shell"`;

const usageCode = `import { CodeBlock } from "@jacshuo/onyx";

const snippet = \`function greet(name: string) {
  return \\\`Hello, \${name}!\\\`;
}\`;

export function Example() {
  return (
    <CodeBlock
      code={snippet}
      language="typescript"
      filename="greet.ts"
      lineNumbers
      size="md"
    />
  );
}`;

const typesCode = `export type CodeBlockLanguage =
  | "typescript" | "javascript" | "tsx" | "jsx"
  | "html" | "css" | "json" | "markdown"
  | "python" | "rust" | "go" | "java"
  | "c" | "cpp" | "csharp" | "vue"
  | "xml" | "yaml" | "sql" | "bash" | "shell"
  | (string & {});

export type CodeBlockProps = React.HTMLAttributes<HTMLDivElement> & {
  code: string;
  language?: CodeBlockLanguage;
  lineNumbers?: boolean;
  editable?: boolean;
  onCodeChange?: (code: string) => void;
  size?: "sm" | "md" | "lg";
  theme?: "dark" | "light" | "system";
  filename?: string;
  collapsible?: boolean;
};`;

const tokenCode = `/* Override CodeBlock syntax highlight tokens in your CSS */
:root {
  --color-syntax-keyword:     var(--color-primary-600);
  --color-syntax-string:      var(--color-success-600);
  --color-syntax-comment:     var(--color-secondary-400);
  --color-syntax-function:    var(--color-warning-600);
  --color-syntax-variable:    var(--color-danger-600);
  --color-syntax-number:      var(--color-warning-500);
  --color-syntax-operator:    var(--color-secondary-600);
  --color-syntax-tag:         var(--color-danger-500);
  --color-syntax-attr:        var(--color-warning-600);
  --color-syntax-punctuation: var(--color-secondary-500);
  --color-syntax-type:        var(--color-success-700);
  --color-syntax-plain:       var(--color-primary-800);
  --color-syntax-bg:          var(--color-primary-50);
}

.dark {
  --color-syntax-keyword:     var(--color-primary-400);
  --color-syntax-string:      var(--color-success-400);
  --color-syntax-comment:     var(--color-secondary-500);
  --color-syntax-function:    var(--color-warning-400);
  --color-syntax-variable:    var(--color-danger-400);
  --color-syntax-number:      var(--color-warning-300);
  --color-syntax-operator:    var(--color-secondary-400);
  --color-syntax-tag:         var(--color-danger-400);
  --color-syntax-attr:        var(--color-warning-300);
  --color-syntax-punctuation: var(--color-secondary-400);
  --color-syntax-type:        var(--color-success-300);
  --color-syntax-plain:       var(--color-primary-200);
  --color-syntax-bg:          var(--color-primary-900);
}`;

export default function CodeBlockDoc() {
  return (
    <div className="space-y-8">
      <PageTitle>CodeBlock</PageTitle>

      <Section title="Import">
        <CodeExample
          code={`import { CodeBlock, type CodeBlockProps, type CodeBlockLanguage } from "@jacshuo/onyx";`}
        />
      </Section>

      <Section title="Props">
        <PropTable rows={codeBlockProps} />
      </Section>

      <Section title="CodeBlockLanguage">
        <p className="text-sm text-primary-600 dark:text-primary-400">
          The{" "}
          <code className="rounded bg-primary-100 px-1 font-mono text-xs dark:bg-primary-800">
            CodeBlockLanguage
          </code>{" "}
          union type supports:
        </p>
        <p className="mt-2 rounded-lg border border-primary-200 bg-primary-50 p-3 font-mono text-xs text-primary-700 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-300">
          {languageValues}
        </p>
      </Section>

      <Section title="Usage">
        <CodeExample code={usageCode} />
      </Section>

      <Section title="Type Reference">
        <CodeExample code={typesCode} />
      </Section>

      <Section title="CSS Token Overrides">
        <p className="mb-3 text-sm text-secondary-600 dark:text-secondary-400">
          All syntax highlight colors are exposed as CSS custom properties with separate light and
          dark mode values. Override any token in your global CSS to apply a custom color theme.
        </p>
        <CodeExample code={tokenCode} />
      </Section>
    </div>
  );
}
