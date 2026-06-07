// Shared application types.
//
// Domain model types come from Prisma (@prisma/client) after `prisma generate`.
// Re-exported here so components and routes import from one place.

export type {
  Family,
  User,
  FamilyMembership,
  Invitation,
  Chore,
  Proposal,
  NotificationLog,
} from "@prisma/client";

export * from "@/lib/constants/statuses";

import type { ProposalStatus } from "@/lib/constants/statuses";

// ---------------------------------------------------------------------------
// Client-side mode toggle (localStorage, not persisted in DB) — see 6.1 / 7.5
// ---------------------------------------------------------------------------

export type AppMode = "kid" | "parent";

// ---------------------------------------------------------------------------
// API request body shapes (see section 5)
// ---------------------------------------------------------------------------

export interface CreateChoreBody {
  name: string;
  description?: string;
  reward: number;
}

export type UpdateChoreBody = Partial<{
  name: string;
  description: string;
  reward: number;
}>;

export interface CreateProposalBody {
  name: string;
  askingReward: number;
}

export interface UpdateProposalBody {
  status: Extract<ProposalStatus, "ACCEPTED" | "COUNTERED" | "REJECTED">;
  counterReward?: number;
}

export interface UpdateFamilyBody {
  parentPhone?: string;
  pin?: string;
}

export interface NotifyBody {
  choreId?: string;
  event: string;
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
