import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";

/* ── Types ───────────────────────────────────────────── */

export type MasonryItemData = {
  key?: React.Key;
  /** The visual content rendered inside the item. */
  content: React.ReactNode;
  /** Optional title shown in the hover overlay. */
  title?: string;
  /** Optional description shown in the hover overlay. */
  description?: string;
  /** Optional action buttons shown in the hover overlay. */
  actions?: React.ReactNode;
};

export type MasonryProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> & {
  /** Fixed number of columns. Overrides `columnWidth` when set. */
  columns?: number;
  /** Minimum column width in pixels. The actual column count is auto-calculated from the container width. @default 240 */
  columnWidth?: number;
  /** Gap between items in pixels (horizontal and vertical). @default 16 */
  gap?: number;
  /** Structured item list with overlay metadata. When provided, `children` is ignored. */
  items?: MasonryItemData[];
  /** Called when an item is clicked. Receives the item data (or undefined for plain children) and the index. */
  onItemClick?: (item: MasonryItemData | undefined, index: number) => void;
};

/* ── Ripple helper ───────────────────────────────────── */

function spawnRipple(e: React.MouseEvent, container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.2;
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const ripple = document.createElement("span");
  ripple.className = "masonry-ripple";
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  container.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
}

/* ── Component ───────────────────────────────────────── */

/**
 * Pinterest-style waterfall / masonry layout with rich interactions.
 *
 * Items are measured and placed into the shortest column, producing
 * an even distribution regardless of varying item heights.
 * Fully responsive — column count adapts to parent width.
 *
 * Each item supports:
 * - Hover: cursor pointer, enlarge + elevated shadow + glass-reflection sweep
 * - Overlay: title / description / action buttons on hover
 * - Click: ripple flash effect + `onItemClick` callback
 */
export function Masonry({
  columns: fixedColumns,
  columnWidth = 240,
  gap = 16,
  items,
  onItemClick,
  className,
  style,
  children,
  ...props
}: MasonryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [cols, setCols] = useState(() => fixedColumns ?? 1);
  const [positions, setPositions] = useState<{ top: number; left: number; width: number }[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);

  // Resolve renderable items
  const childArray = items
    ? items.map((it, i) => ({ key: it.key ?? i, node: it.content }))
    : React.Children.toArray(children).map((c, i) => ({
        key: (c as React.ReactElement).key ?? i,
        node: c,
      }));

  const count = childArray.length;

  /* ── Calculate column count from container width ──────── */
  const calcColumns = useCallback(
    (width: number) => {
      if (fixedColumns != null) return fixedColumns;
      return Math.max(1, Math.floor((width + gap) / (columnWidth + gap)));
    },
    [fixedColumns, columnWidth, gap],
  );

  /* ── Lay out items into shortest column ──────────────── */
  const layout = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const numCols = calcColumns(containerWidth);
    setCols(numCols);

    const colWidth = (containerWidth - (numCols - 1) * gap) / numCols;
    const colHeights = new Array(numCols).fill(0);
    const nextPositions: { top: number; left: number; width: number }[] = [];

    for (let i = 0; i < count; i++) {
      const el = itemsRef.current[i];
      const itemHeight = el ? el.offsetHeight : 0;

      let minCol = 0;
      for (let c = 1; c < numCols; c++) {
        if (colHeights[c] < colHeights[minCol]) minCol = c;
      }

      nextPositions.push({
        top: colHeights[minCol],
        left: minCol * (colWidth + gap),
        width: colWidth,
      });

      colHeights[minCol] += itemHeight + gap;
    }

    const maxH = Math.max(0, ...colHeights) - (count ? gap : 0);
    setPositions(nextPositions);
    setContainerHeight(maxH);
  }, [count, calcColumns, gap]);

  /* ── Observe container resize ────────────────────────── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => layout());
    ro.observe(el);
    return () => ro.disconnect();
  }, [layout]);

  /* ── Re-layout when children change ──────────────────── */
  useEffect(() => {
    const id = requestAnimationFrame(layout);
    return () => cancelAnimationFrame(id);
  }, [layout]);

  /* ── Observe individual item resizes (e.g. lazy images) ── */
  useEffect(() => {
    const ro = new ResizeObserver(() => layout());
    itemsRef.current.forEach((el) => {
      if (el) ro.observe(el);
    });
    return () => ro.disconnect();
  }, [count, cols, layout]);

  /* ── Click handler with ripple ───────────────────────── */
  const handleItemClick = useCallback(
    (e: React.MouseEvent, index: number) => {
      const wrapper = e.currentTarget as HTMLElement;
      spawnRipple(e, wrapper);
      onItemClick?.(items?.[index], index);
    },
    [onItemClick, items],
  );

  /* ── Has overlay? ────────────────────────────────────── */
  const hasOverlay = (i: number) => {
    if (!items) return false;
    const it = items[i];
    return !!(it.title || it.description || it.actions);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ ...style, height: containerHeight }}
      {...props}
    >
      {childArray.map((child, i) => (
        <div
          key={child.key}
          ref={(el) => {
            itemsRef.current[i] = el;
          }}
          className="masonry-item"
          role="button"
          tabIndex={0}
          onClick={(e) => handleItemClick(e, i)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onItemClick?.(items?.[i], i);
            }
          }}
          style={{
            position: "absolute",
            top: positions[i]?.top ?? 0,
            left: positions[i]?.left ?? 0,
            width: positions[i]?.width ?? "100%",
          }}
        >
          {child.node}

          {/* Overlay: title / description / actions */}
          {hasOverlay(i) && (
            <div className="masonry-item-overlay">
              {items![i].title && <p className="masonry-item-overlay-title">{items![i].title}</p>}
              {items![i].description && (
                <p className="masonry-item-overlay-desc">{items![i].description}</p>
              )}
              {items![i].actions && (
                <div className="masonry-item-overlay-actions">{items![i].actions}</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
