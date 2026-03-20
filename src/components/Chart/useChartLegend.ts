import { useCallback, useState } from "react";

export function useChartLegend(initialIds: string[]): {
  visible: Set<string>;
  toggle: (id: string) => void;
  isVisible: (id: string) => boolean;
  showAll: () => void;
} {
  const [visible, setVisible] = useState<Set<string>>(() => new Set(initialIds));

  const toggle = useCallback((id: string) => {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isVisible = useCallback((id: string) => visible.has(id), [visible]);

  const showAll = useCallback(() => {
    setVisible(new Set(initialIds));
  }, [initialIds]);

  return { visible, toggle, isVisible, showAll };
}
