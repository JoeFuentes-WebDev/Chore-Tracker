"use client";

import {
  ClipboardCheck,
  History,
  LayoutGrid,
  Lightbulb,
  Settings,
  Wrench,
} from "lucide-react";

import type { AppMode } from "@/lib/types";
import { cn } from "@/lib/utils";

export type KidTabId = "board" | "propose" | "history";
export type ParentTabId = "review" | "manage" | "settings";

export interface BottomNavProps {
  mode: AppMode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutGrid;
}

const kidNavItems: NavItem[] = [
  { id: "board", label: "Board", icon: LayoutGrid },
  { id: "propose", label: "Propose", icon: Lightbulb },
  { id: "history", label: "History", icon: History },
];

const parentNavItems: NavItem[] = [
  { id: "review", label: "Review", icon: ClipboardCheck },
  { id: "manage", label: "Manage", icon: Wrench },
  { id: "settings", label: "Settings", icon: Settings },
];

function NavButton({
  item,
  isActive,
  onSelect,
}: {
  item: NavItem;
  isActive: boolean;
  onSelect: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-0.5 px-2 py-1",
        isActive ? "text-blue-600" : "text-muted-foreground",
      )}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span className="text-xs font-medium">{item.label}</span>
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 h-1 w-1 rounded-full",
          isActive ? "bg-blue-600" : "bg-transparent",
        )}
      />
    </button>
  );
}

export function BottomNav({ mode, activeTab, onTabChange }: BottomNavProps) {
  const items = mode === "kid" ? kidNavItems : parentNavItems;

  function handleTabSelect(tabId: string) {
    onTabChange(tabId);
  }

  return (
    <nav
      aria-label={mode === "kid" ? "Kid navigation" : "Parent navigation"}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background"
    >
      <div className="mx-auto flex max-w-lg">
        {items.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            isActive={activeTab === item.id}
            onSelect={() => handleTabSelect(item.id)}
          />
        ))}
      </div>
    </nav>
  );
}
