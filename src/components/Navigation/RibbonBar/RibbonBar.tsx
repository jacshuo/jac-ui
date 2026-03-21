import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { RibbonBarProps, RibbonMode, RibbonItem, RibbonGroup, RibbonTab } from "./types";

export type { RibbonBarProps, RibbonMode, RibbonItem, RibbonGroup, RibbonTab };

/* ── Individual ribbon button ─────────────────── */
function RibbonButton({ item, mode }: { item: RibbonItem; mode: RibbonMode }) {
  if (item.separator) {
    return (
      <div className="mx-1 h-10 w-px self-center bg-primary-200 dark:bg-primary-700" aria-hidden />
    );
  }

  return (
    <button
      type="button"
      title={item.title ?? item.label}
      disabled={item.disabled}
      onClick={item.onClick}
      aria-pressed={item.active}
      className={cn(
        "relative flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
        "disabled:cursor-not-allowed disabled:opacity-40",
        item.active
          ? "bg-primary-100 text-primary-700 shadow-inner dark:bg-primary-800 dark:text-primary-200"
          : "text-primary-700 hover:bg-primary-50 active:bg-primary-100 dark:text-primary-300 dark:hover:bg-primary-800",
        mode === "full" ? "min-w-[3.5rem] flex-col gap-0.5 py-2" : "",
        "[&_svg]:shrink-0",
        mode === "full" ? "[&_svg]:h-5 [&_svg]:w-5" : "[&_svg]:h-4 [&_svg]:w-4",
      )}
    >
      {item.icon && <span>{item.icon}</span>}
      {mode !== "icons" && (
        <span className={cn(mode === "full" ? "text-[0.6rem] leading-tight" : "")}>
          {item.label}
        </span>
      )}
    </button>
  );
}

/* ── Group within a tab panel ─────────────────── */
function RibbonGroupPanel({
  group,
  mode,
  disabled: groupDisabled = false,
}: {
  group: RibbonGroup;
  mode: RibbonMode;
  disabled?: boolean;
}) {
  return (
    <div className={cn("flex shrink-0 flex-col items-stretch", groupDisabled && "opacity-50")}>
      <div className="flex items-center gap-0.5 px-1">
        {group.items.map((item) => (
          <RibbonButton
            key={item.key}
            item={groupDisabled ? { ...item, disabled: true } : item}
            mode={mode}
          />
        ))}
      </div>
      {mode === "full" && (
        <div className="mt-1 border-t border-primary-100 px-2 pt-0.5 text-center dark:border-primary-800">
          <span className="text-[0.55rem] text-secondary-400 dark:text-secondary-500">
            {group.label}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── RibbonBar ────────────────────────────────── */
export function RibbonBar({
  tabs,
  defaultTab,
  activeTab: controlledTab,
  onTabChange,
  mode: controlledMode,
  onModeChange,
  sticky = false,
  className,
}: RibbonBarProps) {
  const visibleTabs = tabs.filter((t) => !t.hidden);
  const [internalTab, setInternalTab] = useState<string>(defaultTab ?? visibleTabs[0]?.key ?? "");
  const [internalMode, setInternalMode] = useState<RibbonMode>(controlledMode ?? "full");
  const [panelOpen, setPanelOpen] = useState(true);

  const activeTabKey = controlledTab ?? internalTab;
  const mode = controlledMode ?? internalMode;

  const handleTabClick = (key: string) => {
    const tab = visibleTabs.find((t) => t.key === key);
    if (tab?.disabled) return;
    if (key === activeTabKey && mode !== "icons") {
      setPanelOpen((o) => !o);
      return;
    }
    setInternalTab(key);
    onTabChange?.(key);
    setPanelOpen(true);
  };

  const cycleMode = () => {
    const modes: RibbonMode[] = ["full", "compact", "icons"];
    const next = modes[(modes.indexOf(mode) + 1) % modes.length];
    setInternalMode(next);
    onModeChange?.(next);
    setPanelOpen(true);
  };

  const activeTabData = visibleTabs.find((t) => t.key === activeTabKey) ?? visibleTabs[0];

  return (
    <div
      className={cn(
        "select-none border-b border-primary-200 bg-white dark:border-primary-700 dark:bg-primary-900",
        sticky && "sticky top-0 z-30",
        className,
      )}
    >
      {/* Tab strip */}
      <div className="flex items-center border-b border-primary-100 dark:border-primary-800">
        <div className="flex flex-1 items-end overflow-x-auto">
          {visibleTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              disabled={tab.disabled}
              onClick={() => handleTabClick(tab.key)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 [&_svg]:h-4 [&_svg]:w-4",
                tab.disabled
                  ? "cursor-not-allowed border-transparent text-secondary-300 opacity-50 dark:text-secondary-600"
                  : tab.key === activeTabKey && panelOpen
                    ? "border-primary-500 text-primary-700 dark:border-primary-400 dark:text-primary-200"
                    : "border-transparent text-secondary-500 hover:border-primary-300 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-300",
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        {/* Collapse / expand toggle */}
        <button
          type="button"
          title={panelOpen ? "Collapse ribbon" : "Expand ribbon"}
          onClick={() => setPanelOpen((o) => !o)}
          className="ml-auto mr-2 rounded-md p-1.5 text-secondary-400 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-800 dark:hover:text-primary-300"
        >
          {panelOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Command panel — hidden when collapsed */}
      {panelOpen && activeTabData && mode !== "icons" && (
        <div className="flex items-stretch gap-1 overflow-x-auto px-2 py-1.5">
          {activeTabData.groups.map((group, gi) => (
            <React.Fragment key={group.key}>
              {gi > 0 && (
                <div className="mx-1 h-auto w-px self-stretch bg-primary-100 dark:bg-primary-800" />
              )}
              <RibbonGroupPanel
                group={group}
                mode={mode}
                disabled={group.disabled || activeTabData.disabled}
              />
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Icons-only mode — show all tabs' groups in a single icon row */}
      {mode === "icons" && panelOpen && activeTabData && (
        <div className="flex items-center gap-0.5 overflow-x-auto px-2 py-1">
          {activeTabData.groups.flatMap((g) =>
            g.items.map((item) => (
              <RibbonButton
                key={item.key}
                item={g.disabled || activeTabData.disabled ? { ...item, disabled: true } : item}
                mode="icons"
              />
            )),
          )}
        </div>
      )}
    </div>
  );
}
