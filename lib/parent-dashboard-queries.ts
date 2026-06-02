import { ChoreStatus } from "@prisma/client";

import { getParentApprovedBalance } from "@/lib/parent-balance-queries";
import { prisma } from "@/lib/prisma";
import type {
  ParentDashboardData,
  ParentPendingChore,
  ParentReviewProposal,
} from "@/lib/parent-dashboard-types";

/** Parent dashboard read model — pending approvals, proposals, and approved balance. */
export async function getParentDashboardData(): Promise<ParentDashboardData> {
  const [chores, proposals, approvedBalance] = await Promise.all([
    prisma.chore.findMany({
      where: { status: ChoreStatus.PENDING_APPROVAL },
      include: { child: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.proposal.findMany({
      include: { child: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    getParentApprovedBalance(),
  ]);

  const pendingChores: ParentPendingChore[] = chores.map((chore) => ({
    id: chore.id,
    name: chore.name,
    description: chore.description,
    reward: Number(chore.reward),
    childName: chore.child?.name ?? "Unknown",
    submittedAt: chore.updatedAt.toISOString(),
  }));

  const reviewProposals: ParentReviewProposal[] = proposals.map((proposal) => ({
    id: proposal.id,
    name: proposal.name,
    description: null,
    askingReward: Number(proposal.askingReward),
    childName: proposal.child.name,
    status: proposal.status,
    createdAt: proposal.createdAt.toISOString(),
  }));

  return { pendingChores, proposals: reviewProposals, approvedBalance };
}
