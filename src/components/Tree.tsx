import React, { createContext, useCallback, useContext, useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

/* ── Context ───────────────────────────────────────────── */

type TreeCtx = {
  showLines: boolean;
  expandedKeys: Set<string> | null;
  onToggleKey: (key: string) => void;
};
const TreeContext = createContext<TreeCtx>({
  showLines: true,
  expandedKeys: null,
  onToggleKey: () => {},
});

/* ── Tree ──────────────────────────────────────────────── */

type TreeProps = React.HTMLAttributes<HTMLUListElement> & {
  /** Show indent guide lines between parent and children. @default true */
  showLines?: boolean;
  /** Render the root-level items. When false, only their children are shown. @default true */
  showRoot?: boolean;
  /**
   * Controlled set of expanded node keys.
   * Each key is `TreeItem.nodeKey` (falls back to label string).
   */
  expandedKeys?: Set<string>;
  /** Default expanded keys (uncontrolled). Pass `'all'` to expand everything. */
  defaultExpandedKeys?: Set<string> | "all";
  /** Fires when a node is toggled. */
  onExpandedKeysChange?: (keys: Set<string>) => void;
};

export function Tree({
  showLines = true,
  showRoot = true,
  expandedKeys: controlledKeys,
  defaultExpandedKeys = "all",
  onExpandedKeysChange,
  className,
  children,
  ...props
}: TreeProps) {
  const [internalKeys, setInternalKeys] = useState<Set<string> | "all">(() => defaultExpandedKeys);
  const _expandedKeys = controlledKeys ?? null;

  const onToggleKey = useCallback(
    (key: string) => {
      if (controlledKeys) {
        const next = new Set(controlledKeys);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        onExpandedKeysChange?.(next);
      } else {
        setInternalKeys((prev) => {
          // 'all' means everything open — toggling one means closing it
          if (prev === "all") {
            // Can't enumerate, so we can't build a full set. Store as special case.
            // We'll treat 'all' minus this key. Use a sentinel approach.
            return new Set(["__ALL_MINUS__", key]);
          }
          const next = new Set(prev);
          if (next.has(key)) next.delete(key);
          else next.add(key);
          return next;
        });
      }
    },
    [controlledKeys, onExpandedKeysChange],
  );

  // Resolve internal keys for context
  const resolvedKeys = controlledKeys ?? (internalKeys === "all" ? null : internalKeys);

  return (
    <TreeContext.Provider value={{ showLines, expandedKeys: resolvedKeys, onToggleKey }}>
      {showRoot ? (
        <ul className={cn("text-sm", className)} role="tree" {...props}>
          {children}
        </ul>
      ) : (
        <ul className={cn("text-sm", className)} role="tree" {...props}>
          <RootChildrenOnly>{children}</RootChildrenOnly>
        </ul>
      )}
    </TreeContext.Provider>
  );
}

/** When showRoot=false, render only the grandchildren of each top-level TreeItem. */
function RootChildrenOnly({ children }: { children: React.ReactNode }) {
  const flatChildren = flattenFragments(children);
  return (
    <>
      {flatChildren.map((child) => {
        if (React.isValidElement<TreeItemProps>(child) && child.props.children) {
          return child.props.children;
        }
        return null;
      })}
    </>
  );
}

/** Recursively unwrap React.Fragment wrappers to get the actual elements. */
function flattenFragments(children: React.ReactNode): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement<{ children?: React.ReactNode }>(child) &&
      child.type === React.Fragment
    ) {
      result.push(...flattenFragments(child.props.children));
    } else {
      result.push(child);
    }
  });
  return result;
}

/* ── TreeItem ──────────────────────────────────────────── */

type TreeItemProps = {
  /** Unique key for programmatic expand control. Falls back to label string. */
  nodeKey?: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** Action buttons shown on hover at the right side of the item row. */
  actions?: React.ReactNode;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  children?: React.ReactNode;
  className?: string;
};

export function TreeItem({
  nodeKey,
  label,
  icon,
  actions,
  defaultExpanded = false,
  expanded: controlledExpanded,
  onToggle,
  children,
  className,
}: TreeItemProps) {
  const { showLines, expandedKeys, onToggleKey } = useContext(TreeContext);
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const hasChildren = React.Children.count(children) > 0;

  // Resolve the key used for context-level control
  const resolvedKey = nodeKey ?? (typeof label === "string" ? label : "");

  // Priority: per-item controlled > context expandedKeys > internal state
  let expanded: boolean;
  if (controlledExpanded != null) {
    expanded = controlledExpanded;
  } else if (expandedKeys != null && resolvedKey) {
    // Check the __ALL_MINUS__ sentinel
    if (expandedKeys.has("__ALL_MINUS__")) {
      expanded = !expandedKeys.has(resolvedKey);
    } else {
      expanded = expandedKeys.has(resolvedKey);
    }
  } else {
    expanded = internalExpanded;
  }

  const toggle = () => {
    const next = !expanded;
    if (onToggle) {
      onToggle(next);
    } else if (expandedKeys != null && resolvedKey) {
      onToggleKey(resolvedKey);
    } else {
      setInternalExpanded(next);
    }
  };

  return (
    <li
      className={cn("select-none", className)}
      role="treeitem"
      aria-expanded={hasChildren ? expanded : undefined}
    >
      <div
        className={cn(
          "group hover:bg-primary-50 dark:hover:bg-primary-800/50 flex items-center gap-1 rounded-md px-1 py-1",
          hasChildren ? "cursor-pointer" : "cursor-default",
        )}
        onClick={hasChildren ? toggle : undefined}
      >
        {hasChildren ? (
          <ChevronRight
            className={cn(
              "text-primary-400 h-4 w-4 shrink-0 transition-transform duration-200",
              expanded && "rotate-90",
            )}
          />
        ) : (
          <span className="w-4 shrink-0" />
        )}
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="text-primary-700 dark:text-primary-300 min-w-0 flex-1 truncate">
          {label}
        </span>
        {actions && (
          <span
            className="ml-auto flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            {actions}
          </span>
        )}
      </div>
      {hasChildren && (
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-200 ease-out",
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <ul
              className={cn(
                "ml-4 pl-2",
                showLines && "border-primary-200 dark:border-primary-700 border-l",
              )}
              role="group"
            >
              {children}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}
