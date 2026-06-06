import { ProposalStatus } from "@prisma/client";

import type { FamilyScope } from "@/lib/family-scope";
import { prisma } from "@/lib/prisma";

export type DenyProposalResult =
  | { ok: true }
  | { ok: false; error: string };

/** Deny a pending proposal without creating a chore. */
export async function denyProposalById(
  proposalId: string,
  scope: FamilyScope,
): Promise<DenyProposalResult> {
  const result = await prisma.proposal.updateMany({
    where: {
      id: proposalId,
      familyId: scope.familyId,
      status: ProposalStatus.PENDING,
    },
    data: { status: ProposalStatus.REJECTED },
  });

  if (result.count === 0) {
    return { ok: false, error: "This proposal cannot be denied." };
  }

  return { ok: true };
}
