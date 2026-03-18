import { useState } from "react";
import { Tree, TreeItem, Button } from "../../src";
import { Section, PageTitle } from "./helpers";
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  File,
  Pencil,
  Trash2,
  FilePlus,
} from "lucide-react";

const allNodeKeys = new Set(["src", "components", "styles", "demo"]);

const actionBtnClass =
  "rounded p-0.5 text-primary-400 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors";

export default function TreePage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(allNodeKeys));

  return (
    <div className="space-y-8">
      <PageTitle>Tree</PageTitle>

      <Section title="File browser">
        <Tree>
          <TreeItem
            label="src"
            icon={<FolderOpen className="h-4 w-4 text-yellow-500" />}
            defaultExpanded
          >
            <TreeItem
              label="components"
              icon={<FolderOpen className="h-4 w-4 text-yellow-500" />}
              defaultExpanded
            >
              <TreeItem label="Button.tsx" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
              <TreeItem label="Card.tsx" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
              <TreeItem label="Dialog.tsx" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
            </TreeItem>
            <TreeItem label="styles" icon={<Folder className="h-4 w-4 text-yellow-500" />}>
              <TreeItem label="theme.css" icon={<FileText className="h-4 w-4 text-purple-500" />} />
              <TreeItem label="theme.ts" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
            </TreeItem>
            <TreeItem label="index.ts" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
          </TreeItem>
          <TreeItem label="demo" icon={<Folder className="h-4 w-4 text-yellow-500" />}>
            <TreeItem label="App.tsx" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
            <TreeItem label="main.tsx" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
          </TreeItem>
          <TreeItem label="package.json" icon={<File className="h-4 w-4 text-green-500" />} />
          <TreeItem label="README.md" icon={<FileText className="h-4 w-4 text-primary-400" />} />
        </Tree>
      </Section>

      <Section title="Programmatic expand / collapse">
        <div className="mb-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setExpanded(new Set(allNodeKeys))}>
            Expand All
          </Button>
          <Button size="sm" onClick={() => setExpanded(new Set())}>
            Collapse All
          </Button>
          {[...allNodeKeys].map((key) => (
            <Button
              key={key}
              size="sm"
              intent={expanded.has(key) ? "primary" : "outline"}
              onClick={() => {
                const next = new Set(expanded);
                if (next.has(key)) next.delete(key);
                else next.add(key);
                setExpanded(next);
              }}
            >
              {expanded.has(key) ? `Collapse "${key}"` : `Expand "${key}"`}
            </Button>
          ))}
        </div>
        <Tree expandedKeys={expanded} onExpandedKeysChange={setExpanded}>
          <TreeItem
            nodeKey="src"
            label="src"
            icon={<FolderOpen className="h-4 w-4 text-yellow-500" />}
          >
            <TreeItem
              nodeKey="components"
              label="components"
              icon={<FolderOpen className="h-4 w-4 text-yellow-500" />}
            >
              <TreeItem label="Button.tsx" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
              <TreeItem label="Card.tsx" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
              <TreeItem label="Dialog.tsx" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
            </TreeItem>
            <TreeItem
              nodeKey="styles"
              label="styles"
              icon={<Folder className="h-4 w-4 text-yellow-500" />}
            >
              <TreeItem label="theme.css" icon={<FileText className="h-4 w-4 text-purple-500" />} />
              <TreeItem label="theme.ts" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
            </TreeItem>
            <TreeItem label="index.ts" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
          </TreeItem>
          <TreeItem
            nodeKey="demo"
            label="demo"
            icon={<Folder className="h-4 w-4 text-yellow-500" />}
          >
            <TreeItem label="App.tsx" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
            <TreeItem label="main.tsx" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
          </TreeItem>
          <TreeItem label="package.json" icon={<File className="h-4 w-4 text-green-500" />} />
          <TreeItem label="README.md" icon={<FileText className="h-4 w-4 text-primary-400" />} />
        </Tree>
      </Section>

      <Section title="Without indent lines">
        <Tree showLines={false}>
          <TreeItem
            label="src"
            icon={<FolderOpen className="h-4 w-4 text-yellow-500" />}
            defaultExpanded
          >
            <TreeItem
              label="components"
              icon={<FolderOpen className="h-4 w-4 text-yellow-500" />}
              defaultExpanded
            >
              <TreeItem label="Button.tsx" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
              <TreeItem label="Card.tsx" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
              <TreeItem label="Dialog.tsx" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
            </TreeItem>
            <TreeItem label="styles" icon={<Folder className="h-4 w-4 text-yellow-500" />}>
              <TreeItem label="theme.css" icon={<FileText className="h-4 w-4 text-purple-500" />} />
              <TreeItem label="theme.ts" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
            </TreeItem>
            <TreeItem label="index.ts" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
          </TreeItem>
        </Tree>
      </Section>

      <Section title="Without root nodes">
        <Tree showRoot={false}>
          <TreeItem
            label="project"
            icon={<FolderOpen className="h-4 w-4 text-yellow-500" />}
            defaultExpanded
          >
            <TreeItem
              label="components"
              icon={<FolderOpen className="h-4 w-4 text-yellow-500" />}
              defaultExpanded
            >
              <TreeItem label="Button.tsx" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
              <TreeItem label="Card.tsx" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
              <TreeItem label="Dialog.tsx" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
            </TreeItem>
            <TreeItem label="styles" icon={<Folder className="h-4 w-4 text-yellow-500" />}>
              <TreeItem label="theme.css" icon={<FileText className="h-4 w-4 text-purple-500" />} />
              <TreeItem label="theme.ts" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
            </TreeItem>
            <TreeItem label="index.ts" icon={<FileCode className="h-4 w-4 text-blue-500" />} />
          </TreeItem>
        </Tree>
      </Section>

      <Section title="Row actions (hover to reveal)">
        <Tree>
          <TreeItem
            label="src"
            icon={<FolderOpen className="h-4 w-4 text-yellow-500" />}
            defaultExpanded
            actions={
              <button
                type="button"
                className={actionBtnClass}
                onClick={() => alert("Add file to src/")}
                aria-label="Add file"
              >
                <FilePlus className="h-3.5 w-3.5" />
              </button>
            }
          >
            <TreeItem
              label="components"
              icon={<FolderOpen className="h-4 w-4 text-yellow-500" />}
              defaultExpanded
              actions={
                <button
                  type="button"
                  className={actionBtnClass}
                  onClick={() => alert("Add file to components/")}
                  aria-label="Add file"
                >
                  <FilePlus className="h-3.5 w-3.5" />
                </button>
              }
            >
              <TreeItem
                label="Button.tsx"
                icon={<FileCode className="h-4 w-4 text-blue-500" />}
                actions={
                  <>
                    <button
                      type="button"
                      className={actionBtnClass}
                      onClick={() => alert("Edit Button.tsx")}
                      aria-label="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className={actionBtnClass}
                      onClick={() => alert("Delete Button.tsx")}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                }
              />
              <TreeItem
                label="Card.tsx"
                icon={<FileCode className="h-4 w-4 text-blue-500" />}
                actions={
                  <>
                    <button
                      type="button"
                      className={actionBtnClass}
                      onClick={() => alert("Edit Card.tsx")}
                      aria-label="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className={actionBtnClass}
                      onClick={() => alert("Delete Card.tsx")}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                }
              />
            </TreeItem>
            <TreeItem
              label="index.ts"
              icon={<FileCode className="h-4 w-4 text-blue-500" />}
              actions={
                <>
                  <button
                    type="button"
                    className={actionBtnClass}
                    onClick={() => alert("Edit index.ts")}
                    aria-label="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className={actionBtnClass}
                    onClick={() => alert("Delete index.ts")}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              }
            />
          </TreeItem>
        </Tree>
      </Section>
    </div>
  );
}
