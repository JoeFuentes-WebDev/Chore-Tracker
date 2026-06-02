import type { Proposal } from "@prisma/client";

import { getDefaultChild } from "@/lib/get-default-child";
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

/** Kid proposals read model — all proposals for the default child. */
export async function getKidProposalsData(): Promise<KidProposalsData> {
  const child = await getDefaultChild();
  const proposals = await prisma.proposal.findMany({
    where: { childId: child.id },
    orderBy: { createdAt: "desc" },
  });

  return { proposals: proposals.map(serializeProposal) };
}
