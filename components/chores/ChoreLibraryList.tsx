"use client";

import type { Chore } from "@/lib/types";

export interface ChoreLibraryListProps {
  /** Optional pre-fetched chores; otherwise fetches GET /api/chores itself. */
  chores?: Chore[];
}

// Parent /manage list: fetches GET /api/chores, groups by recurring vs one-time,
// renders the parent variant of ChoreCard (with Edit/Delete) per chore.
export function ChoreLibraryList(_props: ChoreLibraryListProps) {
  // TODO: fetch + group chores, handle loading/error, render parent ChoreCards.
  return null;
}
