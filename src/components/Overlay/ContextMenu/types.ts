import type React from "react";

export interface ContextMenuItem {
  /** Unique key */
  key: string;
  /** Display label */
  label: React.ReactNode;
  /** Icon element */
  icon?: React.ReactNode;
  /** Disables item */
  disabled?: boolean;
  /** Marks as separator — renders a divider instead of item */
  separator?: boolean;
  /** Keyboard shortcut displayed on the right */
  shortcut?: string;
  /** Destructive — renders in danger color */
  danger?: boolean;
  /** Sub-menu items */
  children?: ContextMenuItem[];
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
}

export interface ContextMenuProps {
  /** Menu structure */
  items: ContextMenuItem[];
  /** The trigger element(s) that activate the context menu */
  children: React.ReactNode;
  /** Whether the context menu is disabled */
  disabled?: boolean;
  /** Called when menu opens or closes */
  onOpenChange?: (open: boolean) => void;
  className?: string;
}
