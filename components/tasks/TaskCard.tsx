"use client";

import type { Task } from "@/lib/types";

export interface TaskCardProps {
  task: Task;
  /**
   * When true, shows the Mark Complete action (only valid for CLAIMED tasks).
   * When false (e.g. history view), renders read-only with no action buttons.
   * Default true.
   */
  actionable?: boolean;
}

// shadcn: Card, Badge, Button. Shows emoji, name, reward, status badge.
export function TaskCard(_props: TaskCardProps) {
  // TODO: render task summary; if actionable && CLAIMED, show MarkCompleteButton.
  return null;
}
