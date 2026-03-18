import { describe, it, expect } from "vitest";
import * as lib from "../index";

describe("Public API exports", () => {
  const expected = [
    // Utilities
    "cn",
    // Theme variants
    "buttonVariants",
    "badgeVariants",
    "inputVariants",
    "cardVariants",
    "panelVariants",
    "labelVariants",
    "tableVariants",
    "listVariants",
    "accordionVariants",
    "tabListVariants",
    "tabTriggerVariants",
    "dialogContentVariants",
    "tooltipVariants",
    "alertVariants",
    // Primitives
    "Button",
    "Dropdown",
    "DropdownButton",
    "Badge",
    "Label",
    "Input",
    // Layout
    "Card",
    "CardHeader",
    "CardTitle",
    "CardDescription",
    "CardContent",
    "CardFooter",
    "HorizontalCard",
    "ImageCard",
    "ImageCardBody",
    "ImageCardTitle",
    "ImageCardDescription",
    "ImageCardActions",
    "Panel",
    "PanelHeader",
    "PanelContent",
    // Data Display
    "Table",
    "TableHeader",
    "TableBody",
    "TableRow",
    "TableHead",
    "TableCell",
    "SortableTable",
    "DataTable",
    "List",
    "ListItem",
    "Tree",
    "TreeItem",
    "Chat",
    // Navigation
    "SideNav",
    "Header",
    // Disclosure
    "Accordion",
    "AccordionItem",
    "AccordionTrigger",
    "AccordionContent",
    "Tabs",
    "TabList",
    "TabTrigger",
    "TabPanels",
    "TabContent",
    // Overlay
    "Dialog",
    "DialogContent",
    "DialogHeader",
    "DialogTitle",
    "DialogDescription",
    "DialogFooter",
    "DialogClose",
    "Tooltip",
    // Feedback
    "Alert",
    "AlertTitle",
    "AlertDescription",
    "useAlert",
    "configureAlertTopOffset",
    // Extras
    "FilmReel",
    "MiniPlayer",
    "CinePlayer",
    "FileExplorer",
  ];

  it.each(expected)("exports %s", (name) => {
    expect((lib as Record<string, unknown>)[name]).toBeDefined();
  });

  it("exports are functions or objects", () => {
    for (const name of expected) {
      const val = (lib as Record<string, unknown>)[name];
      expect(["function", "object"].includes(typeof val)).toBe(true);
    }
  });
});
