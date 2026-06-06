import { ChoreStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type FinishChoreResult =
  | { ok: true }
  | { ok: false; error: string };

/** Transition a chore from IN_PROGRESS to PENDING_APPROVAL for the assigned user. */
export async function finishChoreForChild(
  choreId: string,
  userId: string,
): Promise<FinishChoreResult> {
  const result = await prisma.chore.updateMany({
    where: {
      id: choreId,
      status: ChoreStatus.IN_PROGRESS,
      assignedUserId: userId,
    },
    data: { status: ChoreStatus.PENDING_APPROVAL },
  });

  if (result.count === 0) {
    return { ok: false, error: "This chore cannot be submitted for approval." };
  }

  return { ok: true };
}
