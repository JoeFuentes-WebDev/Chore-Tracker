import { getChildBoardPath } from "@/lib/auth/child-auth-paths";
import { getParentDashboardPath } from "@/lib/auth/parent-auth-paths";

export interface NotificationMessage {
  title: string;
  body: string;
  url: string;
}

function formatReward(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

interface ChoreAssignedMessageInput {
  choreName: string;
  reward: number;
}

export function buildChoreAssignedMessage(
  input: ChoreAssignedMessageInput,
): NotificationMessage {
  return {
    title: "New chore available",
    body: `${input.choreName} — ${formatReward(input.reward)}`,
    url: getChildBoardPath(),
  };
}

interface ChoreCompletedMessageInput {
  choreName: string;
  childName: string;
}

export function buildChoreCompletedMessage(
  input: ChoreCompletedMessageInput,
): NotificationMessage {
  return {
    title: "Chore ready for review",
    body: `${input.childName} finished ${input.choreName}`,
    url: getParentDashboardPath(),
  };
}

interface ProposalSubmittedMessageInput {
  proposalName: string;
  childName: string;
  askingReward: number;
}

export function buildProposalSubmittedMessage(
  input: ProposalSubmittedMessageInput,
): NotificationMessage {
  return {
    title: "New chore proposal",
    body: `${input.childName} proposed ${input.proposalName} for ${formatReward(input.askingReward)}`,
    url: getParentDashboardPath(),
  };
}

interface ProposalApprovedMessageInput {
  proposalName: string;
}

export function buildProposalApprovedMessage(
  input: ProposalApprovedMessageInput,
): NotificationMessage {
  return {
    title: "Proposal approved",
    body: `Your proposal "${input.proposalName}" was approved`,
    url: getChildBoardPath(),
  };
}

interface ProposalDeniedMessageInput {
  proposalName: string;
}

export function buildProposalDeniedMessage(
  input: ProposalDeniedMessageInput,
): NotificationMessage {
  return {
    title: "Proposal not approved",
    body: `Your proposal "${input.proposalName}" was not approved`,
    url: getChildBoardPath(),
  };
}
