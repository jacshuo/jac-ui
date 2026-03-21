import { useCallback, useEffect, useRef, useState } from "react";
import type { ToastItem, ToastOptions, ToastPosition } from "./types";

let _counter = 0;
const EXIT_MS = 320;

/**
 * useToastManager — internal hook that owns all toast state and timers.
 * Used exclusively by ToastProvider.
 */
export function useToastManager(defaultPosition: ToastPosition, defaultDuration: number) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const clearItemTimer = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const startExit = useCallback(
    (id: string) => {
      clearItemTimer(id);
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, _exiting: true } : item)));
      setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), EXIT_MS);
    },
    [clearItemTimer],
  );

  const dismiss = useCallback((id: string) => startExit(id), [startExit]);

  const dismissAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    setItems((prev) => prev.map((item) => ({ ...item, _exiting: true })));
    setTimeout(() => setItems([]), EXIT_MS);
  }, []);

  const toast = useCallback(
    (options: ToastOptions): string => {
      const id = `toast-${++_counter}`;
      const position = options.position ?? defaultPosition;
      const duration = options.duration !== undefined ? options.duration : defaultDuration;
      setItems((prev) => [...prev, { ...options, id, position, duration, _exiting: false }]);
      if (duration > 0) {
        const timer = setTimeout(() => {
          timers.current.delete(id);
          startExit(id);
        }, duration);
        timers.current.set(id, timer);
      }
      return id;
    },
    [defaultPosition, defaultDuration, startExit],
  );

  // Cleanup all active timers when the provider unmounts
  useEffect(() => {
    const t = timers.current;
    return () => {
      t.forEach(clearTimeout);
      t.clear();
    };
  }, []);

  return { items, toast, dismiss, dismissAll };
}
