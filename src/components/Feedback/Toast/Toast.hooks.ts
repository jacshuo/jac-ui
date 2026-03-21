import { useContext } from "react";
import { ToastContext } from "./Toast";
import type { ToastContextValue } from "./types";

/**
 * useToast — hook for triggering toasts from anywhere inside a <ToastProvider>.
 * Throws if called outside of a ToastProvider.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}
