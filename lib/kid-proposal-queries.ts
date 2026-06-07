import type { Proposal } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { KidProposal, KidProposalsData } from "@/lib/kid-proposal-types";

function serializeProposal(proposal: Proposal): KidProposal {
  return {
    id: proposal.id,
    name: proposal.name,
    askingReward: Number(proposal.askingReward),
    status: proposal.status,
    createdAt: proposal.createdAt.toISOString(),
  };
}

export interface KidProposalsQueryContext {
  childUserId: string;
  familyId: string;
}

/** Kid proposals read model — scoped to child user and family. */
export async function getKidProposalsData(
  context: KidProposalsQueryContext,
): Promise<KidProposalsData> {
  const proposals = await prisma.proposal.findMany({
    where: {
      proposedByUserId: context.childUserId,
      familyId: context.familyId,
    },
    orderBy: { createdAt: "desc" },
  });

  return { proposals: proposals.map(serializeProposal) };
}
