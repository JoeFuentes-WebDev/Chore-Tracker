import {
  ChoreCreator,
  ChoreStatus,
  ProposalStatus,
  type Proposal,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type AcceptProposalResult =
  | { ok: true; choreId: string }
  | { ok: false; error: string };

function buildAvailableChoreFromProposal(proposal: Proposal) {
  return {
    name: proposal.name,
    description: null as string | null,
    reward: proposal.askingReward,
    status: ChoreStatus.AVAILABLE,
    createdBy: ChoreCreator.CHILD,
    childId: null,
  };
}

/** Accept a pending proposal and create an AVAILABLE chore from it. */
export async function acceptProposalById(
  proposalId: string,
): Promise<AcceptProposalResult> {
  try {
    return await prisma.$transaction(async (tx) => {
      const proposal = await tx.proposal.findUnique({
        where: { id: proposalId },
        include: { createdChore: true },
      });

      if (!proposal) {
        return { ok: false, error: "Proposal not found." };
      }

      if (proposal.createdChore) {
        return { ok: true, choreId: proposal.createdChore.id };
      }

      if (proposal.status === ProposalStatus.ACCEPTED) {
        const chore = await tx.chore.create({
          data: {
            ...buildAvailableChoreFromProposal(proposal),
            sourceProposalId: proposal.id,
          },
        });

        return { ok: true, choreId: chore.id };
      }

      if (proposal.status !== ProposalStatus.PENDING) {
        return { ok: false, error: "This proposal cannot be accepted." };
      }

      const accepted = await tx.proposal.update({
        where: { id: proposalId, status: ProposalStatus.PENDING },
        data: {
          status: ProposalStatus.ACCEPTED,
          createdChore: {
            create: buildAvailableChoreFromProposal(proposal),
          },
        },
        include: { createdChore: true },
      });

      if (!accepted.createdChore) {
        throw new Error("ACCEPT_CHORE_CREATE_FAILED");
      }

      return { ok: true, choreId: accepted.createdChore.id };
    });
  } catch {
    return { ok: false, error: "This proposal cannot be accepted." };
  }
}
