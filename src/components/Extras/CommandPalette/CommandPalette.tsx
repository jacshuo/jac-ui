import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, Command } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useCommandPalette } from "./CommandPalette.logic";
import type { CommandPaletteProps } from "./types";
import "./CommandPalette.css";

export function CommandPalette({
  open,
  onOpenChange,
  commands,
  placeholder = "Type a command or search…",
  hotkey = true,
  maxItems = 8,
  className,
}: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { query, setQuery, groups, filtered, activeIndex, setActiveIndex, handleKeyDown } =
    useCommandPalette(commands, open, onOpenChange, hotkey);

  // Focus the search input when the palette opens
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Keep the active result scrolled into view
  useEffect(() => {
    const active = listRef.current?.querySelector<HTMLElement>("[data-active='true']");
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  // Running flat index across groups for activeIndex matching
  let flatIdx = 0;

  return createPortal(
    // Backdrop — click to dismiss
    <div
      className="cmd-backdrop fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={() => onOpenChange(false)}
      role="presentation"
    >
      {/* Panel */}
      <div
        className={cn(
          "cmd-panel relative flex w-full max-w-lg flex-col overflow-hidden rounded-xl",
          "border border-primary-200 bg-white shadow-2xl",
          "dark:border-primary-700 dark:bg-primary-900",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-label="Command palette"
        aria-modal="true"
      >
        {/* ── Search row ─────────────────────────────────── */}
        <div className="flex items-center gap-3 border-b border-primary-100 px-4 dark:border-primary-700">
          <Search className="h-4 w-4 shrink-0 text-secondary-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent py-3.5 text-sm text-primary-900 outline-none placeholder:text-secondary-400 dark:text-primary-50"
            aria-label="Search commands"
            aria-controls="cmd-results"
            aria-autocomplete="list"
            aria-activedescendant={
              filtered[activeIndex] ? `cmd-item-${filtered[activeIndex].id}` : undefined
            }
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className="hidden shrink-0 rounded border border-primary-200 px-1.5 py-0.5 text-xs text-secondary-400 dark:border-primary-600 sm:block">
            esc
          </kbd>
        </div>

        {/* ── Results list ───────────────────────────────── */}
        <div
          id="cmd-results"
          ref={listRef}
          className="overflow-y-auto py-2"
          style={{ maxHeight: `${maxItems * 2.75}rem` }}
          role="listbox"
          aria-label="Commands"
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-sm text-secondary-400">
              <Command className="h-8 w-8 opacity-30" />
              <span>No commands found</span>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.label || "_default"} className="mb-1 last:mb-0">
                {group.label && (
                  <p className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-secondary-400 dark:text-secondary-500">
                    {group.label}
                  </p>
                )}
                {group.items.map((item) => {
                  const itemIdx = flatIdx++;
                  const isActive = itemIdx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      id={`cmd-item-${item.id}`}
                      data-active={isActive}
                      role="option"
                      aria-selected={isActive}
                      className={cn(
                        "cmd-item group flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm",
                        isActive
                          ? "bg-primary-100 text-primary-900 dark:bg-primary-800 dark:text-primary-50"
                          : "text-primary-700 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-800/50",
                      )}
                      onMouseEnter={() => setActiveIndex(itemIdx)}
                      onClick={() => {
                        item.onSelect();
                        onOpenChange(false);
                      }}
                    >
                      {/* Icon bubble */}
                      {item.icon && (
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs",
                            isActive
                              ? "border-primary-300 bg-white text-primary-700 dark:border-primary-600 dark:bg-primary-700 dark:text-primary-200"
                              : "border-primary-200 bg-primary-50 text-primary-500 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-400",
                          )}
                        >
                          {item.icon}
                        </span>
                      )}

                      {/* Label + description */}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{item.label}</span>
                        {item.description && (
                          <span className="block truncate text-xs text-secondary-400 dark:text-secondary-500">
                            {item.description}
                          </span>
                        )}
                      </span>

                      {/* Keyboard shortcut badge */}
                      {item.shortcut && (
                        <span className="flex shrink-0 items-center gap-0.5">
                          {item.shortcut.map((k, i) => (
                            <kbd
                              key={i}
                              className="rounded border border-primary-200 px-1.5 py-0.5 text-xs text-secondary-500 dark:border-primary-700 dark:text-secondary-400"
                            >
                              {k}
                            </kbd>
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* ── Footer hint bar ────────────────────────────── */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-primary-100 px-4 py-2 dark:border-primary-700">
            <span className="text-xs text-secondary-400">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-3 text-xs text-secondary-400">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-primary-200 px-1 dark:border-primary-700">
                  ↑
                </kbd>
                <kbd className="rounded border border-primary-200 px-1 dark:border-primary-700">
                  ↓
                </kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-primary-200 px-1 dark:border-primary-700">
                  ↵
                </kbd>
                Select
              </span>
            </span>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
