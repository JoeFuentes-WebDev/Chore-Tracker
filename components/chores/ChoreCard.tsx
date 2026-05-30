"use client";

import type { Chore } from "@/lib/types";

export interface ChoreCardProps {
  chore: Chore;
  /** "kid" shows a Claim action; "parent" shows Edit/Delete. Default "kid". */
  variant?: "kid" | "parent";
  /** Kid variant: claim the chore (POST /api/tasks). Optimistic on press. */
  onClaim?: (chore: Chore) => void;
  /** Parent variant: open EditChoreSheet. */
  onEdit?: (chore: Chore) => void;
  /** Parent variant: soft delete (PATCH /api/chores/[id] { isActive: false }). */
  onDelete?: (chore: Chore) => void;
}

// shadcn: Card, Badge, Button. Shows emoji, name, reward pill.
export function ChoreCard(_props: ChoreCardProps) {
  // TODO: render emoji, name, reward badge and variant-specific actions.
  return null;
}
