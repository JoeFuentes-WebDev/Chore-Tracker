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

/** Kid board read model — unpaid approved earnings, available, and active chores. */
export async function getKidBoardData(): Promise<KidBoardData> {
  const [earnings, availableChores, activeChores] = await Promise.all([
    prisma.chore.aggregate({
      where: { status: ChoreStatus.APPROVED, paid: false },
      _sum: { reward: true },
    }),
    prisma.chore.findMany({
      where: { status: ChoreStatus.AVAILABLE },
      orderBy: { name: "asc" },
    }),
    prisma.chore.findMany({
      where: {
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
    availableChores: availableChores.map(serializeChore),
    activeChores: activeChores.map(serializeChore),
  };
}
