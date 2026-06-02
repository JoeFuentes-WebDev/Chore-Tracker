import { ChoreStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { ParentApprovedBalance } from "@/lib/parent-dashboard-types";

/** Parent approved balance read model — sum and count of unpaid approved chores. */
export async function getParentApprovedBalance(): Promise<ParentApprovedBalance> {
  const result = await prisma.chore.aggregate({
    where: {
      status: ChoreStatus.APPROVED,
      paid: false,
    },
    _sum: { reward: true },
    _count: { _all: true },
  });

  return {
    total: Number(result._sum.reward ?? 0),
    choreCount: result._count._all,
  };
}
