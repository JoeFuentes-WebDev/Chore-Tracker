import { ChoreStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { KidHistoryChore, KidHistoryData } from "@/lib/kid-history-types";

export interface KidHistoryQueryContext {
  familyId: string;
  childUserId: string;
}

/** Approved chores for the signed-in child — earnings history tab. */
export async function getKidHistoryData(
  context: KidHistoryQueryContext,
): Promise<KidHistoryData> {
  const { familyId, childUserId } = context;

  const chores = await prisma.chore.findMany({
    where: {
      familyId,
      assignedUserId: childUserId,
      status: ChoreStatus.APPROVED,
    },
    orderBy: { updatedAt: "desc" },
  });

  const historyChores: KidHistoryChore[] = chores.map((chore) => ({
    id: chore.id,
    name: chore.name,
    description: chore.description,
    reward: Number(chore.reward),
    paid: chore.paid,
    completedAt: chore.updatedAt.toISOString(),
  }));

  const lifetimeEarningsTotal = historyChores.reduce(
    (sum, chore) => sum + chore.reward,
    0,
  );

  return { historyChores, lifetimeEarningsTotal };
}
