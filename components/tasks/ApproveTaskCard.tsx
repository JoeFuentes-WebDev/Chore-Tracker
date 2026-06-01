"use client";

import type { Chore } from "@/lib/types";

export interface ApproveTaskCardProps {
  task: Chore;
  /** Called after the task is approved (PATCH { status: "APPROVED" }). */
  onApprove?: (task: Chore) => void;
  /** Called after the task is rejected (PATCH { status: "REJECTED" }). */
  onReject?: (task: Chore) => void;
}

// shadcn: Card, Button, Dialog (reject confirmation). Shows chore name, emoji,
// reward, completion timestamp with Approve / Reject actions.
export function ApproveTaskCard(_props: ApproveTaskCardProps) {
  // TODO: render task detail + Approve/Reject (PATCH /api/tasks/[id]).
  return null;
}
