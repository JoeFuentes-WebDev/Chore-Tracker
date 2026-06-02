import { ProposalStatus } from "@prisma/client";

import { getDefaultChild } from "@/lib/get-default-child";
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

  const child = await getDefaultChild();
  const proposal = await prisma.proposal.create({
    data: {
      name: input.name.trim(),
      askingReward: input.askingReward,
      status: ProposalStatus.PENDING,
      childId: child.id,
    },
  });

  return { ok: true, proposalId: proposal.id };
}
