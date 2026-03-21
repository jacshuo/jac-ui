import type React from "react";

export type RibbonMode = "full" | "compact" | "icons";

export interface RibbonItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  /** Displays item as a separator */
  separator?: boolean;
  /** Marks item as active/pressed */
  active?: boolean;
  /** Tooltip shown on hover */
  title?: string;
}

export interface RibbonGroup {
  key: string;
  label: string;
  items: RibbonItem[];
  /** Disables all items in this group */
  disabled?: boolean;
}

export interface RibbonTab {
  key: string;
  label: string;
  icon?: React.ReactNode;
  groups: RibbonGroup[];
  /** Whether tab is hidden */
  hidden?: boolean;
  /** Disables the tab button and all groups/items inside it */
  disabled?: boolean;
}

export interface RibbonBarProps {
  /** Tabs that define the ribbon structure */
  tabs: RibbonTab[];
  /** Initially active tab key */
  defaultTab?: string;
  /** Controlled active tab */
  activeTab?: string;
  /** Called when tab changes */
  onTabChange?: (key: string) => void;
  /** Display mode */
  mode?: RibbonMode;
  /** Called when mode changes */
  onModeChange?: (mode: RibbonMode) => void;
  /** Whether ribbon is sticky to top of its container */
  sticky?: boolean;
  /** Extra class name */
  className?: string;
}
