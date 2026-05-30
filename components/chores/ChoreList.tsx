"use client";

import type { Chore } from "@/lib/types";

export interface ChoreListProps {
  /**
   * Optional pre-fetched chores. When omitted, the component fetches
   * GET /api/chores itself and owns its loading/error state.
   */
  chores?: Chore[];
}

// Kid board list: fetches GET /api/chores, filters recurring = true and excludes
// chores that already have an active Task (CLAIMED or PENDING). Renders ChoreCard.
export function ChoreList(_props: ChoreListProps) {
  // TODO: fetch + filter chores, handle loading/error, render ChoreCard list.
  return null;
}
