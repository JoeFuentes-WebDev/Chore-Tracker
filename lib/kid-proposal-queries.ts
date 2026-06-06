import type { Proposal } from "@prisma/client";

import { getDefaultChildUser } from "@/lib/get-default-user";
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

/** Kid proposals read model — all proposals for the default child user. */
export async function getKidProposalsData(): Promise<KidProposalsData> {
  const childUser = await getDefaultChildUser();
  const proposals = await prisma.proposal.findMany({
    where: { proposedByUserId: childUser.id },
    orderBy: { createdAt: "desc" },
  });

  return { proposals: proposals.map(serializeProposal) };
}
