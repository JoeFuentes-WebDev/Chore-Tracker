"use client";

import type { AppMode } from "@/lib/types";

export interface BottomNavProps {
  /** Current mode determines which nav items are shown. */
  mode: AppMode;
}

// Fixed bottom nav (plain Tailwind — not a third-party nav lib). Active route
// highlighted. Items by mode:
//   Kid:    Board | Propose | History
//   Parent: Dashboard | Manage | History | Settings
// Tap targets >= 44x44px; never overlaps content (pages add padding-bottom).
export function BottomNav(_props: BottomNavProps) {
  // TODO: render mode-specific links, highlight the active route.
  return null;
}
