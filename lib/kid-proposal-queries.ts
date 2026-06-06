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

/** Kid proposals read model — scoped to child user. */
export async function getKidProposalsData(
  childUserId: string,
): Promise<KidProposalsData> {
  const proposals = await prisma.proposal.findMany({
    where: { proposedByUserId: childUserId },
    orderBy: { createdAt: "desc" },
  });

  return { proposals: proposals.map(serializeProposal) };
}
