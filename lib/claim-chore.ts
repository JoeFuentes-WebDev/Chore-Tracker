import { ChoreStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type ClaimChoreResult =
  | { ok: true }
  | { ok: false; error: string };

/** Transition a chore from AVAILABLE to CLAIMED and assign it to the child user. */
export async function claimChoreForChild(
  choreId: string,
  userId: string,
): Promise<ClaimChoreResult> {
  const result = await prisma.chore.updateMany({
    where: { id: choreId, status: ChoreStatus.AVAILABLE },
    data: {
      status: ChoreStatus.CLAIMED,
      assignedUserId: userId,
      childId: userId,
    },
  });

  if (result.count === 0) {
    return { ok: false, error: "This chore is no longer available." };
  }

  return { ok: true };
}
