import type { ProposalStatus } from "@prisma/client";

/** Serializable pending-approval chore for the parent dashboard. */
export interface ParentPendingChore {
  id: string;
  name: string;
  description: string | null;
  reward: number;
  childName: string;
  submittedAt: string;
}

/** Serializable proposal for parent proposal review. */
export interface ParentReviewProposal {
  id: string;
  name: string;
  description: string | null;
  askingReward: number;
  childName: string;
  status: ProposalStatus;
  createdAt: string;
}

export interface ParentDashboardData {
  pendingChores: ParentPendingChore[];
  proposals: ParentReviewProposal[];
}
