// Shared application types.
//
// Domain model types come from Prisma (@prisma/client) after `prisma generate`.
// Re-exported here so components and routes import from one place.

export type {
  Chore,
  Task,
  Proposal,
  NotificationLog,
  Settings,
} from "@prisma/client";

export {
  Creator,
  TaskStatus,
  ProposalStatus,
  NotificationStatus,
} from "@prisma/client";

import type { TaskStatus, ProposalStatus } from "@prisma/client";

// ---------------------------------------------------------------------------
// Client-side mode toggle (localStorage, not persisted in DB) — see 6.1 / 7.5
// ---------------------------------------------------------------------------

export type AppMode = "kid" | "parent";

// ---------------------------------------------------------------------------
// API request body shapes (see section 5)
// ---------------------------------------------------------------------------

export interface CreateChoreBody {
  name: string;
  emoji: string;
  reward: number;
  recurring: boolean;
}

export type UpdateChoreBody = Partial<{
  name: string;
  emoji: string;
  reward: number;
  recurring: boolean;
  isActive: boolean;
}>;

export interface CreateTaskBody {
  choreId: string;
}

export interface UpdateTaskBody {
  status: Extract<TaskStatus, "PENDING" | "APPROVED" | "REJECTED">;
  reward?: number; // optional override, used on proposal approvals
}

export interface CreateProposalBody {
  name: string;
  emoji: string;
  suggestedReward: number;
}

export interface UpdateProposalBody {
  status: Extract<ProposalStatus, "APPROVED" | "REJECTED">;
  approvedReward?: number;
}

export interface UpdateSettingsBody {
  parentPhone?: string;
}

export interface NotifyBody {
  taskId: string;
  phone: string;
  message: string;
}

export interface NotifyResult {
  success: boolean;
  sid?: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// Generic API error shape (see section 11)
// ---------------------------------------------------------------------------

export interface ApiError {
  error: string;
}
