import type { ChoreStatus, ProposalStatus } from "@/lib/constants/statuses";

export const CHORE_STATUS_LABELS: Record<ChoreStatus, string> = {
  AVAILABLE: "Available",
  CLAIMED: "Claimed",
  IN_PROGRESS: "In progress",
  PENDING_APPROVAL: "Pending approval",
  APPROVED: "Approved",
};

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  COUNTERED: "Countered",
  REJECTED: "Denied",
};
