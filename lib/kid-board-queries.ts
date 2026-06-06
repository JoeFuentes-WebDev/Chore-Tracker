import { ChoreStatus, type Chore } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { KidBoardChore, KidBoardData } from "@/lib/kid-board-types";

function serializeChore(chore: Chore): KidBoardChore {
  return {
    id: chore.id,
    name: chore.name,
    description: chore.description,
    reward: Number(chore.reward),
    status: chore.status,
  };
}

export interface KidBoardQueryContext {
  familyId: string;
  childUserId: string;
}

/** Kid board read model — scoped to family and child user. */
export async function getKidBoardData(
  context: KidBoardQueryContext,
): Promise<KidBoardData> {
  const { familyId, childUserId } = context;
  const familyScope = { familyId };

  const [earnings, paidEarnings, availableChores, activeChores] = await Promise.all([
    prisma.chore.aggregate({
      where: {
        ...familyScope,
        assignedUserId: childUserId,
        status: ChoreStatus.APPROVED,
        paid: false,
      },
      _sum: { reward: true },
    }),
    prisma.chore.aggregate({
      where: {
        ...familyScope,
        assignedUserId: childUserId,
        status: ChoreStatus.APPROVED,
        paid: true,
      },
      _sum: { reward: true },
    }),
    prisma.chore.findMany({
      where: {
        ...familyScope,
        status: ChoreStatus.AVAILABLE,
      },
      orderBy: { name: "asc" },
    }),
    prisma.chore.findMany({
      where: {
        ...familyScope,
        assignedUserId: childUserId,
        status: {
          in: [
            ChoreStatus.CLAIMED,
            ChoreStatus.IN_PROGRESS,
            ChoreStatus.PENDING_APPROVAL,
          ],
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return {
    earningsTotal: Number(earnings._sum.reward ?? 0),
    paidTotal: Number(paidEarnings._sum.reward ?? 0),
    availableChores: availableChores.map(serializeChore),
    activeChores: activeChores.map(serializeChore),
  };
}
