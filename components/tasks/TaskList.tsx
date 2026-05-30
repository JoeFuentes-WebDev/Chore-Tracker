"use client";

import type { Task, TaskStatus } from "@/lib/types";

export interface TaskListProps {
  /** Optional pre-fetched tasks; otherwise fetches GET /api/tasks itself. */
  tasks?: Task[];
  /** Optional status filter, mapped to GET /api/tasks?status=... */
  status?: TaskStatus;
  /** Whether rendered TaskCards expose actions. Default true. */
  actionable?: boolean;
}

// Generic list of TaskCards. Owns its own loading/error state when fetching.
export function TaskList(_props: TaskListProps) {
  // TODO: fetch (optionally by status), handle loading/error, render TaskCards.
  return null;
}
