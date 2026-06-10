import { ChoreStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export interface UpdateChoreInput {
  choreId: string;
  familyId: string;
  name: string;
  description?: string;
  reward: number;
}

export type UpdateChoreResult = { ok: true } | { ok: false; error: string };

function validateUpdateChoreInput(input: UpdateChoreInput): string | null {
  const name = input.name.trim();
  if (!name) {
    return "Name is required.";
  }

  if (!Number.isFinite(input.reward) || input.reward <= 0) {
    return "Reward must be greater than zero.";
  }

  return null;
}

/** Update an AVAILABLE chore in the family library. */
export async function updateChore(input: UpdateChoreInput): Promise<UpdateChoreResult> {
  const validationError = validateUpdateChoreInput(input);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const existing = await prisma.chore.findFirst({
    where: { id: input.choreId, familyId: input.familyId },
    select: { status: true },
  });

  if (!existing) {
    return { ok: false, error: "Chore not found." };
  }

  if (existing.status !== ChoreStatus.AVAILABLE) {
    return { ok: false, error: "Only available chores can be edited." };
  }

  const description = input.description?.trim() ?? "";
  await prisma.chore.update({
    where: { id: input.choreId },
    data: {
      name: input.name.trim(),
      description: description.length > 0 ? description : null,
      reward: input.reward,
    },
  });

  return { ok: true };
}
