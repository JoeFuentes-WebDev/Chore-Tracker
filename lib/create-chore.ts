import { ChoreCreator, ChoreStatus } from "@prisma/client";

import { getDefaultFamily } from "@/lib/get-default-user";
import { prisma } from "@/lib/prisma";

export interface CreateChoreInput {
  name: string;
  description?: string;
  reward: number;
}

export type CreateChoreResult =
  | { ok: true; choreId: string }
  | { ok: false; error: string };

function validateCreateChoreInput(input: CreateChoreInput): string | null {
  const name = input.name.trim();
  if (!name) {
    return "Name is required.";
  }

  if (!Number.isFinite(input.reward) || input.reward <= 0) {
    return "Reward must be greater than zero.";
  }

  return null;
}

/** Create a parent-authored chore in AVAILABLE status. */
export async function createChore(input: CreateChoreInput): Promise<CreateChoreResult> {
  const validationError = validateCreateChoreInput(input);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const family = await getDefaultFamily();
  const description = input.description?.trim() ?? "";
  const chore = await prisma.chore.create({
    data: {
      name: input.name.trim(),
      description: description.length > 0 ? description : null,
      reward: input.reward,
      status: ChoreStatus.AVAILABLE,
      familyId: family.id,
      createdBy: ChoreCreator.PARENT,
    },
  });

  return { ok: true, choreId: chore.id };
}
