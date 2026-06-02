import { ChoreCreator, ChoreStatus, ProposalStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type AcceptProposalResult =
  | { ok: true; choreId: string }
  | { ok: false; error: string };

/** Accept a pending proposal and create an AVAILABLE chore from it. */
export async function acceptProposalById(
  proposalId: string,
): Promise<AcceptProposalResult> {
  const chore = await prisma.$transaction(async (tx) => {
    const updated = await tx.proposal.updateMany({
      where: { id: proposalId, status: ProposalStatus.PENDING },
      data: { status: ProposalStatus.ACCEPTED },
    });

    if (updated.count === 0) {
      return null;
    }

    const proposal = await tx.proposal.findUniqueOrThrow({
      where: { id: proposalId },
    });

    return tx.chore.create({
      data: {
        name: proposal.name,
        description: null,
        reward: proposal.askingReward,
        status: ChoreStatus.AVAILABLE,
        createdBy: ChoreCreator.CHILD,
        sourceProposalId: proposal.id,
      },
    });
  });

  if (!chore) {
    return { ok: false, error: "This proposal cannot be accepted." };
  }

  return { ok: true, choreId: chore.id };
}
