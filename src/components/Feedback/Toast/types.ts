import type React from "react";

export type ToastVariant = "default" | "success" | "danger" | "warning" | "info";

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  /** Duration in milliseconds. Default: 4000. Pass 0 to persist indefinitely. */
  duration?: number;
  /** Show dismiss (×) button. Default: true. */
  dismissible?: boolean;
  action?: ToastAction;
  position?: ToastPosition;
  onDismiss?: (id: string) => void;
}

export type ToastOptions = Omit<ToastProps, "id">;

export interface ToastContextValue {
  /** Show a toast and return its generated id. */
  toast: (options: ToastOptions) => string;
  /** Dismiss a specific toast by id. */
  dismiss: (id: string) => void;
  /** Dismiss all currently visible toasts. */
  dismissAll: () => void;
}

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Default position for toasts. Each toast call can override this. */
  defaultPosition?: ToastPosition;
  /** Default auto-dismiss duration in ms. Each toast call can override. */
  defaultDuration?: number;
}

/** @internal Extended item type that tracks exit-animation state */
export interface ToastItem extends ToastProps {
  _exiting: boolean;
}
