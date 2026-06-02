import { ChoreStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type {
  ParentDashboardData,
  ParentPendingChore,
} from "@/lib/parent-dashboard-types";

/** Parent dashboard read model — chores awaiting approval. */
export async function getParentDashboardData(): Promise<ParentDashboardData> {
  const chores = await prisma.chore.findMany({
    where: { status: ChoreStatus.PENDING_APPROVAL },
    include: { child: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const pendingChores: ParentPendingChore[] = chores.map((chore) => ({
    id: chore.id,
    name: chore.name,
    description: chore.description,
    reward: Number(chore.reward),
    childName: chore.child?.name ?? "Unknown",
    submittedAt: chore.updatedAt.toISOString(),
  }));

  return { pendingChores };
}
