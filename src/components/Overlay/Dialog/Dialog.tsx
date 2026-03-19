import React, { createContext, useContext, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { dialogContentVariants } from "../../../styles/theme/overlay";

/* ── Dialog stack (supports nested / stacked dialogs) ───── */

const dialogStack: string[] = [];

function pushDialog(id: string) {
  dialogStack.push(id);
}
function popDialog(id: string) {
  const idx = dialogStack.indexOf(id);
  if (idx !== -1) dialogStack.splice(idx, 1);
}
function isTopDialog(id: string) {
  return dialogStack.length > 0 && dialogStack[dialogStack.length - 1] === id;
}
function getDialogDepth(id: string) {
  const idx = dialogStack.indexOf(id);
  // Before useEffect fires the id isn't on the stack yet; use the next slot
  return idx !== -1 ? idx : dialogStack.length;
}

/* ── Context ──────────────────────────────────────────────── */

type DialogCtx = {
  id: string;
  onOpenChange: (open: boolean) => void;
  modal: boolean;
  closeOnOutsideClick: boolean;
};
const DialogContext = createContext<DialogCtx | null>(null);

/* ── Dialog ───────────────────────────────────────────────── */

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modal?: boolean;
  /** When true, clicking outside the dialog closes it. @default false */
  closeOnOutsideClick?: boolean;
  children: React.ReactNode;
};

export function Dialog({
  open,
  onOpenChange,
  modal = true,
  closeOnOutsideClick = false,
  children,
}: DialogProps) {
  const id = useId();

  // Register / unregister on the stack
  useEffect(() => {
    if (!open) return;
    pushDialog(id);
    return () => popDialog(id);
  }, [open, id]);

  // Escape: only the topmost dialog handles it
  useEffect(() => {
    if (!open || !modal) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isTopDialog(id)) {
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, modal, onOpenChange, id]);

  // lock body scroll when modal is open
  useEffect(() => {
    if (!open || !modal) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open, modal]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ id, onOpenChange, modal, closeOnOutsideClick }}>
      {createPortal(children, document.body)}
    </DialogContext.Provider>
  );
}

/* ── DialogContent ────────────────────────────────────────── */

type DialogContentProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof dialogContentVariants> & {
    /** Where to render the dialog in the viewport. @default 'center' */
    position?: "center" | "bottom";
  };

export function DialogContent({
  size,
  position = "center",
  className,
  children,
  ...props
}: DialogContentProps) {
  const ctx = useContext(DialogContext);
  if (!ctx) return null;

  const depth = getDialogDepth(ctx.id);
  const zIndex = 200 + depth * 10;

  const handleBackdropClick = () => {
    if (ctx.closeOnOutsideClick && isTopDialog(ctx.id)) {
      ctx.onOpenChange(false);
    }
  };

  const isBottom = position === "bottom";

  if (ctx.modal) {
    return (
      <div
        className={cn(
          "animate-fade-in fixed inset-0 bg-black/50",
          isBottom ? "flex items-end justify-center" : "flex items-center justify-center p-4",
        )}
        style={{ zIndex }}
        onClick={handleBackdropClick}
      >
        <div
          className={cn(
            dialogContentVariants({ size }),
            isBottom
              ? "animate-slide-in-bottom w-full rounded-b-none rounded-t-(--dialog-sheet-radius) max-h-[85vh] overflow-y-auto"
              : "animate-scale-in",
            className,
          )}
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center p-4",
        ctx.closeOnOutsideClick ? "pointer-events-auto" : "pointer-events-none",
      )}
      style={{ zIndex }}
      onClick={
        ctx.closeOnOutsideClick && isTopDialog(ctx.id) ? () => ctx.onOpenChange(false) : undefined
      }
    >
      <div
        className={cn(
          dialogContentVariants({ size }),
          "animate-scale-in pointer-events-auto shadow-2xl",
          className,
        )}
        role="dialog"
        onClick={ctx.closeOnOutsideClick ? (e) => e.stopPropagation() : undefined}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

/* ── DialogHeader / Footer / Title / Description / Close ── */

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-primary-900 dark:text-primary-100 flex items-center gap-1.5 text-lg font-semibold [&_svg]:h-5 [&_svg]:w-5 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-primary-500 dark:text-primary-400 text-sm", className)} {...props} />
  );
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-6 flex justify-end gap-2", className)} {...props} />;
}

export function DialogClose({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = useContext(DialogContext);
  return (
    <button
      className={cn(
        "text-primary-400 hover:text-primary-600 dark:hover:text-primary-200 absolute top-4 right-4 rounded-md p-1 transition-colors",
        className,
      )}
      onClick={() => ctx?.onOpenChange(false)}
      aria-label="Close"
      {...props}
    >
      <X className="h-4 w-4" />
    </button>
  );
}
