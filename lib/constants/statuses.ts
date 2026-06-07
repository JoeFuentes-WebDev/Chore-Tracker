/**
 * Application status constants — safe for Client Components.
 * Values match Prisma schema enums; server code may still use @prisma/client.
 */

export const UserRole = {
  PARENT: "PARENT",
  CHILD: "CHILD",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

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
  CHORE_ASSIGNED: "CHORE_ASSIGNED",
  PROPOSAL_SUBMITTED: "PROPOSAL_SUBMITTED",
  PROPOSAL_APPROVED: "PROPOSAL_APPROVED",
  PROPOSAL_DENIED: "PROPOSAL_DENIED",
  PIN_RESET: "PIN_RESET",
} as const;

export type NotificationEvent =
  (typeof NotificationEvent)[keyof typeof NotificationEvent];
