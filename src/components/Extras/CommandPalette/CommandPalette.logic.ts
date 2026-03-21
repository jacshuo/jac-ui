import { useState, useEffect, useCallback, useMemo } from "react";
import type { CommandItem, CommandGroup } from "./types";

/* ── helpers ──────────────────────────────────────────── */

function normalize(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function matchesQuery(item: CommandItem, query: string): boolean {
  if (!query) return true;
  const q = normalize(query);
  return (
    normalize(item.label).includes(q) ||
    (item.description ? normalize(item.description).includes(q) : false) ||
    (item.keywords ? item.keywords.some((k) => normalize(k).includes(q)) : false)
  );
}

function groupItems(items: CommandItem[]): CommandGroup[] {
  const map = new Map<string, CommandItem[]>();
  for (const item of items) {
    const g = item.group ?? "";
    if (!map.has(g)) map.set(g, []);
    map.get(g)!.push(item);
  }
  return Array.from(map.entries()).map(([label, its]) => ({ label, items: its }));
}

/* ── hook ─────────────────────────────────────────────── */

export function useCommandPalette(
  commands: CommandItem[],
  open: boolean,
  onOpenChange: (v: boolean) => void,
  hotkey: boolean,
) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset state whenever the palette opens
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  // Filtered flat list (disabled items are excluded)
  const filtered = useMemo(
    () => commands.filter((c) => !c.disabled && matchesQuery(c, query)),
    [commands, query],
  );

  // Grouped view for rendering
  const groups = useMemo(() => groupItems(filtered), [filtered]);

  // Clamp active index when the result list shrinks
  useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  const selectActive = useCallback(() => {
    const item = filtered[activeIndex];
    if (item) {
      item.onSelect();
      onOpenChange(false);
    }
  }, [filtered, activeIndex, onOpenChange]);

  // Keyboard navigation handler — wired to the palette container's onKeyDown
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((i) => (i + 1) % Math.max(1, filtered.length));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex(
            (i) => (i - 1 + Math.max(1, filtered.length)) % Math.max(1, filtered.length),
          );
          break;
        case "Enter":
          e.preventDefault();
          selectActive();
          break;
        case "Escape":
          e.preventDefault();
          onOpenChange(false);
          break;
      }
    },
    [filtered.length, selectActive, onOpenChange],
  );

  // Global hotkey: Ctrl/Cmd+K
  useEffect(() => {
    if (!hotkey) return;
    function listener(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [hotkey, open, onOpenChange]);

  return { query, setQuery, groups, filtered, activeIndex, setActiveIndex, handleKeyDown };
}
