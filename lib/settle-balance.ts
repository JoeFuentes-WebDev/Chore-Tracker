import { ChoreStatus } from "@prisma/client";

import type { FamilyScope } from "@/lib/family-scope";
import { prisma } from "@/lib/prisma";

export type SettleBalanceResult =
  | { ok: true; settledCount: number }
  | { ok: false; error: string };

/** Mark all approved unpaid chores as paid in a single transaction. */
export async function settleApprovedBalance(
  scope: FamilyScope,
): Promise<SettleBalanceResult> {
  const settledCount = await prisma.$transaction(async (tx) => {
    const updated = await tx.chore.updateMany({
      where: {
        familyId: scope.familyId,
        status: ChoreStatus.APPROVED,
        paid: false,
      },
      data: { paid: true },
    });

    return updated.count;
  });

  if (settledCount === 0) {
    return { ok: false, error: "No approved balance to pay." };
  }

  return { ok: true, settledCount };
}
