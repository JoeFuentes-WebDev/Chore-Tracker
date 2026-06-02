import { ChoreStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type ApproveChoreResult =
  | { ok: true }
  | { ok: false; error: string };

/** Transition a chore from PENDING_APPROVAL to APPROVED (unpaid). */
export async function approveChoreById(choreId: string): Promise<ApproveChoreResult> {
  const result = await prisma.chore.updateMany({
    where: {
      id: choreId,
      status: ChoreStatus.PENDING_APPROVAL,
    },
    data: {
      status: ChoreStatus.APPROVED,
      paid: false,
    },
  });

  if (result.count === 0) {
    return { ok: false, error: "This chore cannot be approved." };
  }

  return { ok: true };
}
