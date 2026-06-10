import type { Chore } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { FamilyChoreLibraryItem } from "@/lib/family-chore-library-types";

function serializeChore(chore: Chore): FamilyChoreLibraryItem {
  return {
    id: chore.id,
    name: chore.name,
    description: chore.description,
    reward: Number(chore.reward),
    status: chore.status,
    paid: chore.paid,
  };
}

/** All family chores for the parent manage-tab chore library. */
export async function getFamilyChoreLibrary(
  familyId: string,
): Promise<FamilyChoreLibraryItem[]> {
  const chores = await prisma.chore.findMany({
    where: { familyId },
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });

  return chores.map(serializeChore);
}
