import React, { useState, useCallback, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, ChevronsLeft, Menu } from 'lucide-react';
import { cn } from '../lib/utils';

/* ── Types ─────────────────────────────────────────────── */

export type SideNavCollapseMode = 'expanded' | 'icons' | 'mini';

export interface SideNavItem {
  /** Unique key (falls back to `path` or `label`). */
  key?: string;
  /** Display label. */
  label: string;
  /** Route path — renders a link when provided. */
  path?: string;
  /** Nested children — renders a collapsible group. */
  children?: SideNavItem[];
  /** Icon element shown before the label. */
  icon?: React.ReactNode;
  /** Whether the group is expanded by default (only for items with children). */
  defaultOpen?: boolean;
}

/**
 * Props for a custom link component.
 * When using react-router, pass NavLink. When using plain HTML, an `<a>` wrapper.
 */
export type SideNavLinkComponentProps = {
  to: string;
  className: string | ((props: { isActive: boolean }) => string);
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export interface SideNavProps extends React.HTMLAttributes<HTMLElement> {
  /** Navigation items (supports nesting). */
  items: SideNavItem[];
  /** Section title rendered above the items. */
  title?: string;
  /** Base path prefix prepended to every item `path`. Defaults to `"/"`. */
  basePath?: string;
  /** When provided, renders buttons instead of links and calls this on click. */
  onItemClick?: (item: SideNavItem, fullPath: string) => void;
  /**
   * Custom link component (e.g. react-router's NavLink).
   * Falls back to a plain `<a>` tag if not provided.
   */
  LinkComponent?: React.ComponentType<SideNavLinkComponentProps>;
  /** Show collapse / expand toggle. */
  collapsible?: boolean;
  /** Controlled collapse mode. */
  collapseMode?: SideNavCollapseMode;
  /** Default collapse mode (uncontrolled). @default 'expanded' */
  defaultCollapseMode?: SideNavCollapseMode;
  /** Fires when collapse mode changes. */
  onCollapseModeChange?: (mode: SideNavCollapseMode) => void;
  /** Show indentation guide lines for nested items. @default true */
  showLines?: boolean;
  /**
   * Controlled set of expanded group keys.
   * Each key is `item.key ?? item.label`.
   */
  expandedKeys?: Set<string>;
  /** Default expanded keys (uncontrolled). When omitted all groups start open. */
  defaultExpandedKeys?: Set<string> | 'all';
  /** Fires when a group is toggled. */
  onExpandedKeysChange?: (keys: Set<string>) => void;
}

/* ── Styles ────────────────────────────────────────────── */

const itemBase =
  'flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors cursor-pointer';

const itemActive =
  'bg-primary-200 dark:bg-primary-700/50 text-primary-900 dark:text-primary-100 font-medium';

const itemInactive =
  'text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800/50 hover:text-primary-900 dark:hover:text-primary-200';

const iconBtnCls =
  'flex items-center justify-center rounded-md p-2 transition-colors cursor-pointer text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800/50 hover:text-primary-900 dark:hover:text-primary-200';

/* ── Default link renderer (plain <a>) ─────────────────── */

function DefaultLink({ to, className, style, children }: SideNavLinkComponentProps) {
  const cls = typeof className === 'function' ? className({ isActive: false }) : className;
  return (
    <a href={to} className={cls} style={style}>
      {children}
    </a>
  );
}

/* ── Collapse‑mode cycling ─────────────────────────────── */

const modeOrder: SideNavCollapseMode[] = ['expanded', 'icons', 'mini'];

function nextCollapseMode(current: SideNavCollapseMode): SideNavCollapseMode {
  const i = modeOrder.indexOf(current);
  return modeOrder[(i + 1) % modeOrder.length];
}

/* ── Helpers: collect all group keys ───────────────────── */

function collectGroupKeys(items: SideNavItem[]): Set<string> {
  const keys = new Set<string>();
  for (const item of items) {
    if (item.children && item.children.length > 0) {
      keys.add(item.key ?? item.label);
      for (const k of collectGroupKeys(item.children)) keys.add(k);
    }
  }
  return keys;
}

/* ── Expanded mode: recursive item ─────────────────────── */

function ExpandedItemNode({
  item,
  basePath,
  depth,
  onItemClick,
  LinkComponent,
  showLines,
  expandedKeys,
  onToggle,
}: {
  item: SideNavItem;
  basePath: string;
  depth: number;
  onItemClick?: (item: SideNavItem, fullPath: string) => void;
  LinkComponent: React.ComponentType<SideNavLinkComponentProps>;
  showLines: boolean;
  expandedKeys: Set<string> | null;
  onToggle: (key: string) => void;
}) {
  const itemKey = item.key ?? item.label;
  const hasChildren = item.children && item.children.length > 0;

  // When expandedKeys is provided use controlled state, else internal
  const [internalOpen, setInternalOpen] = useState(item.defaultOpen ?? true);
  const open = expandedKeys ? expandedKeys.has(itemKey) : internalOpen;

  const toggle = useCallback(() => {
    if (expandedKeys) {
      onToggle(itemKey);
    } else {
      setInternalOpen((prev) => !prev);
    }
  }, [expandedKeys, onToggle, itemKey]);

  const paddingLeft = depth > 0 ? `${depth * 1.25}rem` : undefined;

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={toggle}
          className={cn(itemBase, itemInactive, 'justify-between')}
          style={{ paddingLeft }}
        >
          <span className="flex items-center gap-2">
            {item.icon}
            {item.label}
          </span>
          <ChevronRight className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-90')} />
        </button>
        {open && (
          <div
            className={cn(
              'flex flex-col gap-0.5 pt-0.5',
              showLines
                ? 'ml-2.5 border-l border-primary-200 dark:border-primary-700'
                : 'ml-2',
            )}
          >
            {item.children!.map((child) => (
              <ExpandedItemNode
                key={child.key ?? child.path ?? child.label}
                item={child}
                basePath={basePath}
                depth={depth + 1}
                onItemClick={onItemClick}
                LinkComponent={LinkComponent}
                showLines={showLines}
                expandedKeys={expandedKeys}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.path != null) {
    const to = basePath + item.path;

    if (onItemClick) {
      return (
        <button
          type="button"
          onClick={() => onItemClick(item, to)}
          className={cn(itemBase, itemInactive)}
          style={{ paddingLeft }}
        >
          {item.icon}
          {item.label}
        </button>
      );
    }

    return (
      <LinkComponent
        to={to}
        className={({ isActive }: { isActive: boolean }) =>
          cn(itemBase, isActive ? itemActive : itemInactive)
        }
        style={{ paddingLeft }}
      >
        {item.icon}
        {item.label}
      </LinkComponent>
    );
  }

  return (
    <span className={cn(itemBase, itemInactive, 'cursor-default')} style={{ paddingLeft }}>
      {item.icon}
      {item.label}
    </span>
  );
}

/* ── Icons mode: group flyout (portal) ─────────────────── */

function IconGroupFlyout({
  item,
  basePath,
  onItemClick,
  LinkComponent,
}: {
  item: SideNavItem;
  basePath: string;
  onItemClick?: (item: SideNavItem, fullPath: string) => void;
  LinkComponent: React.ComponentType<SideNavLinkComponentProps>;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const enter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const leave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  useLayoutEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.top, left: rect.right + 4 });
    }
  }, [open]);

  const iconContent = item.icon || (
    <span className="text-xs font-bold leading-none">
      {item.label.charAt(0).toUpperCase()}
    </span>
  );

  return (
    <div onMouseEnter={enter} onMouseLeave={leave}>
      <button
        ref={btnRef}
        type="button"
        className={cn(iconBtnCls, 'w-full')}
        title={item.label}
        onClick={() => setOpen((o) => !o)}
      >
        {iconContent}
      </button>
      {open &&
        createPortal(
          <div
            className="fixed z-50 min-w-44 rounded-md border border-primary-200 bg-white p-1 shadow-lg dark:border-primary-700 dark:bg-primary-900"
            style={{ top: pos.top, left: pos.left }}
            onMouseEnter={enter}
            onMouseLeave={leave}
          >
            <div className="px-2.5 py-1.5 text-xs font-semibold uppercase text-primary-500 dark:text-primary-400">
              {item.label}
            </div>
            <div className="flex flex-col gap-0.5">
              {item.children?.map((child) => {
                const childKey = child.key ?? child.path ?? child.label;
                if (child.path != null) {
                  const to = basePath + child.path;
                  if (onItemClick) {
                    return (
                      <button
                        key={childKey}
                        type="button"
                        onClick={() => {
                          onItemClick(child, to);
                          setOpen(false);
                        }}
                        className={cn(itemBase, itemInactive)}
                      >
                        {child.icon}
                        {child.label}
                      </button>
                    );
                  }
                  return (
                    <LinkComponent
                      key={childKey}
                      to={to}
                      className={({ isActive }: { isActive: boolean }) =>
                        cn(itemBase, isActive ? itemActive : itemInactive)
                      }
                    >
                      {child.icon}
                      {child.label}
                    </LinkComponent>
                  );
                }
                return (
                  <span
                    key={childKey}
                    className={cn(itemBase, 'cursor-default text-primary-400')}
                  >
                    {child.icon}
                    {child.label}
                  </span>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

/* ── Icons mode: leaf item ─────────────────────────────── */

function IconLeafItem({
  item,
  basePath,
  onItemClick,
  LinkComponent,
}: {
  item: SideNavItem;
  basePath: string;
  onItemClick?: (item: SideNavItem, fullPath: string) => void;
  LinkComponent: React.ComponentType<SideNavLinkComponentProps>;
}) {
  const iconContent = item.icon || (
    <span className="text-xs font-bold leading-none">
      {item.label.charAt(0).toUpperCase()}
    </span>
  );

  if (item.path != null) {
    const to = basePath + item.path;
    if (onItemClick) {
      return (
        <button
          type="button"
          onClick={() => onItemClick(item, to)}
          className={cn(iconBtnCls, 'w-full')}
          title={item.label}
        >
          {iconContent}
        </button>
      );
    }
    return (
      <LinkComponent
        to={to}
        className={({ isActive }: { isActive: boolean }) =>
          cn(
            iconBtnCls,
            'w-full',
            isActive &&
              'bg-primary-200 dark:bg-primary-700/50 text-primary-900 dark:text-primary-100',
          )
        }
      >
        <span title={item.label}>{iconContent}</span>
      </LinkComponent>
    );
  }

  return (
    <span className={cn(iconBtnCls, 'w-full cursor-default')} title={item.label}>
      {iconContent}
    </span>
  );
}

/* ── SideNav ───────────────────────────────────────────── */

export function SideNav({
  items,
  title,
  basePath = '/',
  onItemClick,
  LinkComponent = DefaultLink,
  collapsible,
  collapseMode: controlledMode,
  defaultCollapseMode = 'expanded',
  onCollapseModeChange,
  showLines = true,
  expandedKeys: controlledExpandedKeys,
  defaultExpandedKeys = 'all',
  onExpandedKeysChange,
  className,
  ...props
}: SideNavProps) {
  const [internalMode, setInternalMode] = useState(defaultCollapseMode);
  const mode = controlledMode ?? internalMode;

  // Expanded-keys state
  const allKeys = React.useMemo(() => collectGroupKeys(items), [items]);
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<Set<string>>(() =>
    defaultExpandedKeys === 'all' ? new Set(allKeys) : new Set(defaultExpandedKeys),
  );
  const expandedKeys = controlledExpandedKeys ?? null;
  const resolvedKeys = expandedKeys ?? internalExpandedKeys;

  const handleToggle = useCallback(
    (key: string) => {
      const next = new Set(resolvedKeys);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      setInternalExpandedKeys(next);
      onExpandedKeysChange?.(next);
    },
    [resolvedKeys, onExpandedKeysChange],
  );

  const cycleMode = useCallback(() => {
    const next = nextCollapseMode(mode);
    setInternalMode(next);
    onCollapseModeChange?.(next);
  }, [mode, onCollapseModeChange]);

  return (
    <nav
      className={cn(
        'flex flex-col gap-0.5',
        mode === 'mini' && 'items-center',
        className,
      )}
      {...props}
    >
      {/* ── Toggle button ──────────────────── */}
      {collapsible && (
        <div
          className={cn(
            'flex shrink-0 mb-1',
            mode === 'expanded' ? 'justify-end' : 'justify-center',
          )}
        >
          <button
            type="button"
            onClick={cycleMode}
            className={iconBtnCls}
            aria-label={mode === 'mini' ? 'Expand sidebar' : 'Collapse sidebar'}
            title={mode === 'mini' ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {mode === 'mini' ? (
              <Menu className="h-5 w-5" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      )}

      {/* ── Expanded mode ──────────────────── */}
      {mode === 'expanded' && (
        <>
          {title && (
            <h2 className="text-primary-500 dark:text-primary-400 mb-3 text-sm font-semibold uppercase">
              {title}
            </h2>
          )}
          {items.map((item) => (
            <ExpandedItemNode
              key={item.key ?? item.path ?? item.label}
              item={item}
              basePath={basePath}
              depth={0}
              onItemClick={onItemClick}
              LinkComponent={LinkComponent}
              showLines={showLines}
              expandedKeys={expandedKeys}
              onToggle={handleToggle}
            />
          ))}
        </>
      )}

      {/* ── Icons mode ─────────────────────── */}
      {mode === 'icons' &&
        items.map((item) => {
          const key = item.key ?? item.path ?? item.label;
          if (item.children && item.children.length > 0) {
            return (
              <IconGroupFlyout
                key={key}
                item={item}
                basePath={basePath}
                onItemClick={onItemClick}
                LinkComponent={LinkComponent}
              />
            );
          }
          return (
            <IconLeafItem
              key={key}
              item={item}
              basePath={basePath}
              onItemClick={onItemClick}
              LinkComponent={LinkComponent}
            />
          );
        })}

      {/* mini mode: only the toggle button above */}
    </nav>
  );
}
