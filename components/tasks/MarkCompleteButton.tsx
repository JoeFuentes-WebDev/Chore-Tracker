"use client";

import type { Chore } from "@/lib/types";

export interface MarkCompleteButtonProps {
  task: Chore;
  /** Called after the task transitions to PENDING. */
  onCompleted?: (task: Chore) => void;
}

// shadcn: Button. Visible only for CLAIMED tasks.
// PATCH /api/tasks/[id] with { status: "PENDING" }.
export function MarkCompleteButton(_props: MarkCompleteButtonProps) {
  // TODO: call PATCH with PENDING, optimistic update, inline error state.
  return null;
}
