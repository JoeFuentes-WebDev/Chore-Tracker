"use client";

import type { AppMode } from "@/lib/types";

export interface ModeToggleProps {
  /** Current mode. When omitted, the component reads/writes localStorage itself. */
  mode?: AppMode;
  /** Called when the user switches modes. */
  onChange?: (mode: AppMode) => void;
}

// Persistent Kid/Parent toggle, stored in localStorage (not a DB concept).
// Rendered at the top of every page. shadcn Tabs or a two-button toggle group.
// Switching also changes the visible content and BottomNav items.
export function ModeToggle(_props: ModeToggleProps) {
  // TODO: read/persist mode from localStorage, render toggle, call onChange.
  return null;
}
