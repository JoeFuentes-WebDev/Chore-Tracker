import { ProposalStatus } from "@prisma/client";

import { getDefaultChildUser, getDefaultFamily } from "@/lib/get-default-user";
import { prisma } from "@/lib/prisma";

export interface CreateProposalInput {
  name: string;
  askingReward: number;
}

export type CreateProposalResult =
  | { ok: true; proposalId: string }
  | { ok: false; error: string };

function validateCreateProposalInput(input: CreateProposalInput): string | null {
  const name = input.name.trim();
  if (!name) {
    return "Name is required.";
  }

  if (!Number.isFinite(input.askingReward) || input.askingReward <= 0) {
    return "Requested reward must be greater than zero.";
  }

  return null;
}

/** Create a child proposal in PENDING status. */
export async function createProposalForChild(
  input: CreateProposalInput,
): Promise<CreateProposalResult> {
  const validationError = validateCreateProposalInput(input);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const [family, childUser] = await Promise.all([
    getDefaultFamily(),
    getDefaultChildUser(),
  ]);

  const proposal = await prisma.proposal.create({
    data: {
      name: input.name.trim(),
      askingReward: input.askingReward,
      status: ProposalStatus.PENDING,
      familyId: family.id,
      proposedByUserId: childUser.id,
      childId: childUser.id,
    },
  });

  return { ok: true, proposalId: proposal.id };
}
