/**
 * Application status constants — safe for Client Components.
 * Values match Prisma schema enums; server code may still use @prisma/client.
 */

export const ChoreStatus = {
  AVAILABLE: "AVAILABLE",
  CLAIMED: "CLAIMED",
  IN_PROGRESS: "IN_PROGRESS",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  APPROVED: "APPROVED",
} as const;

export type ChoreStatus = (typeof ChoreStatus)[keyof typeof ChoreStatus];

export const ChoreCreator = {
  PARENT: "PARENT",
  CHILD: "CHILD",
} as const;

export type ChoreCreator = (typeof ChoreCreator)[keyof typeof ChoreCreator];

export const ProposalStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  COUNTERED: "COUNTERED",
  REJECTED: "REJECTED",
} as const;

export type ProposalStatus = (typeof ProposalStatus)[keyof typeof ProposalStatus];

export const NotificationStatus = {
  SENT: "SENT",
  FAILED: "FAILED",
} as const;

export type NotificationStatus =
  (typeof NotificationStatus)[keyof typeof NotificationStatus];

export const NotificationEvent = {
  CHORE_CLAIMED: "CHORE_CLAIMED",
  CHORE_UNCLAIMED: "CHORE_UNCLAIMED",
  CHORE_COMPLETED: "CHORE_COMPLETED",
  PROPOSAL_SUBMITTED: "PROPOSAL_SUBMITTED",
  PIN_RESET: "PIN_RESET",
} as const;

export type NotificationEvent =
  (typeof NotificationEvent)[keyof typeof NotificationEvent];
