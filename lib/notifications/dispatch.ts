import { NotificationEvent } from "@/lib/constants/statuses";
import {
  buildChoreAssignedMessage,
  buildChoreCompletedMessage,
  buildProposalApprovedMessage,
  buildProposalDeniedMessage,
  buildProposalSubmittedMessage,
} from "@/lib/notifications/build-messages";
import {
  getFamilyChildUserIds,
  getFamilyParentUserIds,
} from "@/lib/notifications/resolve-recipients";
import { sendNotification, sendNotificationToMany } from "@/lib/notifications/send-notification";
import { prisma } from "@/lib/prisma";

/** Parent created a new AVAILABLE chore — notify all children. */
export async function dispatchChoreAssigned(
  familyId: string,
  choreId: string,
): Promise<void> {
  const chore = await prisma.chore.findFirst({
    where: { id: choreId, familyId },
    select: { name: true, reward: true },
  });

  if (!chore) {
    return;
  }

  const childUserIds = await getFamilyChildUserIds(familyId);
  const message = buildChoreAssignedMessage({
    choreName: chore.name,
    reward: Number(chore.reward),
  });

  await sendNotificationToMany(childUserIds, () => ({
    event: NotificationEvent.CHORE_ASSIGNED,
    title: message.title,
    body: message.body,
    url: message.url,
  }));
}

/** Child submitted a proposal — notify all parents. */
export async function dispatchProposalSubmitted(
  familyId: string,
  proposalId: string,
): Promise<void> {
  const proposal = await prisma.proposal.findFirst({
    where: { id: proposalId, familyId },
    include: { author: { select: { name: true } } },
  });

  if (!proposal) {
    return;
  }

  const parentUserIds = await getFamilyParentUserIds(familyId);
  const message = buildProposalSubmittedMessage({
    proposalName: proposal.name,
    childName: proposal.author.name,
    askingReward: Number(proposal.askingReward),
  });

  await sendNotificationToMany(parentUserIds, () => ({
    event: NotificationEvent.PROPOSAL_SUBMITTED,
    title: message.title,
    body: message.body,
    url: message.url,
  }));
}

/** Parent approved a proposal — notify the proposing child. */
export async function dispatchProposalApproved(proposalId: string): Promise<void> {
  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    select: { name: true, proposedByUserId: true },
  });

  if (!proposal) {
    return;
  }

  const message = buildProposalApprovedMessage({ proposalName: proposal.name });

  await sendNotification({
    recipientUserId: proposal.proposedByUserId,
    event: NotificationEvent.PROPOSAL_APPROVED,
    title: message.title,
    body: message.body,
    url: message.url,
  });
}

/** Parent denied a proposal — notify the proposing child. */
export async function dispatchProposalDenied(proposalId: string): Promise<void> {
  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    select: { name: true, proposedByUserId: true },
  });

  if (!proposal) {
    return;
  }

  const message = buildProposalDeniedMessage({ proposalName: proposal.name });

  await sendNotification({
    recipientUserId: proposal.proposedByUserId,
    event: NotificationEvent.PROPOSAL_DENIED,
    title: message.title,
    body: message.body,
    url: message.url,
  });
}

/** Child completed a chore — notify all parents. */
export async function dispatchChoreCompleted(
  familyId: string,
  choreId: string,
  childUserId: string,
): Promise<void> {
  const [chore, child] = await Promise.all([
    prisma.chore.findFirst({
      where: { id: choreId, familyId },
      select: { name: true },
    }),
    prisma.user.findUnique({
      where: { id: childUserId },
      select: { name: true },
    }),
  ]);

  if (!chore || !child) {
    return;
  }

  const parentUserIds = await getFamilyParentUserIds(familyId);
  const message = buildChoreCompletedMessage({
    choreName: chore.name,
    childName: child.name,
  });

  await sendNotificationToMany(parentUserIds, () => ({
    event: NotificationEvent.CHORE_COMPLETED,
    title: message.title,
    body: message.body,
    url: message.url,
  }));
}
