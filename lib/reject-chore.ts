import { ChoreStatus } from "@prisma/client";

import type { FamilyScope } from "@/lib/family-scope";
import { prisma } from "@/lib/prisma";

export type RejectChoreResult =
  | { ok: true }
  | { ok: false; error: string };

/** Transition a chore from PENDING_APPROVAL back to IN_PROGRESS. */
export async function rejectChoreById(
  choreId: string,
  scope: FamilyScope,
): Promise<RejectChoreResult> {
  const result = await prisma.chore.updateMany({
    where: {
      id: choreId,
      familyId: scope.familyId,
      status: ChoreStatus.PENDING_APPROVAL,
    },
    data: { status: ChoreStatus.IN_PROGRESS },
  });

  if (result.count === 0) {
    return { ok: false, error: "This chore cannot be rejected." };
  }

  return { ok: true };
}
