export type TimelineStatus = "pending" | "active" | "complete" | "error";
export type TimelineOrientation = "vertical" | "horizontal";

export interface TimelineAction {
  /** Button/link label */
  label: string;
  /** Leading icon */
  icon?: React.ReactNode;
  /** Click handler (renders a <button>) */
  onClick?: () => void;
  /** Destination URL — renders an <a> that opens in a new tab */
  href?: string;
  /** "primary" → solid right-aligned CTA; default → ghost left-aligned */
  variant?: "default" | "primary";
}

export interface TimelineItem {
  /** Unique key */
  id?: string | number;
  /** Card title */
  title: string;
  /** Card description text or element */
  description?: React.ReactNode;
  /** Timestamp / label */
  date?: string;
  /** Custom icon inside the dot */
  icon?: React.ReactNode;
  /** Image URL — full-width header banner (top) or sidebar column (left) */
  image?: string;
  /** Where to display `image`: "top" = banner header (default) | "left" = sidebar beside content */
  imagePosition?: "top" | "left";
  /** Array of image URLs — mosaic gallery rendered below the description */
  images?: string[];
  /** Inline SVG string or React SVG element */
  svg?: React.ReactNode;
  /** Item status */
  status?: TimelineStatus;
  /** Action buttons shown in the card footer */
  actions?: TimelineAction[];
  /** Extra class for this item */
  className?: string;
}

import type React from "react";
