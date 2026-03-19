import React, { useState } from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import { tooltipVariants } from "../../../styles/theme/overlay";

type TooltipPosition = "top" | "bottom" | "left" | "right";

const positionClasses: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

type TooltipProps = VariantProps<typeof tooltipVariants> & {
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  children: React.ReactNode;
  className?: string;
  /** Maximum width of the tooltip. Allows text to wrap. @default undefined (no wrap) */
  maxWidth?: string | number;
};

export function Tooltip({
  content,
  position = "top",
  intent,
  delay = 200,
  maxWidth,
  children,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>();

  const show = () => {
    const t = setTimeout(() => setVisible(true), delay);
    setTimer(t);
  };

  const hide = () => {
    clearTimeout(timer);
    setVisible(false);
  };

  return (
    <span className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible && (
        <span
          className={cn(
            tooltipVariants({ intent }),
            positionClasses[position],
            "pointer-events-none",
            maxWidth ? "whitespace-normal" : "whitespace-nowrap",
            className,
          )}
          style={maxWidth !== undefined ? { maxWidth } : undefined}
          role="tooltip"
        >
          {content}
        </span>
      )}
    </span>
  );
}
