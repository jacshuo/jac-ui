import type React from "react";

export type CommandItem = {
  /** Unique ID for this command */
  id: string;
  /** Primary display label */
  label: string;
  /** Optional sub-label / description shown below the label */
  description?: string;
  /** Optional icon element */
  icon?: React.ReactNode;
  /** Keyboard shortcut badge displayed on the right, e.g. ["⌘", "K"] */
  shortcut?: string[];
  /** Group heading this item belongs to (ungrouped if omitted) */
  group?: string;
  /** Extra search terms that don't appear in the UI */
  keywords?: string[];
  /** Disabled items appear dimmed and are not selectable */
  disabled?: boolean;
  /** Called when the user selects this command */
  onSelect: () => void;
};

export type CommandGroup = {
  label: string;
  items: CommandItem[];
};

export type CommandPaletteProps = {
  /** Controlled open state */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Full list of available commands */
  commands: CommandItem[];
  /** Placeholder text inside the search input */
  placeholder?: string;
  /**
   * Register a global Ctrl/Cmd+K hotkey to toggle the palette.
   * @default true
   */
  hotkey?: boolean;
  /**
   * Maximum number of result rows visible before the list scrolls.
   * @default 8
   */
  maxItems?: number;
  /** Extra class applied to the dialog panel */
  className?: string;
};
