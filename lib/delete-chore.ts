import { ChoreStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export interface DeleteChoreInput {
  choreId: string;
  familyId: string;
}

export type DeleteChoreResult = { ok: true } | { ok: false; error: string };

/** Delete an AVAILABLE chore from the family library. */
export async function deleteChore(input: DeleteChoreInput): Promise<DeleteChoreResult> {
  const existing = await prisma.chore.findFirst({
    where: { id: input.choreId, familyId: input.familyId },
    select: { status: true },
  });

  if (!existing) {
    return { ok: false, error: "Chore not found." };
  }

  if (existing.status !== ChoreStatus.AVAILABLE) {
    return { ok: false, error: "Only available chores can be deleted." };
  }

  await prisma.chore.delete({ where: { id: input.choreId } });

  return { ok: true };
}
