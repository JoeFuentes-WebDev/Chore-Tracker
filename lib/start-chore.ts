import { ChoreStatus } from "@prisma/client";

import type { FamilyScope } from "@/lib/family-scope";
import { prisma } from "@/lib/prisma";

export type StartChoreResult =
  | { ok: true }
  | { ok: false; error: string };

/** Transition a chore from CLAIMED to IN_PROGRESS for the assigned user. */
export async function startChoreForChild(
  choreId: string,
  userId: string,
  scope: FamilyScope,
): Promise<StartChoreResult> {
  const result = await prisma.chore.updateMany({
    where: {
      id: choreId,
      familyId: scope.familyId,
      status: ChoreStatus.CLAIMED,
      assignedUserId: userId,
    },
    data: { status: ChoreStatus.IN_PROGRESS },
  });

  if (result.count === 0) {
    return { ok: false, error: "This chore cannot be started." };
  }

  return { ok: true };
}
